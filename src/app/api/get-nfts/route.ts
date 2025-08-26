import { ethers } from 'ethers';

// ERC-721 ABI untuk fungsi yang kita butuhkan
const ERC721_ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)',
    'function tokenURI(uint256 tokenId) view returns (string)',
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function supportsInterface(bytes4 interfaceId) view returns (bool)'
];

// ERC-721 Interface ID
const ERC721_INTERFACE_ID = '0x80ac58cd';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
        return Response.json({ error: 'Alamat wallet dibutuhkan' }, { status: 400 });
    }

    const apiKey = process.env.ALCHEMY_API_KEY;
    const rpcUrl = `https://monad-testnet.g.alchemy.com/v2/${apiKey}`;

    try {
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const nfts = [];

        // Scan ERC-721 Transfer events untuk menemukan NFT yang dimiliki
        try {
            const latestBlock = await provider.getBlockNumber();
            const totalBlocks = 2000; // Total blok untuk scan
            const batchSize = 500; // Maximum batch size untuk Alchemy
            const fromBlock = Math.max(0, latestBlock - totalBlocks);
            
            // ERC-721 Transfer event signature: Transfer(address,address,uint256)
            const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
            
            let receivedLogs: ethers.Log[] = [];
            let sentLogs: ethers.Log[] = [];
            
            // Batch scanning untuk menghindari limit 500 blok
            for (let start = fromBlock; start < latestBlock; start += batchSize) {
                const end = Math.min(start + batchSize - 1, latestBlock);
                
                try {
                    // Cari NFT yang diterima oleh address ini
                    const batchReceivedLogs = await provider.getLogs({
                        fromBlock: start,
                        toBlock: end,
                        topics: [
                            transferTopic,
                            null, // from
                            ethers.zeroPadValue(address, 32) // to (wallet address)
                        ]
                    });
                    receivedLogs = receivedLogs.concat(batchReceivedLogs);

                    // Cari NFT yang dikirim dari address ini (untuk exclude yang sudah ditransfer)
                    const batchSentLogs = await provider.getLogs({
                        fromBlock: start,
                        toBlock: end,
                        topics: [
                            transferTopic,
                            ethers.zeroPadValue(address, 32), // from (wallet address)
                            null // to
                        ]
                    });
                    sentLogs = sentLogs.concat(batchSentLogs);
                } catch (batchError) {
                    console.warn(`Failed to scan NFT batch ${start}-${end}:`, batchError);
                    continue;
                }
            }

            // Extract contract addresses dan token IDs
            const receivedTokens = new Map();
            const sentTokens = new Set();

            // Process received tokens
            receivedLogs.forEach(log => {
                const tokenId = ethers.getBigInt(log.topics[3] || '0x0').toString();
                const key = `${log.address}-${tokenId}`;
                receivedTokens.set(key, {
                    contractAddress: log.address,
                    tokenId: tokenId
                });
            });

            // Process sent tokens (to exclude from owned list)
            sentLogs.forEach(log => {
                const tokenId = ethers.getBigInt(log.topics[3] || '0x0').toString();
                const key = `${log.address}-${tokenId}`;
                sentTokens.add(key);
            });

            // Filter to get currently owned tokens
            const ownedTokens = Array.from(receivedTokens.entries())
                .filter(([key]) => !sentTokens.has(key))
                .map(([, token]) => token);

            // Limit untuk performa (maksimal 20 NFT)
            const tokensToCheck = ownedTokens.slice(0, 20);

            // Get metadata untuk setiap NFT
            for (const token of tokensToCheck) {
                try {
                    const contract = new ethers.Contract(token.contractAddress, ERC721_ABI, provider);
                    
                    // Verify it's actually an ERC-721
                    const isERC721 = await contract.supportsInterface(ERC721_INTERFACE_ID).catch(() => false);
                    if (!isERC721) continue;

                    // Verify ownership (double check)
                    const actualOwner = await provider.call({
                        to: token.contractAddress,
                        data: ethers.concat([
                            '0x6352211e', // ownerOf(uint256)
                            ethers.zeroPadValue(ethers.toBeHex(token.tokenId), 32)
                        ])
                    }).catch(() => '0x');

                    if (actualOwner.length >= 42) {
                        const owner = '0x' + actualOwner.slice(-40);
                        if (owner.toLowerCase() !== address.toLowerCase()) {
                            continue; // Not owned anymore
                        }
                    }

                    const [name, symbol, tokenURI] = await Promise.all([
                        contract.name().catch(() => 'Unknown Collection'),
                        contract.symbol().catch(() => 'UNKNOWN'),
                        contract.tokenURI(token.tokenId).catch(() => '')
                    ]);

                    // Parse metadata dari tokenURI jika tersedia
                    let metadata = { name: `${name} #${token.tokenId}`, image: '' };
                    if (tokenURI) {
                        try {
                            if (tokenURI.startsWith('data:application/json')) {
                                const jsonData = JSON.parse(atob(tokenURI.split(',')[1]));
                                metadata = {
                                    name: jsonData.name || `${name} #${token.tokenId}`,
                                    image: jsonData.image || ''
                                };
                            } else if (tokenURI.startsWith('http')) {
                                // Untuk HTTP URLs, kita skip fetch untuk sekarang karena CORS
                                metadata.image = tokenURI;
                            }
                        } catch {
                            console.warn(`Failed to parse metadata for ${token.contractAddress}:${token.tokenId}`);
                        }
                    }

                    nfts.push({
                        contract: {
                            address: token.contractAddress,
                            name: String(name),
                            symbol: String(symbol)
                        },
                        tokenId: token.tokenId,
                        title: metadata.name,
                        media: [{
                            gateway: metadata.image || `https://via.placeholder.com/150?text=${encodeURIComponent(name + ' #' + token.tokenId)}`
                        }]
                    });

                } catch (error) {
                    console.warn(`Failed to process NFT ${token.contractAddress}:${token.tokenId}:`, error);
                    continue;
                }
            }

        } catch (scanError) {
            console.warn('NFT scanning failed:', scanError);
        }

        return Response.json({ ownedNfts: nfts });

    } catch (error: unknown) {
        const err = error as { message?: string };
        console.error("ERROR dalam NFT scanning:", err.message);
        return Response.json({ error: `Gagal mengambil data NFT: ${err.message || 'Unknown error'}` }, { status: 500 });
    }
}