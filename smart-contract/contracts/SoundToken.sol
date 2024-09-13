// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./Staff.sol";

contract SoundToken is Initializable, ERC20Upgradeable, ERC20BurnableUpgradeable, UUPSUpgradeable {
    Staff private staffContract;
    
    modifier onlyArtist() {
        require(keccak256(abi.encodePacked(staffContract.isStaff(msg.sender))) == keccak256(abi.encodePacked("artist")), "Caller is not an artist");
        _;
    }
    modifier onlyStaff() {
        require(keccak256(abi.encodePacked(staffContract.isStaff(msg.sender))) == keccak256(abi.encodePacked("admin")), "Caller is not an admin");
        _;
    }

    function initialize(address staffContractAddress)
        initializer public
    {
        __ERC20_init("SOUND", "SND");
        __ERC20Burnable_init();
        __UUPSUpgradeable_init();
        staffContract = Staff(staffContractAddress);

    }

    function mint(address account, uint256 amount) public onlyArtist {
        _mint(account, amount);
    }

    function burn (address to, uint256 amount) public onlyStaff {
        _burn(to, amount);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyStaff
        override
    {}
    
    // function claim (address from, address to, uint256 amount) public onlyArtist {
    //     _transfer(from, to, amount);
    // }
   
}