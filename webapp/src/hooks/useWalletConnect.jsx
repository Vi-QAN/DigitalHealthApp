import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { walletConnect, injected } from 'wagmi/connectors'
import { localhost } from '@wagmi/core/chains'

// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '0caac0cf0fc25f80bea5b3fdbd2af07f'

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://77f3-2a02-8084-2162-e200-9022-9327-7d33-f9b9.ngrok-free.app', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const customLocalhost = { 
  ...localhost, 
  rpcUrls: {
    public: {
      http: [`${process.env.REACT_APP_PUBLIC_CHAIN_URL}`]
    },
    default: {
      http: [`${process.env.REACT_APP_PUBLIC_CHAIN_URL}`]
    }
  }
}

const chains = [customLocalhost]

const config = defaultWagmiConfig({
  chains, // required
  projectId, // required
  metadata, // required
  enableWalletConnect: true, // Optional - true by default
  enableInjected: true, // Optional - true by default
  enableEIP6963: true, // Optional - true by default
  connectors: [injected({target: 'metamask'})]
})

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true // Optional - defaults to your Cloud configuration
})

export function Web3Modal({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
export { config };