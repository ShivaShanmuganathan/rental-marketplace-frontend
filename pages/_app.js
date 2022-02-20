/* pages/_app.js */
import '../styles/globals.css'
import Link from 'next/link'

function Marketplace({ Component, pageProps }) {
  return (
    
    <div>
      
        <link rel="shortcut icon" href="/rocket.png" />
        <title>NFT Rental Marketplace</title>
      
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">NFT Rental Marketplace</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-pink-500">
              Home
            </a>
          </Link>
          
          <Link href="/create-item">
            <a className="mr-6 text-pink-500">
              Create NFTs
            </a>
          </Link>

          <Link href="/my-assets">
            <a className="mr-6 text-pink-500">
              My NFTs
            </a>
          </Link>

          <Link href="/my-rents">
            <a className="mr-6 text-pink-500">
              Rented NFTs
            </a>
          </Link>

          <Link href="/claimable-assets">
            <a className="mr-6 text-pink-500">
              Claimable NFTs
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default Marketplace