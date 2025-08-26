// File: src/app/api/get-nfts-blockvision/route.ts
// NFT data menggunakan Blockvision API untuk Monad

interface BlockvisionNFTActivity {
  transactionHash: string;
  method: string;
  blockNumber: number;
  timestamp: number;
  from: string;
  to: string;
  type: string;
  nft: {
    name: string;
    contractAddress: string;
    tokenId: string;
    image: string;
    qty: string;
    collectionName: string;
    verified: boolean;
  };
  fromAddress: {
    address: string;
    type: string;
    isContract: boolean;
    verified: boolean;
    ens?: string;
    name?: string;
    isContractCreated: boolean;
  };
  toAddress: {
    address: string;
    type: string;
    isContract: boolean;
    verified: boolean;
    ens?: string;
    name?: string;
    isContractCreated: boolean;
  };
}

interface BlockvisionResponse {
  code: number;
  reason?: string;
  message: string;
  result: {
    data: BlockvisionNFTActivity[];
    nextPageCursor: string;
    total: number;
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const limit = searchParams.get('limit') || '50'; // Max limit untuk data lengkap
  const cursor = searchParams.get('cursor') || '';

  if (!address) {
    return Response.json({ error: 'Alamat wallet dibutuhkan' }, { status: 400 });
  }

  try {
    // Check if Blockvision API key is available
    const blockvisionApiKey = process.env.BLOCKVISION_API_KEY;
    
    if (!blockvisionApiKey) {
      return Response.json({ 
        error: 'Blockvision API key tidak tersedia. Gunakan provider Alchemy sebagai alternatif.',
        details: 'BLOCKVISION_API_KEY environment variable is not set'
      }, { status: 503 });
    }

    // Panggil Blockvision API dengan format yang benar
    const blockvisionUrl = new URL('https://api.blockvision.org/v2/monad/collection/activities');
    blockvisionUrl.searchParams.set('address', address);
    blockvisionUrl.searchParams.set('limit', limit);
    blockvisionUrl.searchParams.set('ascendingOrder', 'false'); // Newest first
    
    if (cursor) {
      blockvisionUrl.searchParams.set('cursor', cursor);
    }

    console.log('Fetching NFTs from Blockvision:', blockvisionUrl.toString());

    const response = await fetch(blockvisionUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Monad-Wallet-Checker/1.0',
        'X-API-KEY': blockvisionApiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Blockvision API error: ${response.status} ${response.statusText}`);
    }

    const data: BlockvisionResponse = await response.json();

    if (data.code !== 0) {
      throw new Error(`Blockvision API error: ${data.reason || data.message}`);
    }

    // Transform data untuk format yang konsisten dengan aplikasi
    const transformedNFTs = data.result.data.map((activity) => {
      const isReceived = activity.to.toLowerCase() === address.toLowerCase();
      const isOwned = isReceived || activity.method === 'mint';

      return {
        // Basic NFT info
        contractAddress: activity.nft.contractAddress,
        tokenId: activity.nft.tokenId,
        name: activity.nft.name || activity.nft.collectionName || 'Untitled NFT',
        title: activity.nft.name || activity.nft.collectionName || 'Untitled NFT',
        image: activity.nft.image || '',
        collectionName: activity.nft.collectionName,
        verified: activity.nft.verified,
        
        // Activity info
        method: activity.method, // mint, transfer, etc.
        transactionHash: activity.transactionHash,
        blockNumber: activity.blockNumber,
        timestamp: activity.timestamp,
        type: activity.type, // ERC721, ERC1155
        qty: activity.nft.qty,
        
        // Ownership info
        from: activity.from,
        to: activity.to,
        isReceived,
        isOwned,
        
        // Address details
        fromAddress: activity.fromAddress,
        toAddress: activity.toAddress,
        
        // Formatted for existing components
        contract: {
          address: activity.nft.contractAddress
        },
        media: [{
          gateway: activity.nft.image || 'https://via.placeholder.com/150?text=NFT'
        }]
      };
    });

    // Filter untuk NFT yang dimiliki (received atau minted)
    const ownedNFTs = transformedNFTs.filter(nft => nft.isOwned);

    // Group by contract + tokenId untuk menghindari duplikasi
    const uniqueNFTs = new Map();
    ownedNFTs.forEach(nft => {
      const key = `${nft.contractAddress}-${nft.tokenId}`;
      if (!uniqueNFTs.has(key) || nft.timestamp > uniqueNFTs.get(key).timestamp) {
        uniqueNFTs.set(key, nft);
      }
    });

    const finalNFTs = Array.from(uniqueNFTs.values());

    return Response.json({
      nfts: finalNFTs,
      total: data.result.total,
      nextPageCursor: data.result.nextPageCursor,
      activities: transformedNFTs, // Semua aktivitas untuk analisis
      summary: {
        owned: finalNFTs.length,
        totalActivities: data.result.total,
        collections: [...new Set(finalNFTs.map(nft => nft.contractAddress))].length,
        minted: transformedNFTs.filter(nft => nft.method === 'mint' && nft.isReceived).length,
        received: transformedNFTs.filter(nft => nft.method === 'transfer' && nft.isReceived).length,
        sent: transformedNFTs.filter(nft => nft.method === 'transfer' && !nft.isReceived).length
      }
    });

  } catch (error: unknown) {
    console.error('Blockvision NFT fetch error:', error);
    const err = error as Error;
    return Response.json({ 
      error: `Gagal mengambil data NFT: ${err.message}`,
      details: err.message 
    }, { status: 500 });
  }
}
