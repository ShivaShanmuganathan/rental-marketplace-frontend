
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  nftmarketaddress, nftaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/RentalMarket.sol/RentalMarket.json'

export default function MyAssets() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
      
    const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
    const data = await marketContract.fetchMyNFTs()
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let time = (i.expiresAt - (Math.floor(Date.now() / 1000)))
    //   (i.expiresAt.toString())
      let item = {
        price,
        itemId: i.itemId.toNumber(),
        time,
        time2: i.expiresAt.toNumber()/60,
        seller: i.seller,
        renter: i.renter,
        isActive: i.isActive.toString(),
        image: meta.data.image,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  async function paybackNFT(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    console.log("Item ID", nft.itemId)
    const transaction = await contract.finishRenting(nft.itemId)
    await transaction.wait()
    loadNFTs()
  }


  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">No assets owned</h1>)
  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {
            nfts.map((nft, i) => {
              if (nft.isActive == "true"){

                if(nft.time < 0){

                  return(
                    <div key={i} className="border shadow rounded-xl overflow-hidden">
                      <img src={nft.image} className="rounded" />
      
                        <div className="p-4 bg-black">
                          <p className="text-2xl font-bold text-white">NFT is Rented</p>
                          <p className="text-2xl font-bold text-white">Price: {nft.price} Eth</p>
                          <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => paybackNFT(nft)}>Claim</button>
                        </div>
              
                    </div>
                  )

                }
                



                return(
                  <div key={i} className="border shadow rounded-xl overflow-hidden">
                    <img src={nft.image} className="rounded" />
    
                      <div className="p-4 bg-black">
                        <p className="text-2xl font-bold text-white">NFT is Rented</p>
                        <p className="text-2xl font-bold text-white">Price: {nft.price} Eth</p>
                        <p className="text-2xl font-bold text-white">Expires In {nft.time} Seconds</p>
                      </div>
            
                  </div>
                )

              }
              else {
                
                return(
                  <div key={i} className="border shadow rounded-xl overflow-hidden">
                    <img src={nft.image} className="rounded" />
    
                      <div className="p-4 bg-black">
                        <p className="text-2xl font-bold text-white">NFT is Listed in marketplace</p>
                        <p className="text-2xl font-bold text-white">Price: {nft.price} Eth</p>
                        <p className="text-2xl font-bold text-white">Duration {nft.time2} Minutes</p>
                      </div>
            
                  </div>
                )

              }

              
          })
          }
        </div>
      </div>
    </div>
  )
}