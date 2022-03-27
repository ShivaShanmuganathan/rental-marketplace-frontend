/* pages/claimable-assets.js */
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"

import {
  nftmarketaddress, nftaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/RentalMarket.sol/RentalMarket.json'

export default function MyRents() {
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    useEffect(() => {
      loadNFTs()
    }, [])
    const checkNetwork = async() => {
      const { ethereum } = window;
      let chainId = await ethereum.request({ method: 'eth_chainId' })
      if (chainId !== '0x13881') {
        // window.alert("Please switch to the Matic Test Network!");
        // throw new Error("Please switch to the Matic Test Network");
        
        window.alert("This Dapp works on Matic Test Network Only. Please Approve to switch to Mumbai");
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId:'0x13881' }],
        })  
      }
      
    }

    async function loadNFTs() {
      await checkNetwork();
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const signer = provider.getSigner()
        
      const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
      const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
      const data = await marketContract.fetchRentedNFTs()
    //   await data.wait()

      console.log("Works Until Here");
      console.log("Time Now in JS World", (Math.floor(Date.now() / 1000)))
      console.log(data);
      
      const items = await Promise.all(data.map(async i => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId)
        const meta = await axios.get(tokenUri)
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let time = (i.expiresAt - (Math.floor(Date.now() / 1000))).toString()
        let item = {
          price,
          time,
          itemId: i.itemId.toNumber(),
          seller: i.seller,
          renter: i.renter,
          image: meta.data.image,
        }
        return item
      }))
      setNfts(items)
      setLoadingState('loaded') 
    }

    async function paybackNFT(nft) {
        /* needs the user to sign the transaction, so will use Web3Provider and sign it */
        await checkNetwork();
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




    if (loadingState === 'loaded' && !nfts.length) return (<h1 className="py-10 px-20 text-3xl">You Dont Have Rented Assets</h1>)
    return (
      <div className="flex justify-center">
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {
              nfts.map((nft, i) => (
                <div key={i} className="border shadow rounded-xl overflow-hidden">
                  <img src={nft.image} className="rounded" />
                  <div className="p-4 bg-black">
                    <p className="text-2xl font-bold text-white">Price - {nft.price} Matic</p>
                    <p className="text-2xl font-bold text-white">Expires In {nft.time} Seconds</p>
                    <button className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" onClick={() => paybackNFT(nft)}>PayBack</button>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    )
}