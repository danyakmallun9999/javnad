# 🔍 Monad Testnet Explorer

Aplikasi web untuk menganalisis dan melihat statistik wallet address di jaringan **Monad Testnet**. Aplikasi ini memungkinkan Anda untuk memeriksa saldo, transaksi, NFT, dan token yang dimiliki oleh alamat wallet tertentu.

## ✨ Fitur

- 🔎 **Pencarian Wallet**: Analisis lengkap alamat wallet
- 📊 **Statistik Jaringan**: Informasi real-time dari Monad Testnet
- 💰 **Balance Tracker**: Saldo saat ini dan historis
- 🖼️ **NFT Gallery**: Tampilkan koleksi NFT
- 🪙 **Token Balance**: Daftar semua token yang dimiliki
- 🔗 **Transaction Lookup**: Detail transaksi berdasarkan hash
- 📱 **Responsive Design**: Optimal untuk desktop dan mobile

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd monad-wallet-checker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Buat file `.env.local` di root directory:
```env
ALCHEMY_API_KEY=your_alchemy_api_key_here
```

**Cara mendapatkan API Key:**
1. Kunjungi [Alchemy Dashboard](https://dashboard.alchemy.com/)
2. Create account atau login
3. Buat app baru dan pilih network **Monad Testnet**
4. Copy API key ke file `.env.local`

### 4. Run Development Server
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 🔧 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Blockchain**: Ethers.js, Alchemy SDK
- **Icons**: React Icons (Feather)
- **HTTP Client**: Axios

## 📱 Cara Penggunaan

### 1. Cek Alamat Wallet
- Masukkan alamat wallet (0x...) di kolom pencarian
- Klik tombol search untuk menganalisis
- Lihat informasi:
  - Saldo MON saat ini dan historis
  - Transaction count (nonce)
  - Tipe alamat (EOA atau Smart Contract)
  - Storage data (untuk smart contract)

### 2. Cek Hash Transaksi
- Masukkan hash transaksi (0x...) di kolom kedua
- Klik search untuk melihat detail:
  - Status transaksi (Success/Failed)
  - Block number
  - Alamat pengirim dan penerima
  - Value dan biaya transaksi

### 3. View NFTs dan Tokens
- NFT dan token akan ditampilkan otomatis setelah search wallet
- NFT ditampilkan dalam bentuk gallery dengan gambar preview
- Token balance menampilkan semua ERC-20 token yang dimiliki

## 🏗️ Struktur Project

```
src/
├── app/
│   ├── api/                 # API Routes
│   │   ├── check-wallet/    # Endpoint untuk data wallet
│   │   ├── get-nfts/       # Endpoint untuk NFT data
│   │   ├── get-tokens/     # Endpoint untuk token balance
│   │   └── get-tx/         # Endpoint untuk transaction data
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
└── components/
    └── DashboardCard.tsx   # Reusable card component
```

## 🔌 API Endpoints

### GET `/api/check-wallet?address=0x...`
Mengambil informasi wallet dan jaringan.

### GET `/api/get-nfts?address=0x...`
Mengambil daftar NFT yang dimiliki wallet.

### GET `/api/get-tokens?address=0x...`
Mengambil balance semua token ERC-20.

### GET `/api/get-tx?hash=0x...`
Mengambil detail transaksi berdasarkan hash.

## 🛠️ Development

### Build untuk Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Linting
```bash
npm run lint
```

## 🌐 Deployment

Aplikasi ini dapat di-deploy ke platform manapun yang support Next.js:

- **Vercel** (Recommended)
- **Netlify**
- **Railway**
- **AWS Amplify**

Pastikan untuk set environment variable `ALCHEMY_API_KEY` di platform deployment.

## 🔒 Security Notes

- API key disimpan sebagai server-side environment variable
- Tidak ada data sensitif yang di-expose ke client
- Semua request blockchain melalui proxy API internal

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - Lihat file [LICENSE](LICENSE) untuk detail.

## 📞 Support

Jika ada pertanyaan atau issue, silakan buat [GitHub Issue](../../issues) atau contact developer.

---

**Happy Exploring! 🚀**