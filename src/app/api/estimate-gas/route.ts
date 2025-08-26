// File: src/app/api/estimate-gas/route.ts
// Endpoint untuk estimasi gas dan create access list

import { ethers } from 'ethers';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { from, to, value, data } = body;

        if (!from || !to) {
            return Response.json({ 
                error: 'Parameter from dan to harus diisi' 
            }, { status: 400 });
        }

        const rpcUrl = `https://monad-testnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
        const provider = new ethers.JsonRpcProvider(rpcUrl);

        // Prepare transaction object
        const txObject = {
            from,
            to,
            value: value || '0x0',
            data: data || '0x'
        };

        // Parallel calls untuk mendapatkan berbagai estimasi
        const [
            gasEstimate,
            accessList,
            gasPrice,
            maxPriorityFee
        ] = await Promise.all([
            provider.send('eth_estimateGas', [txObject]),
            provider.send('eth_createAccessList', [txObject]).catch(() => null), // Optional, might not be supported
            provider.send('eth_gasPrice', []),
            provider.send('eth_maxPriorityFeePerGas', [])
        ]);

        // Calculate estimated transaction cost
        const estimatedCost = BigInt(gasEstimate) * BigInt(gasPrice);

        return Response.json({
            gasEstimate: parseInt(gasEstimate, 16),
            gasPrice: {
                current: ethers.formatUnits(gasPrice, 'gwei'),
                maxPriorityFee: ethers.formatUnits(maxPriorityFee, 'gwei')
            },
            estimatedCost: {
                wei: estimatedCost.toString(),
                eth: ethers.formatEther(estimatedCost),
                gwei: ethers.formatUnits(estimatedCost, 'gwei')
            },
            accessList: accessList || 'Not supported',
            transaction: txObject
        });

    } catch (error: unknown) {
        console.error('Gas estimation error:', error);
        return Response.json({ 
            error: (error as Error).message || 'Gagal melakukan estimasi gas' 
        }, { status: 500 });
    }
}
