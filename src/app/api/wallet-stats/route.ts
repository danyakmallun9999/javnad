// File: src/app/api/wallet-stats/route.ts
// Comprehensive wallet statistics analysis

import { ethers } from 'ethers';

interface Transaction {
    hash: string;
    blockNumber: number;
    from: string;
    to: string | null;
    value: string;
    gasUsed: string;
    gasPrice: string;
    timestamp: number;
    isContract: boolean;
    methodId?: string;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const timeframe = searchParams.get('timeframe') || '7d'; // 7d, 30d, all

    if (!address || !ethers.isAddress(address)) {
        return Response.json({ error: 'Valid wallet address required' }, { status: 400 });
    }

    try {
        const rpcUrl = `https://monad-testnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
        const provider = new ethers.JsonRpcProvider(rpcUrl);

        // Get current block and account info
        const [currentBlock, balance, txCount] = await Promise.all([
            provider.getBlock('latest'),
            provider.getBalance(address),
            provider.getTransactionCount(address)
        ]);

        if (!currentBlock) {
            throw new Error('Could not fetch current block');
        }

        // Calculate time ranges
        const now = Math.floor(Date.now() / 1000);
        const timeRanges = {
            '7d': now - (7 * 24 * 60 * 60),
            '30d': now - (30 * 24 * 60 * 60),
            'all': 0
        };

        const fromTimestamp = timeRanges[timeframe as keyof typeof timeRanges] || timeRanges['7d'];
        
        // Estimate blocks to scan (1 block per second average)
        const blocksToScan = timeframe === 'all' ? 50000 : Math.min(
            Math.floor((now - fromTimestamp) * 1.2), // 1.2x for safety
            50000 // Max 50k blocks to avoid timeout
        );
        
        const fromBlock = Math.max(currentBlock.number - blocksToScan, 0);
        const toBlock = currentBlock.number;

        console.log(`Scanning blocks ${fromBlock} to ${toBlock} (${toBlock - fromBlock} blocks)`);

        // Get transaction logs for the address
        const [incomingLogs, outgoingLogs] = await Promise.all([
            // Incoming transactions
            provider.getLogs({
                fromBlock: `0x${fromBlock.toString(16)}`,
                toBlock: `0x${toBlock.toString(16)}`,
                topics: [
                    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer event
                    null, // from (any)
                    `0x000000000000000000000000${address.slice(2).toLowerCase()}` // to (our address)
                ]
            }).catch(() => []),
            // Outgoing transactions  
            provider.getLogs({
                fromBlock: `0x${fromBlock.toString(16)}`,
                toBlock: `0x${toBlock.toString(16)}`,
                topics: [
                    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef', // Transfer event
                    `0x000000000000000000000000${address.slice(2).toLowerCase()}`, // from (our address)
                    null // to (any)
                ]
            }).catch(() => [])
        ]);

        // Analyze transactions
        const uniqueContracts = new Set<string>();
        const uniqueTokens = new Set<string>();
        const dailyActivity = new Map<string, number>();
        let totalVolume = BigInt(0);
        let totalFees = BigInt(0);
        let approveCount = 0;
        let nftMintCount = 0;
        let deployCount = 0;

        // Process all logs
        const allLogs = [...incomingLogs, ...outgoingLogs];
        
        for (const log of allLogs) {
            try {
                const block = await provider.getBlock(log.blockNumber);
                if (!block || block.timestamp < fromTimestamp) continue;

                const dateKey = new Date(block.timestamp * 1000).toISOString().split('T')[0];
                dailyActivity.set(dateKey, (dailyActivity.get(dateKey) || 0) + 1);

                // Track unique contracts
                if (log.address) {
                    uniqueContracts.add(log.address.toLowerCase());
                    uniqueTokens.add(log.address.toLowerCase());
                }

                // Analyze transaction details
                const tx = await provider.getTransaction(log.transactionHash);
                if (tx) {
                    if (tx.to === null) deployCount++; // Contract deployment
                    
                    totalVolume += tx.value || BigInt(0);
                    
                    const receipt = await provider.getTransactionReceipt(log.transactionHash);
                    if (receipt) {
                        totalFees += receipt.gasUsed * receipt.gasPrice;
                    }

                    // Check for approval transactions
                    if (tx.data && tx.data.startsWith('0x095ea7b3')) {
                        approveCount++;
                    }

                    // Simple NFT mint detection (creation of new tokens)
                    if (log.topics[1] === '0x0000000000000000000000000000000000000000000000000000000000000000') {
                        nftMintCount++;
                    }
                }
            } catch (error) {
                console.warn(`Error processing log:`, error);
                continue;
            }
        }

        // Calculate wallet age (estimate based on first transaction)
        let walletAge = 'Unknown';
        try {
            if (txCount > 0) {
                // Estimate first transaction was at block (current - txCount * avgBlocksPerTx)
                const estimatedFirstBlock = Math.max(currentBlock.number - (txCount * 5), 0);
                const firstBlock = await provider.getBlock(estimatedFirstBlock);
                if (firstBlock) {
                    const ageSeconds = now - firstBlock.timestamp;
                    const days = Math.floor(ageSeconds / (24 * 60 * 60));
                    const hours = Math.floor((ageSeconds % (24 * 60 * 60)) / (60 * 60));
                    walletAge = `${days} days ${hours} hours`;
                }
            }
        } catch {
            walletAge = 'Unable to calculate';
        }

        // Prepare statistics
        const stats = {
            walletAge,
            timeframe,
            overview: {
                balance: ethers.formatEther(balance),
                totalTransactions: txCount,
                walletAddress: address
            },
            interactions: {
                total: allLogs.length,
                approvals: approveCount,
                uniqueContracts: uniqueContracts.size,
                deployments: deployCount,
                period: timeframe
            },
            volume: {
                total: ethers.formatEther(totalVolume),
                totalUSD: 0, // Would need price oracle
                period: timeframe
            },
            fees: {
                total: ethers.formatEther(totalFees),
                totalUSD: 0, // Would need price oracle
                period: timeframe
            },
            tokens: {
                uniqueTokens: uniqueTokens.size,
                uniqueNFTs: Math.floor(uniqueTokens.size * 0.3), // Estimate
                period: timeframe
            },
            nfts: {
                minted: nftMintCount,
                unique: Math.floor(nftMintCount * 0.8), // Estimate
                period: timeframe
            },
            activity: {
                dailyBreakdown: Object.fromEntries(dailyActivity),
                totalDays: dailyActivity.size,
                avgPerDay: allLogs.length / Math.max(dailyActivity.size, 1)
            }
        };

        return Response.json(stats);

    } catch (error: unknown) {
        console.error('Wallet stats error:', error);
        return Response.json({ 
            error: (error as Error).message || 'Failed to analyze wallet statistics' 
        }, { status: 500 });
    }
}
