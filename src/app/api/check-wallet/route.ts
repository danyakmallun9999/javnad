// File: src/app/api/check-wallet/route.ts

import { ethers } from 'ethers';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address || !ethers.isAddress(address)) {
        return Response.json({ error: 'Alamat wallet tidak valid' }, { status: 400 });
    }

    try {
        const rpcUrl = `https://monad-testnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
        const provider = new ethers.JsonRpcProvider(rpcUrl);

        // Ambil data dasar terlebih dahulu (hanya endpoint yang confirmed supported)
        const [
            balance,
            txCount,
            code,
            latestBlock,
            feeData,
            network,
            clientVersion,
            storageAtSlot0, // Data baru: Ambil nilai storage di slot 0
            chainId,
            syncing
        ] = await Promise.all([
            provider.getBalance(address),
            provider.getTransactionCount(address),
            provider.getCode(address),
            provider.getBlock('latest'),
            provider.getFeeData(),
            provider.getNetwork(),
            provider.send('web3_clientVersion', []),
            provider.getStorage(address, 0), // Memanggil eth_getStorageAt(address, slot 0)
            provider.send('eth_chainId', []), // Chain ID dari network
            provider.send('eth_syncing', []) // Sync status
        ]);

        // Try to get protocol version (might not be supported)
        let protocolVersion = 'Not available';
        try {
            protocolVersion = await provider.send('eth_protocolVersion', []);
        } catch {
            console.log('eth_protocolVersion not supported');
        }

        const latestBlockNumber = latestBlock?.number ?? 0;
        // Data baru: Ambil saldo dari 1000 blok yang lalu
        // Ini harus dipanggil setelah kita mendapatkan nomor blok terbaru
        const historicalBalance = await provider.getBalance(address, latestBlockNumber - 1000);

        const gasPrice = feeData.gasPrice ?? 0;

        return Response.json({
            wallet: {
                balance: ethers.formatEther(balance),
                txCount,
                isContract: code !== '0x',
                storageAtSlot0,
                historicalBalance: ethers.formatEther(historicalBalance),
            },
            network: {
                clientVersion,
                chainId: chainId || network.chainId.toString(),
                protocolVersion,
                syncing: syncing === false ? 'Synced' : 'Syncing',
                latestBlock: {
                    number: latestBlock?.number.toString(),
                    hash: latestBlock?.hash,
                    timestamp: latestBlock?.timestamp,
                    transactionCount: latestBlock?.transactions.length,
                },
                gasPrice: ethers.formatUnits(gasPrice, 'gwei'),
            }
        });

    } catch (error: unknown) {
        console.error(error);
        return Response.json({ error: (error as Error).message || 'Gagal mengambil data' }, { status: 500 });
    }
}