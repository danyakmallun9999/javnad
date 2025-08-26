import axios from 'axios';
import { Utils } from 'alchemy-sdk';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return Response.json({ error: 'Alamat wallet dibutuhkan' }, { status: 400 });
  }

  const apiKey = process.env.ALCHEMY_API_KEY; // Menggunakan server-side env var
  const alchemyUrl = `https://monad-testnet.g.alchemy.com/v2/${apiKey}`;

  try {
    // 1. Ambil saldo token menggunakan AXIOS
    const balancesResponse = await axios.post(alchemyUrl, {
      jsonrpc: "2.0",
      id: 1,
      method: "alchemy_getTokenBalances",
      params: [address, "erc20"],
    });

    const balancesResult = balancesResponse.data.result;

    if (!balancesResult || !balancesResult.tokenBalances) {
      return Response.json({ tokens: [] });
    }

    const tokenData = [];
    // 2. Untuk setiap token, ambil metadatanya juga menggunakan AXIOS
    for (const token of balancesResult.tokenBalances) {
      if (token.tokenBalance === "0x0" || token.tokenBalance === "0") continue;

      try {
        const metadataResponse = await axios.post(alchemyUrl, {
          jsonrpc: "2.0",
          id: 1,
          method: "alchemy_getTokenMetadata",
          params: [token.contractAddress],
        });
        
        const metadata = metadataResponse.data.result;
        if (!metadata || !metadata.decimals) continue; // Pastikan metadata valid

        const balance = Utils.formatUnits(
          token.tokenBalance!,
          metadata.decimals
        );

        // Hanya tampilkan token dengan balance > 0
        if (parseFloat(balance) > 0) {
          tokenData.push({
            name: metadata.name || 'Unknown Token',
            symbol: metadata.symbol || 'UNKNOWN',
            balance: parseFloat(balance).toFixed(6),
            contractAddress: token.contractAddress,
            decimals: metadata.decimals
          });
        }
      } catch (metadataError) {
        console.warn(`Failed to get metadata for token ${token.contractAddress}:`, metadataError);
        continue;
      }
    }

    return Response.json({ tokens: tokenData });

  } catch (error: unknown) {
    console.error("========================");
    const err = error as { response?: { data?: unknown }; message?: string };
    // Jika menggunakan axios, 'error.response.data' seringkali berisi info error dari server
    console.error("ERROR DARI AXIOS:", err.response?.data || err.message);
    console.error("========================");

    const errorMessage = (err.response?.data as { error?: { message?: string } })?.error?.message || err.message || 'Terjadi kesalahan.';
    return Response.json({ error: `Gagal mengambil data token: ${errorMessage}` }, { status: 500 });
  }
}