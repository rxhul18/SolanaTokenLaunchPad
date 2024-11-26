import './App.css'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { TokenLaunchpad } from './components/TokenLaunchpad';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {

  return (
    <div>
      <div className='flex flex-col min-h-[100vh] h-100 justify-between'>
      
      <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
          <WalletProvider wallets={[]} autoConnect>
              <WalletModalProvider>
                  <div>
                    <Navbar />
                    <TokenLaunchpad />
                  </div>
                  <Footer />
              </WalletModalProvider>
          </WalletProvider>
      </ConnectionProvider>
    </div>
    </div>
  )
}

export default App
