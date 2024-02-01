import { ethers } from 'ethers';
import DegenRWA from '../DegenRWA.json';
import toast from 'react-hot-toast';
import { useState, React, useEffect } from 'react';
import { Button, Input } from '@chakra-ui/react';
import degen from '../assets/degen-kang.png'

const DegenRWAContractAddress = "0x5D4E7CFe1346e2f36aFa0780a8b1d3072b607718";

const BurnNFT = ({ accounts }) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(DegenRWAContractAddress, DegenRWA.abi, signer);

  const [ownedTokenIds, setOwnedTokenIds] = useState([]);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);
  const [burnInProgress, setBurnInProgress] = useState(false);


  useEffect(() => {
    fetchOwnedTokenIds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts]);

  async function handleBurn() {
    const selectedTokenId = ownedTokenIds[selectedTokenIndex];
    if (!selectedTokenId) {
      toast.error("Please select an NFT to burn.");
      return;
    }
  
    try {
      const hexTokenId = "0x" + selectedTokenId.toString(16);
      setBurnInProgress(true);
      // Update the ownedTokenIds array first
      const updatedOwnedTokenIds = ownedTokenIds.filter(id => id !== selectedTokenId);
      setOwnedTokenIds(updatedOwnedTokenIds);
  
      const tx = await contract.burn(hexTokenId);
      const receipt = await tx.wait();
  
      if (receipt.status === 1) {
        toast.success(`NFT with Token ID ${selectedTokenId} burned successfully.`);
        setSelectedTokenIndex(0); // Reset selected token index after burning
      } else {
        toast.error(`Failed to burn NFT with Token ID ${selectedTokenId}.`);
      }
    } catch (e) {
        toast.error("Error Burning NFT");
        console.log(e);
    }finally {
        // Reset burn in progress
        setBurnInProgress(false);
      } 
  }
  
  

  const fetchOwnedTokenIds = async () => {
    if (accounts.length > 0) {
      try {
        const ownedTokensHex = await contract.getOwnedTokens(accounts[0]);
        // Convert hex token IDs to decimal format
        const ownedTokens = ownedTokensHex.map(hexTokenId => parseInt(hexTokenId, 16));
        setOwnedTokenIds(ownedTokens);
        console.log(ownedTokens);
      } catch (e) {
        console.log("Error fetching tokenIds", e);
        
      }
    }
  };

  const handleDecrement = () => {
    if (selectedTokenIndex > 0) {
      setSelectedTokenIndex(selectedTokenIndex - 1);
    }
  };

  const handleIncrement = () => {
    if (selectedTokenIndex < ownedTokenIds.length - 1) {
      setSelectedTokenIndex(selectedTokenIndex + 1);
    }
  };

  return (
    <div>
      {ownedTokenIds.length > 0 ? (
        <div>
          <img
            width={"350px"}
            height={"400px"}
            style={{
              border: '4px solid black',
              borderRadius: '8px',
              overflow: 'hidden',
              padding: '5px',
              background: 'black',
            }}
            src={degen}
            alt="NFT"
          />
          <p>Select the NFT TokenId you want to burn </p>
          <div>
            <Button
              onClick={handleDecrement}
              backgroundColor="#D6517D"
              borderRadius="5px"
              boxShadow="0px 2px 2px 1px #0F0F0F"
              color="white"
              cursor="pointer"
              fontFamily="inherit"
              padding="15px"
              marginTop="10px"
            >
              -
            </Button>
            <Input
              value={ownedTokenIds[selectedTokenIndex]}
              readOnly
              fontFamily="inherit"
              width="100px"
              height="35px"
              textAlign="center"
              marginTop="15px"
            />
            <Button
              onClick={handleIncrement}
              backgroundColor="#D6517D"
              borderRadius="5px"
              boxShadow="0px 2px 2px 1px #0F0F0F"
              color="white"
              cursor="pointer"
              fontFamily="inherit"
              padding="15px"
              marginTop="10px"
            >
              +
            </Button>
          </div>
          <div>
            <Button
              onClick={handleBurn}
              backgroundColor="#D6517D"
              borderRadius="5px"
              boxShadow="0px 2px 2px 1px #0F0F0F"
              color="white"
              cursor="pointer"
              fontFamily="inherit"
              padding="15px"
              marginTop="10px"
            >
              Burn NFT
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {burnInProgress ? (
            <p>Burning NFT...</p>
          ) : (
            <p>You do not have any NFTs to burn</p>
          )}
        </div>
      )}
    </div>
  );
  
};

export default BurnNFT;
