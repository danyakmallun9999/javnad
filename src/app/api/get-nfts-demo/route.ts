// File: src/app/api/get-nfts-demo/route.ts
// Demo data untuk menunjukkan fungsionalitas Blockvision API

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return Response.json({ error: 'Alamat wallet dibutuhkan' }, { status: 400 });
  }

  // Simulate loading delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock NFT data yang meniru struktur Blockvision API
  const mockNFTs = [
    {
      contractAddress: '0x43D1CF839F5A39A63D90920d1A738697DDbE42bD',
      tokenId: '1001',
      name: 'Monad Genesis NFT #1001',
      title: 'Monad Genesis NFT #1001',
      image: 'https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=Genesis+%231001',
      collectionName: 'Monad Genesis Collection',
      verified: true,
      method: 'mint',
      transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
      blockNumber: 33100000,
      timestamp: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
      type: 'ERC721',
      qty: '1',
      from: '0x0000000000000000000000000000000000000000',
      to: address,
      isReceived: true,
      isOwned: true,
      contract: {
        address: '0x43D1CF839F5A39A63D90920d1A738697DDbE42bD'
      },
      media: [{
        gateway: 'https://via.placeholder.com/300x300/4F46E5/FFFFFF?text=Genesis+%231001'
      }]
    },
    {
      contractAddress: '0x567890ABCDEF1234567890ABCDEF1234567890AB',
      tokenId: '2023',
      name: 'Monad Art #2023',
      title: 'Monad Art #2023',
      image: 'https://via.placeholder.com/300x300/10B981/FFFFFF?text=Art+%232023',
      collectionName: 'Monad Digital Art',
      verified: true,
      method: 'transfer',
      transactionHash: '0xabcdef1234567890abcdef1234567890abcdef12',
      blockNumber: 33050000,
      timestamp: Math.floor(Date.now() / 1000) - 172800, // 2 days ago
      type: 'ERC721',
      qty: '1',
      from: '0x1111111111111111111111111111111111111111',
      to: address,
      isReceived: true,
      isOwned: true,
      contract: {
        address: '0x567890ABCDEF1234567890ABCDEF1234567890AB'
      },
      media: [{
        gateway: 'https://via.placeholder.com/300x300/10B981/FFFFFF?text=Art+%232023'
      }]
    },
    {
      contractAddress: '0x789ABCDEF0123456789ABCDEF0123456789ABCDE',
      tokenId: '555',
      name: 'Monad Utility Token #555',
      title: 'Monad Utility Token #555',
      image: 'https://via.placeholder.com/300x300/F59E0B/FFFFFF?text=Utility+%23555',
      collectionName: 'Monad Utility NFTs',
      verified: false,
      method: 'mint',
      transactionHash: '0xfedcba0987654321fedcba0987654321fedcba09',
      blockNumber: 33000000,
      timestamp: Math.floor(Date.now() / 1000) - 259200, // 3 days ago
      type: 'ERC1155',
      qty: '5',
      from: '0x0000000000000000000000000000000000000000',
      to: address,
      isReceived: true,
      isOwned: true,
      contract: {
        address: '0x789ABCDEF0123456789ABCDEF0123456789ABCDE'
      },
      media: [{
        gateway: 'https://via.placeholder.com/300x300/F59E0B/FFFFFF?text=Utility+%23555'
      }]
    },
    {
      contractAddress: '0xDEMO1234567890ABCDEF1234567890ABCDEF1234',
      tokenId: '777',
      name: 'Rare Monad Badge #777',
      title: 'Rare Monad Badge #777',
      image: 'https://via.placeholder.com/300x300/EF4444/FFFFFF?text=Badge+%23777',
      collectionName: 'Monad Achievement Badges',
      verified: true,
      method: 'transfer',
      transactionHash: '0x7777777777777777777777777777777777777777',
      blockNumber: 32950000,
      timestamp: Math.floor(Date.now() / 1000) - 345600, // 4 days ago
      type: 'ERC721',
      qty: '1',
      from: address,
      to: '0x2222222222222222222222222222222222222222',
      isReceived: false,
      isOwned: false,
      contract: {
        address: '0xDEMO1234567890ABCDEF1234567890ABCDEF1234'
      },
      media: [{
        gateway: 'https://via.placeholder.com/300x300/EF4444/FFFFFF?text=Badge+%23777'
      }]
    }
  ];

  // Filter owned NFTs
  const ownedNFTs = mockNFTs.filter(nft => nft.isOwned);

  // Calculate summary
  const summary = {
    owned: ownedNFTs.length,
    totalActivities: mockNFTs.length,
    collections: [...new Set(ownedNFTs.map(nft => nft.contractAddress))].length,
    minted: mockNFTs.filter(nft => nft.method === 'mint' && nft.isReceived).length,
    received: mockNFTs.filter(nft => nft.method === 'transfer' && nft.isReceived).length,
    sent: mockNFTs.filter(nft => nft.method === 'transfer' && !nft.isReceived).length
  };

  return Response.json({
    nfts: ownedNFTs,
    total: mockNFTs.length,
    nextPageCursor: '',
    activities: mockNFTs,
    summary,
    isDemoData: true
  });
}
