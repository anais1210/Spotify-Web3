// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Test, console} from "../lib/forge-std/src/Test.sol";
import {SoundNFT} from "../contracts/SoundNFT.sol";
import {Staff} from "../contracts/Staff.sol";

contract SoundNFTTest is Test {


    SoundNFT instance;
    Staff staff;
    address admin;
    address artist;

    // Create a new instance of the contract, declare owner and random recipient
    function setUp() public {
        instance = new SoundNFT();
        staff = new Staff();
        // create a random recipient address
        artist = makeAddr("artist");
        admin = makeAddr("admin");
        instance.initialize(address(staff), "Album", "ALB");
        staff.initialize(admin);
        vm.prank(admin);
        staff.addStaff(artist, "artist");

    }
    function testInitialize() public view {
        assertEq(instance.name(), "Album");
        assertEq(instance.symbol(), "ALB");
    }

    function testSafeMint() public {
        string memory tokenURI = "ipfs://CID";
        vm.startPrank(artist);
        instance.safeMint(artist, tokenURI);
        assertEq(instance.tokenURI(0), tokenURI); 
        // forge test -vv to see logs
        console.log("Token Name: ", instance.name());
        vm.stopPrank();
    }
    

}
