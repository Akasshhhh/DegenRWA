//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/token/ERC721/ERC721.sol';
import '@openzeppelin/access/Ownable.sol';

contract DegenRWA is ERC721, Ownable {
    uint public mintPrice;
    uint public totalSupply;
    uint public maxSupply;
    uint public maxPerWallet;
    bool public isPublicMintEnabled;
    string public baseURI = "https://gateway.pinata.cloud/ipfs/";
    string private imageCID = "QmNww2zNFERgWzZNtx5ZMbYi3wKreo7J3H4sdJg5dV4iF2";
    mapping(address => uint) public walletMints;
    mapping(address => uint[]) private ownedTokens;

    constructor() payable ERC721('DegenRWA','DRWA'){
        mintPrice = 1 ether;
        totalSupply = 0;
        maxSupply = 1000000;
        maxPerWallet = 3;
    }

    function setIsPublicMintEnabled(bool _isPublicMintEnabled) external onlyOwner {
        isPublicMintEnabled = _isPublicMintEnabled;
    }

    function tokenURI(uint _tokenId) public view override returns (string memory){
        require(_exists(_tokenId),'Token does not exist');
        return string(abi.encodePacked(baseURI, imageCID));
    }

    function mint(uint _quantity) public payable {
        require(isPublicMintEnabled, "Minting disabled");
        require(msg.value == _quantity * mintPrice, "RBNT is not equal to the mint price");
        require(totalSupply + _quantity <= maxSupply, "Exceeds max supply");
    
        uint walletMintCount = walletMints[msg.sender];
        require(walletMintCount + _quantity <= maxPerWallet, "Exceeds per wallet limit");
    
        for (uint i = 0; i < _quantity; i++) {
            uint newTokenId = totalSupply + i + 1;
            totalSupply++;
            ownedTokens[msg.sender].push(newTokenId);
            _safeMint(msg.sender, newTokenId);
        }
    
        // Update the walletMints mapping after successful mint
        walletMints[msg.sender] = walletMintCount + _quantity;
    }
    

    function burn(uint _tokenId) external {
        require(_exists(_tokenId), "Token does not exist");
        require(ownerOf(_tokenId) == msg.sender, "You are not the owner of this token");

        address payable recipient = payable(owner());
        recipient.transfer(1 ether);

        _burn(_tokenId);
        totalSupply--;

        // You may want to emit an event indicating a successful burn
        emit Burn(msg.sender, _tokenId);
    }

    function getOwnedTokens(address _owner) external view returns(uint[] memory){
        return ownedTokens[_owner];
    }

    // Event to signal a successful burn
    event Burn(address indexed owner, uint indexed tokenId);
}

