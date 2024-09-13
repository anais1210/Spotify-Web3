// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Test, console} from "../lib/forge-std/src/Test.sol";
import {SoundToken} from "../contracts/SoundToken.sol";
import {Staff} from "../contracts/Staff.sol";

contract SoundTokenTest is Test {


    SoundToken instance;
    Staff staff;
    address admin;
    address artist;
    address addr1;

    function setUp() public {
        instance = new SoundToken();
        staff = new Staff();
        // create a random recipient address
        artist = makeAddr("artist");
        admin = makeAddr("admin");
        addr1 = makeAddr("user");
        staff.initialize(admin);
        vm.startPrank(admin);
        staff.addStaff(artist, "artist");
        vm.stopPrank();
        instance.initialize(address(staff));
    }
    function testInitialize() public view {
        assertTrue(staff.hasRole(staff.ADMIN_ROLE(), admin));
    }
    function testAddRole() public{
        vm.startPrank(admin);
        staff.addStaff(artist, "artist");
        vm.stopPrank();
    }

    function testMintSuccess() public {
        vm.startPrank(artist);

        uint256 amount = 100000000;
        instance.mint(admin, amount);
        // Make sure the balance of the contract is 100
        assertEq(instance.balanceOf(admin), amount);
        vm.stopPrank();
    }  
    function testMintFail() public {
        vm.startPrank(addr1);
        uint256 amount = 100000000;
        vm.expectRevert(bytes("Caller is not an artist"));
        instance.mint(admin, amount);
        vm.stopPrank();

    }    
    function testBurnSuccess() public {

        uint256 mintAmount = 100000;
        uint256 burnAmount = 10;
        vm.prank(artist);
        instance.mint(admin, mintAmount);

        vm.startPrank(admin);
        instance.burn(admin, burnAmount);
        assertEq(instance.balanceOf(admin), (mintAmount - burnAmount));
        vm.stopPrank();
    }
    
}
