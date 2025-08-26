'use client';

import { useState } from 'react';
import { FiSearch, FiKey, FiHardDrive, FiGitMerge, FiImage, FiDollarSign } from 'react-icons/fi';
import Image from 'next/image';

// Melengkapi semua definisi tipe data
interface WalletInfo {
  balance: string;
  txCount: number;
  isContract: boolean;
  storageAtSlot0?: string;
  historicalBalance?: string;
}
interface LatestBlockInfo {
  number: string;
  hash: string | null;
  timestamp: number | undefined;
  transactionCount: number | undefined;
}
interface NetworkInfo {
  clientVersion: string;
  chainId: string;
  latestBlock: LatestBlockInfo;
  gasPrice: string;
}
interface TxInfo {
  hash: string;
  status: 'Success' | 'Failed';
  blockNumber: number;
  from: string;
  to: string | null;
  value: string;
  txFee: string;
}
interface NftInfo {
  title: string;
  tokenId: string;
  media: { gateway: string }[];
  contract: { address: string };
}
interface TokenInfo {
  symbol: string;
  name: string;
  balance: string;
  contractAddress: string;
  decimals: number;
}

// Komponen kecil untuk menampilkan baris data agar tidak berulang
const DetailRow = ({ label, value, isMono = false, isHash = false }: { label: string, value: string | number | null | undefined, isMono?: boolean, isHash?: boolean }) => (
  <div className="py-3 px-4 grid grid-cols-3 gap-4 text-sm">
    <dt className="text-slate-400">{label}</dt>
    <dd className={`col-span-2 text-slate-200 ${isMono ? 'font-mono' : ''} ${isHash ? 'truncate' : ''}`}>{value ?? 'N/A'}</dd>
  </div>
);


