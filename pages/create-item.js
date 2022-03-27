import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  nftaddress, nftmarketaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/RentalMarket.sol/RentalMarket.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({ price: '',time: '' , name: '', description: '' })
  const router = useRouter()
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

  async function onChange(e) {
    const file = e.target.files[0]
    try {
      const added = await client.add(
        file,
        {
          progress: (prog) => console.log(`received: ${prog}`)
        }
      )
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function createMarket() {
    const { name, description, time, price } = formInput
    if (!name || !description || !time || !price || !fileUrl) return
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name, description, image: fileUrl
    })
    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url)
    } catch (error) {
      console.log('Error uploading file: ', error)
    }  
  }

  async function createSale(url) {
    await checkNetwork();
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)    
    const signer = provider.getSigner()
        
    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()
    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()

    const price = ethers.utils.parseUnits(formInput.price, 'ether')
    const time = (formInput.time * 60)
  
    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, time, { value: "25000000000000000" })
    await transaction.wait()
    router.push('/')
  }

  return (
    <div className="flex justify-center bg-black">
      <div className="w-1/2 flex flex-col pb-12">
        <label for="AssetName" className=" my-12 block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Asset Name</label>
        <input 
          placeholder="Enter your NFT Name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />

        <label for="AssetDescription" className=" my-6 block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Asset Description</label>
        <textarea
          placeholder="Asset Description"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />

        <label for="RentalTime" className="my-6 block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Rental Time In Minutes</label>
        <input
          placeholder="Enter Time In Minutes"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={e => updateFormInput({ ...formInput, time: e.target.value })}
        />
        
        <label for="AssetPrice" className=" my-6 block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Asset Price</label>
        <input
          placeholder="Asset Price in Matic"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />

        
        <input
          type="file"
          name="Asset"
          className="my-6"
          onChange={onChange}
        />
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <button onClick={createMarket} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
          Create Digital Asset
        </button>
      </div>
    </div>
  )
}