// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {SoundNFT} from "./SoundNFT.sol";
import "./Staff.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract AlbumFactory is UUPSUpgradeable{

    address[] public deployedAlbums;
    Staff private staffContract;
    SoundNFT[] public deployedSoundNFT;

    
    modifier onlyArtist() {
        require(keccak256(abi.encodePacked(staffContract.isStaff(msg.sender))) == keccak256(abi.encodePacked("artist")), "Caller is not an artist");
        _;
    }
        modifier onlyStaff() {
        require(keccak256(abi.encodePacked(staffContract.isStaff(msg.sender))) == keccak256(abi.encodePacked("admin")), "Caller is not an admin");
        _;
    }

    function initialize( address staffContractAddress) public initializer {
        __UUPSUpgradeable_init();
        staffContract = Staff(staffContractAddress);
    }

    function createAlbum(string memory name, string memory symbol, address staffContractAddress) public onlyArtist returns (address){
        // SoundNFTCollection newAlbum = new SoundNFT(staffContractAddress, name, symbol);
        SoundNFT newAlbum = new SoundNFT();
        newAlbum.initialize(staffContractAddress, name, symbol);
        deployedAlbums.push(address(newAlbum));
        return address(newAlbum);
    }
    function getCollections() external view returns (SoundNFT[] memory){
        return deployedSoundNFT;
    }
    function _authorizeUpgrade(address newImplementation) internal onlyStaff override {}

}