//SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./HarmonyNFT.sol";
import "./Management.sol";

contract AlbumFactory is Initializable, AccessControlUpgradeable, UUPSUpgradeable {
    Management public management;
    HarmonyNFT[] public deployedAlbums;

    function initialize(address managementAddress) public initializer {
        __AccessControl_init();
        __UUPSUpgradeable_init();
        management = Management(managementAddress);
    }

    function createAlbum (string memory name, string memory symbol) public{
        require(management.isArtist(msg.sender), "Only artists can create albums");
        _createAlbum(name, symbol);
    }
    function _createAlbum(string memory name, string memory symbol) internal {
        HarmonyNFT harmonyNFT = new HarmonyNFT(msg.sender, name, symbol);
        deployedAlbums.push(harmonyNFT);
    }

    function _getDeployedAlbums() public view returns (HarmonyNFT[] memory) {
        return deployedAlbums;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
    {}
}