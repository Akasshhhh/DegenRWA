import React, { useState } from 'react'
import { ethers, BigNumber } from 'ethers'
import DegenRWA from '../DegenRWA.json'
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react'
import toast from 'react-hot-toast'
import BurnNFT from './BurnNFT'


const DegenRWAContractAddress = "0x5D4E7CFe1346e2f36aFa0780a8b1d3072b607718"

const MainMint = ({ accounts, setAccounts, isMainMintSelected, setIsMainMintSelected }) => {

  //Contract variables
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(DegenRWAContractAddress, DegenRWA.abi, signer)

  const [mintAmount, setMintAmount] = useState(1)
  const isConnected = Boolean(accounts[0])

  const handleDecrement = () => {
    if (mintAmount <= 1) return
    setMintAmount(mintAmount - 1)
  }
  const handleIncrement = () => {
    if (mintAmount >= 3) return
    setMintAmount(mintAmount + 1)
  }

  async function handleMint() {

    if (window.ethereum) {
      const mintLimitReached = await contract.walletMints(accounts[0]) >= 3;
      try {
        // Check if the user has reached the mint limit
        if (mintLimitReached) {
          toast.error("Wallet mint limit reached. Cannot mint more NFTs.");
          return;
        }
        const tx = await contract.mint(BigNumber.from(mintAmount), {
          value: ethers.utils.parseEther((1 * mintAmount).toString())
        })

        // Wait for the transaction to be mined
        const receipt = await tx.wait()

        // Check if the transaction was successful
        if (receipt.status === 1) {
          toast.success("Minted Successfully")
        } else {
          toast.error("Mint failed")
        }
      } catch (e) {
        console.error(e)
        toast.error("Error while minting")
      }
    }
  }

  return (
    <Flex justify="center" align="center" height="100vh" paddingBottom="160px">
      <Box width="600px">
        {isMainMintSelected === "MainMint" && <div>
          <Text fontSize="48px" textShadow="0 5px #000000">DegenRWA</Text>
          <Text fontSize="30px" letterSpacing="%" fontFamily="VT323" textShadow="0 2px 2px #000000">Sculpted from stardust and forgotten lullabies, its architecture sings forbidden harmonies. Own a fragment of its melody, an NFT echoing with cosmic whispers. Unravel the city's secrets, one note at a time.</Text>
        </div>}
        {isConnected && isMainMintSelected === "MainMint" ?
          (<div>
            <Flex justify="center" align="center">
              <Button onClick={handleDecrement} backgroundColor="#D6517D" borderRadius="5px" boxShadow="0px 2px 2px 1px #0F0F0F" color="white" cursor="pointer" fontFamily="inherit" padding="15px" marginTop="10px">-</Button>
              <Input type='number' value={mintAmount} readOnly fontFamily="inherit" width="100px" height="40px" textAlign="center" paddingLeft="19px" marginTop="10px" />
              <Button onClick={handleIncrement} backgroundColor="#D6517D" borderRadius="5px" boxShadow="0px 2px 2px 1px #0F0F0F" color="white" cursor="pointer" fontFamily="inherit" padding="15px" marginTop="10px">+</Button>
            </Flex>
            <Button onClick={handleMint} backgroundColor="#D6517D" borderRadius="5px" boxShadow="0px 2px 2px 1px #0F0F0F" color="white" cursor="pointer" fontFamily="inherit" padding="15px" marginTop="10px">Mint Now</Button>
          </div>) : (!isConnected && <div>
            <p >Connect your wallet to mint.</p>
          </div>)}
        {isConnected && isMainMintSelected === "BurnNFT" ? <BurnNFT accounts={accounts} /> : <></>}
      </Box>
    </Flex>
  )
}

export default MainMint