# 💎NFT Rental Marketplace 💸Collateral Free Renting🆓

## [💎Check Out](https://nft-rental-marketplace.netlify.app) 🔔 [nft-rental-marketplace.netlify.app](https://nft-rental-marketplace.netlify.app/) 

## Project Description 📝

### 💎Fullstack NFT Rental Marketplace Dapp ✨Collateral Free Renting✨

- NFT Owners can rent their NFT by specifying the name, description, rental duration, and rental price. 
- Anyone can rent the NFT from the Rental Marketplace by paying the rental price.
- The Renter will not be able to transfer the rented NFT to anyone. 
- After the end of the rental duration, either the renter, owner or anyone can call finishRenting function to transfer the NFT from Renter to the NFT Owner.
![capture](./rental-marketplace-screenshot.png)

![rental_poster1](./rental-design.jpg)

## About Frontend 🎨🖌 
### Project Is Deployed On [Vercel](https://nft-rental-marketplace.vercel.app/)

### This project consists of five pages

- Home - Displays all NFTs listed for rent in the rental marketplace
- Create NFTs - Users can create their own NFTs by filling all the details in this page
- My NFTs - Users can view the NFTs they have created
- Rented NFTs - Users can view the NFTs they have rented
- Claimable NFTs - Users can view all NFTs that is past the rental duration

<details> 
  <summary> Working Explained In Detail </summary>
  <h2> Working Explained In Detail </h2>

- Anyone who has created a ERC721 contract with additional functions similar to NFT.sol can list their NFTs for Rent in the Marketplace.
- When an owner lists a NFT for rent in the Marketplace, the ownership of the item will be transferred from the owner to the marketplace.
- Anyone can rent the NFTs listed in the marketplace by paying rent.
- When a user rents a NFT, the rental price will be transferred from the buyer to the seller and the NFT will be transferred from the marketplace to the renter.
- The Renter will not be able to transfer the NFT to anyone, because the NFT.sol contract prevents the token transfer while it is on rent.
- Finish Renting function will enable anyone to end the renting process, and return the NFT to the NFT Owner. 


<strong> The marketplace owner will be able to set a listing fee. This fee will be paid by the NFT owner when listing NFT in the renal marketplace, and transferred to the contract owner, enabling the owner of the marketplace to earn recurring revenue from any listing transacted in the marketplace. </strong>

 
</details>

![rental_poster](./rental-design2.jpg)

## Directory Structure 📂
- `pages/{componenet-name.js}` ⏩ Pages folder contains all components of the dapp.
- [`contracts`](https://github.com/ShivaShanmuganathan/NFT-Rental-Marketplace/tree/main/contracts) ⏩ NFT Rental Marketplace and NFT Smart contracts that are deployed in the Polygon Mumbai Test Network.
- [`test`](https://github.com/ShivaShanmuganathan/NFT-Rental-Marketplace/tree/main/test) ⏩ Tests for Smart Contracts.


## How To Run This Project Locally 🏃🏾‍♂️💨

### Clone This Repo 
```shell

git clone https://github.com/ShivaShanmuganathan/rental-marketplace-frontend
cd rental-marketplace-frontend

```

### Install Dependencies

``` shell
npm install
```

### Run The Frontend

``` shell
npm run dev
```


## Working Explained In Detail 📃
- Anyone who has created a ERC721 contract with additional functions similar to NFT.sol can list their NFTs for Rent in the Marketplace.
- When an owner lists a NFT for rent in the Marketplace, the ownership of the item will be transferred from the owner to the marketplace.
- Anyone can rent the NFTs listed in the marketplace by paying rent.
- When a user rents a NFT, the rental price will be transferred from the buyer to the seller and the NFT will be transferred from the marketplace to the renter.
- The Renter will not be able to transfer the NFT to anyone, because the NFT.sol contract prevents the token transfer while it is on rent.
- Finish Renting function will enable anyone to end the renting process, and return the NFT to the NFT Owner. 

``` The marketplace owner will be able to set a listing fee. This fee will be paid by the NFT owner when listing NFT in the renal marketplace, and transferred to the contract owner, enabling the owner of the marketplace to earn recurring revenue from any listing transacted in the marketplace. ```

## Test Coverage Report 🛸
![test-coverage-report](https://user-images.githubusercontent.com/30176438/160335209-2edea99a-046e-4372-b13d-db63b5797fa2.jpg)


## Gas Report ⛽

![gas-report-rental](https://user-images.githubusercontent.com/30176438/160335223-978c8b89-e8a3-4af0-9689-77fb003c2596.jpg)

## Demo GIF 🎥

![NFT-Rental-Marketplace-28-March-2022](https://user-images.githubusercontent.com/30176438/160345192-d56e13d5-645b-40f5-961a-f461758d62fc.gif)
