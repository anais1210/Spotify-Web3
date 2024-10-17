// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./Staff.sol";

contract SoundNFT is Initializable, ERC721Upgradeable, ERC721URIStorageUpgradeable, ERC721BurnableUpgradeable, UUPSUpgradeable {
    uint256 private _nextTokenId;
    Staff private staffContract;

    modifier onlyArtist() {
        require(keccak256(abi.encodePacked(staffContract.isStaff(msg.sender))) == keccak256(abi.encodePacked("artist")), "Caller is not an artist");
        _;
    }
    modifier onlyStaff() {
        require(keccak256(abi.encodePacked(staffContract.isStaff(msg.sender))) == keccak256(abi.encodePacked("admin")), "Caller is not an admin");
        _;
    }

    function initialize(address staffContractAddress, string memory name, string memory symbol)
        initializer public
    {
        __ERC721_init(name, symbol);
        __ERC721URIStorage_init();
        __ERC721Burnable_init();
        __UUPSUpgradeable_init();

        staffContract = Staff(staffContractAddress);

    }

    function safeMint(address to, string memory uri) public onlyArtist returns(uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId; 
    }


    function _authorizeUpgrade(address newImplementation)
        internal
        onlyStaff
        override
    {}

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // This function is a part of the ERC-165 standard and is crucial for interface detection
    // The override mechanism ensures that all inherited contracts "supportsInterface" function 
    // are correctly combined, allowing the contract to advertise support for multiple interfaces

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (bool)
    {
        // Super is a keywork used to called a function from a parent contract
        return super.supportsInterface(interfaceId);
    }
    

}
