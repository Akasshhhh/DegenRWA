import { ethers } from 'ethers';
import DegenRWA from '../DegenRWA.json';
import toast from 'react-hot-toast';
import { useState, React, useEffect } from 'react';
import { Button, Input } from '@chakra-ui/react';
import degen from '../assets/degen-kang.png';

const DegenRWAContractAddress = "0x3c8670ABedd7b650168A8af4695C81f435148318";

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

  const handleBurn = async () => {
    const selectedTokenId = ownedTokenIds[selectedTokenIndex];
    if (!selectedTokenId) {
      toast.error("Please select an NFT to burn.");
      return;
    }

    try {
      setBurnInProgress(true);
      // Update the ownedTokenIds array first
      const updatedOwnedTokenIds = ownedTokenIds.filter(id => id !== selectedTokenId);
      setOwnedTokenIds(updatedOwnedTokenIds);

      // Directly pass the selectedTokenId to the burn function
      const tx = await contract.burn(selectedTokenId);
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
    } finally {
      // Reset burn in progress
      setBurnInProgress(false);
    }
  };

  const fetchOwnedTokenIds = async () => {
    if (accounts.length > 0) {
      try {
        // Fetch owned and burned tokens
        const ownedTokens = await contract.getOwnedTokens(accounts[0]);
        const burnedTokens = await contract.getBurntTokens(accounts[0]);
  
        // Convert the burnedTokens array to a Set for efficient filtering
        const burnedTokensSet = new Set(burnedTokens.map(id => id.toString())); // Convert to string
  
        // Filter out common token IDs
        const filteredOwnedTokens = ownedTokens.filter(id => !burnedTokensSet.has(id.toString()));
  
        setOwnedTokenIds(filteredOwnedTokens);
      } catch (e) {
        console.error("Error fetching tokenIds", e);
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
