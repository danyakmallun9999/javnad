# Monad Testnet API Endpoint Compatibility

## 🟢 **Fully Supported Endpoints (Confirmed Working)**

### Standard Ethereum JSON-RPC Methods
- ✅ `eth_accounts`
- ✅ `eth_blockNumber` - Latest block number
- ✅ `eth_call` - Call contract function
- ✅ `eth_chainId` - Chain ID (10143 for Monad Testnet)
- ✅ `eth_estimateGas` - Estimate gas for transaction
- ✅ `eth_feeHistory` - Fee history for blocks
- ✅ `eth_gasPrice` - Current gas price
- ✅ `eth_getBalance` - Account balance
- ✅ `eth_getBlockByHash` - Block by hash
- ✅ `eth_getBlockByNumber` - Block by number
- ✅ `eth_getCode` - Contract code
- ✅ `eth_getLogs` - Event logs (with 500 block limit)
- ✅ `eth_getStorageAt` - Storage at specific slot
- ✅ `eth_getTransactionByHash` - Transaction details
- ✅ `eth_getTransactionCount` - Account nonce
- ✅ `eth_getTransactionReceipt` - Transaction receipt
- ✅ `eth_maxPriorityFeePerGas` - Max priority fee
- ✅ `eth_syncing` - Sync status
- ✅ `net_version` - Network version
- ✅ `web3_clientVersion` - Client version (Monad/v0.10.4)
- ✅ `web3_sha3` - SHA3 hash

### Custom Alchemy Methods (Working on Monad)
- ✅ `alchemy_getTokenBalances` - Token balances for address
- ✅ `alchemy_getTokenMetadata` - Token metadata (name, symbol, decimals)

## 🔴 **Not Supported Endpoints**
- ❌ `eth_protocolVersion` - Method not found
- ❌ `alchemy_getNftsForOwner` - Method not found
- ❌ `alchemy_getTokensForOwner` - Method not found
- ❌ `net_listening` - May not be supported

## 🟡 **Partially Supported / With Limitations**
- ⚠️ `eth_getLogs` - Limited to 500 block range per request
- ⚠️ `eth_createAccessList` - May not be supported

## 📊 **Application Usage**

### Current Implementation

#### `/api/check-wallet`
```javascript
// Used endpoints:
- eth_getBalance (current + historical)
- eth_getTransactionCount  
- eth_getCode
- eth_getBlockByNumber ('latest')
- eth_feeHistory (via getFeeData)
- eth_chainId
- web3_clientVersion
- eth_getStorageAt (slot 0)
- eth_syncing
```

#### `/api/get-tokens`
```javascript
// Used endpoints:
- alchemy_getTokenBalances
- alchemy_getTokenMetadata
```

#### `/api/get-nfts`
```javascript
// Used endpoints:
- eth_getLogs (ERC-721 Transfer events)
- eth_call (contract functions)
```

#### `/api/get-tx`
```javascript
// Used endpoints:
- eth_getTransactionByHash
- eth_getTransactionReceipt
```

#### `/api/network-info` (New)
```javascript
// Used endpoints:
- eth_blockNumber
- eth_gasPrice
- eth_chainId
- web3_clientVersion
- eth_syncing
- eth_maxPriorityFeePerGas
- net_version
- eth_feeHistory
```

#### `/api/estimate-gas` (New)
```javascript
// Used endpoints:
- eth_estimateGas
- eth_createAccessList (optional)
- eth_gasPrice
- eth_maxPriorityFeePerGas
```

## 🚀 **Performance Optimizations**

### Batch Requests
- All compatible endpoints use `Promise.all()` for parallel execution
- NFT scanning uses batched `eth_getLogs` calls (500 block chunks)

### Error Handling
- Graceful fallbacks for unsupported endpoints
- Try-catch blocks for optional features

### Caching Opportunities
- Network info can be cached (updates every block)
- Token metadata can be cached (rarely changes)

## 🔧 **Best Practices**

1. **Always use supported endpoints first**
2. **Implement graceful fallbacks**
3. **Respect 500-block limit for `eth_getLogs`**
4. **Use parallel requests with `Promise.all()`**
5. **Handle method not found errors**

## 📈 **Monad Testnet Specific Info**

- **Chain ID**: 10143 (0x279f)
- **Client Version**: Monad/v0.10.4
- **RPC URL**: `https://monad-testnet.g.alchemy.com/v2/{api-key}`
- **Max `eth_getLogs` Range**: 500 blocks
- **Average Block Time**: ~1 second
- **Gas Price**: ~52 Gwei (stable)