export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'wallet' | 'transaction'>('wallet');
  const [address, setAddress] = useState('');
  const [txHash, setTxHash] = useState('');

  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [txInfo, setTxInfo] = useState<TxInfo | null>(null);
  const [nfts, setNfts] = useState<NftInfo[] | null>(null);
  const [tokens, setTokens] = useState<TokenInfo[] | null>(null);

  const [isWalletLoading, setIsWalletLoading] = useState(false);
  const [isTxLoading, setIsTxLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckWallet = async () => {
    setIsWalletLoading(true);
    setError(null);
    setWalletInfo(null);
    setNetworkInfo(null);
    setNfts(null);
    setTokens(null);
    try {
      const [walletRes, nftRes, tokenRes] = await Promise.all([
        fetch(`/api/check-wallet?address=${address}`),
        fetch(`/api/get-nfts?address=${address}`),
        fetch(`/api/get-tokens?address=${address}`)
      ]);

      const walletData = await walletRes.json();
      if (!walletRes.ok) throw new Error(walletData.error);
      setWalletInfo(walletData.wallet);
      setNetworkInfo(walletData.network);

      const nftData = await nftRes.json();
      if (!nftRes.ok) {
        console.warn('NFT fetch failed:', nftData.error);
        setNfts([]);
      } else {
        setNfts(nftData.ownedNfts);
      }

      const tokenData = await tokenRes.json();
      if (!tokenRes.ok) {
        console.warn('Token fetch failed:', tokenData.error);
        setTokens([]);
      } else {
        setTokens(tokenData.tokens);
      }

    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsWalletLoading(false);
    }
  };

  // Melengkapi fungsi handleCheckTx
  const handleCheckTx = async () => {
    setIsTxLoading(true);
    setError(null);
    setTxInfo(null);
    try {
      const res = await fetch(`/api/get-tx?hash=${txHash}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTxInfo(data);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsTxLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* --- Header dan Area Pencarian --- */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-50">Monad Testnet Explorer</h1>
          <p className="text-slate-400 mt-2">Alat untuk melihat data on-chain dari jaringan Monad.</p>
          <div className="mt-4 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg">
            <p className="text-sm text-blue-200">
              💡 <strong>Status:</strong> Token detection menggunakan Alchemy API dan berjalan dengan baik. NFT detection menggunakan event scanning (dalam development).
            </p>
          </div>
        </div>
        
        {/* --- Tab Navigation --- */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="bg-slate-800/50 p-1 rounded-xl border border-slate-700/80">
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setActiveTab('wallet');
                    setError(null);
                    setTxInfo(null);
                  }}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                    activeTab === 'wallet'
                      ? 'bg-sky-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                >
                  <FiKey className="w-4 h-4" />
                  Cek Alamat Wallet
                </button>
                <button
                  onClick={() => {
                    setActiveTab('transaction');
                    setError(null);
                    setWalletInfo(null);
                    setNetworkInfo(null);
                    setNfts(null);
                    setTokens(null);
                  }}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
                    activeTab === 'transaction'
                      ? 'bg-sky-600 text-white shadow-lg'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                  }`}
                >
                  <FiGitMerge className="w-4 h-4" />
                  Cek Hash Transaksi
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- Search Area --- */}
        <div className="mb-10">
          {activeTab === 'wallet' ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/80">
                <label className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <FiKey className="w-4 h-4" />
                  Masukkan Alamat Wallet
                </label>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    placeholder="0x316eEF7088c434F8DB78FfeCf312F60e3A710879" 
                    className="flex-1 p-3 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-sm"
                  />
                  <button 
                    onClick={handleCheckWallet} 
                    disabled={isWalletLoading || !address} 
                    className="px-6 py-3 bg-sky-600 rounded-lg font-semibold hover:bg-sky-700 disabled:bg-gray-500 transition-colors flex items-center gap-2"
                  >
                    {isWalletLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Checking...
                      </>
                    ) : (
                      <>
                        <FiSearch className="w-4 h-4" />
                        Check Wallet
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Contoh: 0x316eEF7088c434F8DB78FfeCf312F60e3A710879 (Address dengan 65 tokens)
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/80">
                <label className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                  <FiGitMerge className="w-4 h-4" />
                  Masukkan Hash Transaksi
                </label>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    value={txHash} 
                    onChange={(e) => setTxHash(e.target.value)} 
                    placeholder="0x..." 
                    className="flex-1 p-3 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-sm"
                  />
                  <button 
                    onClick={handleCheckTx} 
                    disabled={isTxLoading || !txHash} 
                    className="px-6 py-3 bg-sky-600 rounded-lg font-semibold hover:bg-sky-700 disabled:bg-gray-500 transition-colors flex items-center gap-2"
                  >
                    {isTxLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Checking...
                      </>
                    ) : (
                      <>
                        <FiSearch className="w-4 h-4" />
                        Check Transaction
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Masukkan hash transaksi (64 karakter yang dimulai dengan 0x)
                </p>
              </div>
            </div>
          )}
        </div>

        {error && <div className="mb-8 p-4 bg-red-900/50 border border-red-700 rounded-lg text-center"><p>{error}</p></div>}

        {/* --- Area Hasil --- */}
        {activeTab === 'wallet' ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* --- Kolom Kiri: Info Jaringan dan Wallet --- */}
              <div className="flex flex-col gap-8">
                <section>
                  <h2 className="text-xl font-bold mb-4 text-slate-300 flex items-center gap-2"><FiHardDrive /> Status Jaringan</h2>
                  <div className="bg-slate-800/50 rounded-xl border border-slate-700/80 divide-y divide-slate-700/80">
                    {isWalletLoading ? <p className="p-4">Loading...</p> : networkInfo ? <>
                      <DetailRow label="Blok Terbaru" value={`#${networkInfo.latestBlock.number}`} isMono />
                      <DetailRow label="Timestamp" value={networkInfo.latestBlock.timestamp ? new Date(networkInfo.latestBlock.timestamp * 1000).toLocaleString() : 'N/A'} />
                      <DetailRow label="Total TXs di Blok" value={networkInfo.latestBlock.transactionCount} />
                      <DetailRow label="Hash Blok" value={networkInfo.latestBlock.hash || 'N/A'} isMono isHash />
                      <DetailRow label="Chain ID" value={networkInfo.chainId} isMono />
                      <DetailRow label="Protocol Version" value={networkInfo.protocolVersion || 'N/A'} />
                      <DetailRow label="Sync Status" value={networkInfo.syncing || 'N/A'} />
                      <DetailRow label="Gas Price" value={`${parseFloat(networkInfo.gasPrice).toFixed(2)} Gwei`} isMono />
                    </> : <p className="p-4 text-slate-400">Cari alamat untuk melihat status jaringan.</p>}
                  </div>
                </section>
                <section>
                  <h2 className="text-xl font-bold mb-4 text-slate-300 flex items-center gap-2"><FiKey /> Info Wallet</h2>
                  <div className="bg-slate-800/50 rounded-xl border border-slate-700/80 divide-y divide-slate-700/80">
                    {isWalletLoading ? <p className="p-4">Loading...</p> : walletInfo ? <>
                      <DetailRow label="Saldo Saat Ini" value={`${parseFloat(walletInfo.balance).toFixed(6)} MON`} isMono />
                      <DetailRow label="Nonce (TX Count)" value={walletInfo.txCount} isMono />
                      <DetailRow label="Tipe Alamat" value={walletInfo.isContract ? '📄 Smart Contract' : '👤 EOA'} />
                      {walletInfo.historicalBalance && (
                        <DetailRow label="Saldo 1000 Blok Lalu" value={`${parseFloat(walletInfo.historicalBalance).toFixed(6)} MON`} isMono />
                      )}
                      {walletInfo.storageAtSlot0 && walletInfo.storageAtSlot0 !== '0x0000000000000000000000000000000000000000000000000000000000000000' && (
                        <DetailRow label="Storage Slot 0" value={walletInfo.storageAtSlot0} isMono isHash />
                      )}
                    </> : <p className="p-4 text-slate-400">Belum ada data wallet.</p>}
                  </div>
                </section>
              </div>

              {/* --- Kolom Kanan: Token Balance --- */}
              <div className="flex flex-col">
                <h2 className="text-xl font-bold mb-4 text-slate-300 flex items-center gap-2"><FiDollarSign /> Token Balance</h2>
                {isWalletLoading ? (
                  <div className="bg-slate-800/50 rounded-xl border border-slate-700/80 p-8 text-center">
                    <p className="text-slate-400">Loading tokens...</p>
                  </div>
                ) : tokens && tokens.length > 0 ? (
                  <div className="bg-slate-800/50 rounded-xl border border-slate-700/80 divide-y divide-slate-700/80 max-h-96 overflow-y-auto">
                    {tokens.map((token, index) => (
                      <div key={`${token.contractAddress}-${index}`} className="p-4 flex justify-between items-center">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-200">{token.symbol}</h3>
                          <p className="text-sm text-slate-400 truncate">{token.name}</p>
                          <p className="text-xs text-slate-500 font-mono truncate">{token.contractAddress}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-100">{parseFloat(token.balance).toFixed(4)}</p>
                          <p className="text-xs text-slate-400">{token.symbol}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : tokens !== null ? (
                  <div className="bg-slate-800/50 rounded-xl border border-slate-700/80 p-8 text-center">
                    <p className="text-slate-400">Tidak ada token yang ditemukan di alamat ini.</p>
                  </div>
                ) : (
                  <div className="bg-slate-800/50 rounded-xl border border-slate-700/80 p-8 text-center">
                    <p className="text-slate-400">Cari alamat untuk melihat token balance.</p>
                  </div>
                )}
              </div>
            </div>

            {/* --- Section Galeri NFT (hanya di tab wallet) --- */}
            <div className="mt-10">
              <section>
                <h2 className="text-xl font-bold mb-4 text-slate-300 flex items-center gap-2"><FiImage /> Galeri NFT</h2>
                {isWalletLoading ? (
                  <div className="bg-slate-800/50 rounded-xl border border-slate-700/80 p-8 text-center">
                    <p className="text-slate-400">Loading NFTs...</p>
                  </div>
                ) : nfts && nfts.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                    {nfts.slice(0, 16).map((nft) => (
                      <div key={`${nft.contract.address}-${nft.tokenId}`} className="bg-slate-800/50 rounded-lg border border-slate-700/80 overflow-hidden group">
                        <div className="relative w-full h-32 overflow-hidden">
                          <Image
                            src={nft.media[0]?.gateway || 'https://via.placeholder.com/150?text=NFT'}
                            alt={nft.title || 'Untitled NFT'}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/150?text=NFT';
                            }}
                          />
                        </div>
                        <div className="p-2">
                          <h3 className="font-bold text-xs truncate">{nft.title || 'Untitled NFT'}</h3>
                          <p className="text-xs text-slate-400 font-mono truncate">#{nft.tokenId}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : nfts !== null ? (
                  <div className="bg-slate-800/50 rounded-xl border border-slate-700/80 p-8 text-center">
                    <p className="text-slate-400">Tidak ada NFT yang ditemukan di alamat ini.</p>
                  </div>
                ) : (
                  <div className="bg-slate-800/50 rounded-xl border border-slate-700/80 p-8 text-center">
                    <p className="text-slate-400">Cari alamat untuk melihat NFT.</p>
                  </div>
                )}
              </section>
            </div>
          </>
        ) : (
          <>
            <div className="max-w-4xl mx-auto">
              <section>
                <h2 className="text-xl font-bold mb-4 text-slate-300 flex items-center gap-2"><FiGitMerge /> Detail Transaksi</h2>
                <div className="bg-slate-800/50 rounded-xl border border-slate-700/80 divide-y divide-slate-700/80">
                  {isTxLoading ? <p className="p-4">Loading...</p> : txInfo ? <>
                    <DetailRow label="Hash Transaksi" value={txInfo.hash} isMono isHash />
                    <DetailRow label="Status" value={txInfo.status} />
                    <DetailRow label="Nomor Blok" value={txInfo.blockNumber} isMono />
                    <DetailRow label="Dari" value={txInfo.from} isMono isHash />
                    <DetailRow label="Ke" value={txInfo.to} isMono isHash />
                    <DetailRow label="Value" value={`${txInfo.value} MON`} isMono />
                    <DetailRow label="Biaya Transaksi" value={`${parseFloat(txInfo.txFee).toPrecision(5)} MON`} isMono />
                  </> : <p className="p-4 text-slate-400">Cari hash transaksi untuk melihat detailnya.</p>}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  );
}