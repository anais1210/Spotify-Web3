// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "./SoundNFT.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract AlbumFactory is AccessControlUpgradeable {
    bytes32 public constant ARTIST_ROLE = keccak256("ADMIN_ROLE");

    event AlbumCreated(address ablbumAddress, address artist);

    constructor(){
        _grantRole(ARTIST_ROLE, msg.sender);
    }

    // function createAlbum(string memory name, string memory symbol) public onlyRole(ARTIST_ROLE) returns (address) {
    //     SoundNFT album = new SoundNFT();
    //     album.initialize(msg.sender, name, symbol, msg.sender);
    //     emit AlbumCreated(address(album), msg.sender);
    //     return address(album);
    // }

    // function getAlbumData(address album) public view onlyRole(ARTIST_ROLE) returns(string memory){
    //     SoundNFT albumInstance = SoundNFT(album);
    //     return albumInstance.name();
    // }
}