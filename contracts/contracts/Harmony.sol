// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract Harmony is Initializable, ERC20Upgradeable, ERC20BurnableUpgradeable, AccessControlUpgradeable, ERC20PermitUpgradeable, UUPSUpgradeable {

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN");
    bytes32 public constant ARTIST_ROLE = keccak256("ARTIST");

    function initialize(address admin) initializer public {
        __ERC20_init("HARMONY", "MONY");
        __ERC20Burnable_init();
        __AccessControl_init();
        __ERC20Permit_init("HARMONY");
        __UUPSUpgradeable_init();

        _grantRole(ADMIN_ROLE, admin);
        _grantRole(ARTIST_ROLE, admin);
        _setRoleAdmin(ARTIST_ROLE, ADMIN_ROLE);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
    
    //  function burn(address to, uint256 amount) public onlyRole(ADMIN_ROLE) {
    //     _burn(to, amount);
    // }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyRole(ADMIN_ROLE)
        override
    {}
}