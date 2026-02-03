// SPDX-License-Identifier: Unlicensed

pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract Management is Initializable, AccessControlUpgradeable, UUPSUpgradeable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");
    bytes32 public constant ARTIST_ROLE = keccak256("ARTIST");

    // Events for artist management - used by The Graph
    event ArtistAdded(address indexed artist, address indexed addedBy, uint256 timestamp);
    event ArtistRemoved(address indexed artist, address indexed removedBy, uint256 timestamp);

    function initialize(address admin)
        initializer public
    {
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(ADMIN_ROLE, admin);
        _setRoleAdmin(ARTIST_ROLE, ADMIN_ROLE); // ADMIN > ARTIST

    }

    function _addArtist(address account) internal{
        _grantRole(ARTIST_ROLE, account);
    }
    function _removeArtist(address account) internal {
        _revokeRole(ARTIST_ROLE, account);
    }
    function addArtist(address account) external onlyRole(ADMIN_ROLE) {
        _addArtist(account);
        emit ArtistAdded(account, msg.sender, block.timestamp);
    }
    function removeArtist(address account) external onlyRole(ADMIN_ROLE) {
        _removeArtist(account);
        emit ArtistRemoved(account, msg.sender, block.timestamp);
    }
    function _isArtist(address account) internal view returns (bool) {
        return hasRole(ARTIST_ROLE, account);
    }
    function isArtist(address account) external view returns (bool) {
        return _isArtist(account);
    }
    function _isAdmin(address account) internal view returns (bool) {
        return hasRole(ADMIN_ROLE, account);
    }
    function isAdmin(address account) external view returns (bool) {
        return _isAdmin(account);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
         onlyRole(ADMIN_ROLE)
        override
    {}
}