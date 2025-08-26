// File: src/app/api/network-info/route.ts
// Endpoint baru untuk mendapatkan informasi network yang lebih detail

import { ethers } from 'ethers';

export async function GET() {
    try {
        const rpcUrl = `https://monad-testnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
        const provider = new ethers.JsonRpcProvider(rpcUrl);

        // Ambil berbagai informasi network menggunakan endpoint yang supported
        const [
            blockNumber,
            gasPrice,
            chainId,
            clientVersion,
            syncing
        ] = await Promise.all([
            provider.send('eth_blockNumber', []), // Latest block number
            provider.send('eth_gasPrice', []), // Current gas price
            provider.send('eth_chainId', []), // Chain ID
            provider.send('web3_clientVersion', []), // Client version
            provider.send('eth_syncing', []) // Sync status
        ]);

        // Try to get additional info, but handle errors gracefully
        let maxPriorityFeePerGas = null;
        let netVersion = null;
        
        try {
            maxPriorityFeePerGas = await provider.send('eth_maxPriorityFeePerGas', []);
        } catch {
            console.log('eth_maxPriorityFeePerGas not supported');
        }
        
        try {
            netVersion = await provider.send('net_version', []);
        } catch {
            console.log('net_version not supported');
        }

        // Try to get fee history
        let feeHistory = null;
        try {
            feeHistory = await provider.send('eth_feeHistory', [
                '0x14', // 20 blocks
                'latest',
                [25, 50, 75] // Percentiles for priority fees
            ]);
        } catch {
            console.log('eth_feeHistory not supported');
        }

        return Response.json({
            blockNumber: parseInt(blockNumber, 16),
            chainId: parseInt(chainId, 16),
            gasPrice: {
                current: ethers.formatUnits(gasPrice, 'gwei'),
                maxPriorityFee: maxPriorityFeePerGas ? ethers.formatUnits(maxPriorityFeePerGas, 'gwei') : 'Not available',
                history: feeHistory || 'Not available'
            },
            network: {
                syncing: syncing === false ? 'Synced' : 'Syncing',
                version: netVersion || 'Not available',
                clientVersion
            }
        });

    } catch (error: unknown) {
        console.error('Network info error:', error);
        return Response.json({ 
            error: (error as Error).message || 'Gagal mengambil informasi network' 
        }, { status: 500 });
    }
}
