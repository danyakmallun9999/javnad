// File: src/app/api/get-tx/route.ts

import { ethers } from 'ethers';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const txHash = searchParams.get('hash');

    // Validasi sederhana untuk hash transaksi
    if (!txHash || !/^0x([A-Fa-f0-9]{64})$/.test(txHash)) {
        return Response.json({ error: 'Hash transaksi tidak valid' }, { status: 400 });
    }

    try {
        const rpcUrl = `https://monad-testnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
        const provider = new ethers.JsonRpcProvider(rpcUrl);

        // Ambil data transaksi dan receipt-nya
        const [transaction, receipt] = await Promise.all([
            provider.getTransaction(txHash),
            provider.getTransactionReceipt(txHash)
        ]);

        if (!transaction || !receipt) {
            return Response.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
        }

        // Hitung biaya transaksi
        const txFee = ethers.formatEther(receipt.gasUsed * receipt.gasPrice);

        return Response.json({
            hash: transaction.hash,
            blockNumber: transaction.blockNumber,
            from: transaction.from,
            to: transaction.to,
            value: ethers.formatEther(transaction.value),
            gasUsed: receipt.gasUsed.toString(),
            gasPrice: ethers.formatUnits(receipt.gasPrice, 'gwei'),
            txFee: txFee,
            status: receipt.status === 1 ? 'Success' : 'Failed',
        });

    } catch (error: unknown) {
        console.error(error);
        return Response.json({ error: (error as Error).message || 'Gagal mengambil data transaksi' }, { status: 500 });
    }
}