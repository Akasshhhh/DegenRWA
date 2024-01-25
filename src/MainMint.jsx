import React, { useState } from 'react'
import { ethers,BigNumber } from 'ethers'
import DegenRWA from './DegenRWA.json'

const DegenRWAContractAddress = "0x30Ecb95D0eEee8DA40C7B611ef46e38A2D774De2"

const MainMint = ({accounts,setAccounts}) => {
  const [mintAmount, setMintAmount] = useState(1)
  const isConnected = Boolean(accounts[0])

  const handleDecrement = () =>{
    if(mintAmount <= 1) return
    setMintAmount(mintAmount-1)
  }
  const handleIncrement = () =>{
    if(mintAmount >= 3) return
    setMintAmount(mintAmount+1)
  }

  async function handleMint(){
    if(window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(DegenRWAContractAddress,DegenRWA.abi,signer)

      try {
        const response = await contract.mint(BigNumber.from(mintAmount))
        console.log('response',response)
      } catch(e){
        console.log(e)
      }
    }
  }
  return (
    <div>
      <h1>DegenRWA</h1>
      <p>Experience the future of NFTs with our project, seamlessly merging futuristic aesthetics with real-world assets. Dive into a realm where digital and tangible intertwine, as visionary artists craft exclusive pieces that transcend the boundaries of the virtual space.</p>
      {isConnected?
      (<div>
        <div>
          <button onClick={handleDecrement}>-</button>
          <input type='number' value={mintAmount} />
          <button onClick={handleIncrement}>+</button>
        </div>
        <button onClick={handleMint}>Mint Now</button>
      </div>):(<div>
        <p>Connect your wallet.</p>
      </div>)}
    </div>
  )
}

export default MainMint