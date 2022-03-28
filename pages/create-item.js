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
        <label htmlFor="AssetName" className=" my-12 block mb-2 text-2xl font-medium text-gray-900 dark:text-white">Asset Name</label>
        <input 
          placeholder="Enter Your NFT Name 🖼"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />

        <label htmlFor="AssetDescription" className="my-6 block mb-2 text-2xl font-medium text-white ">Asset Description</label>
        <textarea
          placeholder="Write A Detailed Description Of Your NFT 📝"
          className="block p-4 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />

        <label htmlFor="RentalTime" className="my-6 block mb-2 text-2xl font-medium text-gray-900 dark:text-white">Rental Time In Minutes</label>
        <input
          placeholder="Enter Time In Minutes ⌛⏱"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={e => updateFormInput({ ...formInput, time: e.target.value })}
        />
        
        <label htmlFor="AssetPrice" className=" my-6 block mb-2 text-2xl font-medium text-gray-900 dark:text-white">Asset Price</label>
        <input
          placeholder="Asset Price in Matic 💰"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
        />

        <label htmlFor="formFile" className=" my-6 form-label inline-block mb-2 text-white-700 text-2xl font-bold">Upload Your Image For NFT</label>
        <div className="my-6 flex items-left justify-left">
        <label className="w-64 flex flex-col items-center px-4 py-6 bg-black text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-white">
          <svg fill="#FFF" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0 0h24v24H0z" fill="none"/>
                          <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
          </svg>
          <span className="mt-2 text-base leading-normal">Select a file</span>
          <input
            type="file"
            name="Asset"
            className="my-6 hidden"
            onChange={onChange}
          />
        </label>
        

        </div>
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