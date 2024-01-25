//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract DegenRWA is ERC721, Ownable {
    uint public mintPrice;
    uint public totalSupply;
    uint public maxSupply;
    uint public maxPerWallet;
    bool public isPublicMintEnabled;
    string internal baseTokenUri;
    mapping(address => uint) public walletMints;

    constructor() payable ERC721('DegenRWA','DRWA'){
        mintPrice = 1 ether;
        totalSupply = 0;
        maxSupply = 1000000;
        maxPerWallet = 3;
    }

    function setIsPublicMintEnabled(bool _isPublicMintEnabled) external onlyOwner {
        isPublicMintEnabled = _isPublicMintEnabled;
    }

    function setBaseTokenUri(string calldata _baseTokenUri) external onlyOwner {
        baseTokenUri = _baseTokenUri;
    }

    function tokenURI(uint _tokenId) public view override returns (string memory){
        require(_exists(_tokenId),'Token does not exist');
        return string(abi.encodePacked(baseTokenUri, Strings.toString(_tokenId), ".json"));
    }

    function mint(uint _quantity) public payable {
        require(isPublicMintEnabled,"Minting disabled");
        require(msg.value == _quantity * mintPrice,"RBNT is not equal to the mint price");
        require(totalSupply + _quantity <= maxSupply,"Exceeds max supply");
        require(walletMints[msg.sender] + _quantity <= maxPerWallet,"Exceeds per wallet limit");

        for(uint i = 0; i < _quantity; i++){
            uint newTokenId = totalSupply + 1;
            totalSupply++;
            _safeMint(msg.sender, newTokenId);
        }
    }

    function burn(uint _tokenId) external {
        require(_exists(_tokenId), "Token does not exist");
        require(ownerOf(_tokenId) == msg.sender, "You are not the owner of this token");

        _burn(_tokenId);
        totalSupply--;

        // You may want to emit an event indicating a successful burn
        emit Burn(msg.sender, _tokenId);
    }

    // Event to signal a successful burn
    event Burn(address indexed owner, uint indexed tokenId);
}

