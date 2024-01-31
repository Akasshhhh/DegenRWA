import React from 'react'
import { Box, Button, Flex, Image, Link } from '@chakra-ui/react'
import Twitter from '../assets/social-media-icons/twitter_32x32.png'
import toast from 'react-hot-toast';

const NavBar = ({ accounts, setAccounts,isMainMintSelected,setIsMainMintSelected }) => {
  const isConnected = Boolean(accounts[0]);

  async function connectAccount() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      setAccounts(accounts)
      const getChainId = await window.ethereum.request({method: 'eth_chainId'})
      const chainId = parseInt(getChainId, 16);
      if(chainId !== 152){
        toast.error("Change your network to RedbellyDevNet")
      }
    }
  }
  return (
    <Flex justify="space-between" align="center" padding="30px">
      <Link target='_blank' href='https://twitter.com/junior_rbn_dev'>
        <Image src={Twitter} boxSize="42px" margin="0 15px" />
      </Link>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      {isMainMintSelected === "MainMint" && isConnected?<Button backgroundColor="#D6517D"
          borderRadius="5px"
          boxShadow="0px 2px 2px 1px #0F0F0F"
          color="white"
          cursor="pointer"
          fontFamily="inherit"
          padding="15px"
          margin="0 15px" onClick={()=>{setIsMainMintSelected("BurnNFT")}}>Burn NFT</Button>:isConnected && <Button onClick={()=>{setIsMainMintSelected("MainMint")}} backgroundColor="#D6517D"
          borderRadius="5px"
          boxShadow="0px 2px 2px 1px #0F0F0F"
          color="white"
          cursor="pointer"
          fontFamily="inherit"
          padding="15px"
          margin="0 15px">Mint NFT</Button>}

      {isConnected ? (<Box margin="0 15px">Connected</Box>) :
        (<Button onClick={connectAccount}
          backgroundColor="#D6517D"
          borderRadius="5px"
          boxShadow="0px 2px 2px 1px #0F0F0F"
          color="white"
          cursor="pointer"
          fontFamily="inherit"
          padding="15px"
          margin="0 15px"
        >Connect </Button>)}
    </Flex>
  )
}

export default NavBar