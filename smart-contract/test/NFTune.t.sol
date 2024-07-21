// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {NFTuneV1} from "../contracts/NFTuneV1.sol";

contract NFTuneV1Test is Test {

    NFTuneV1 instance;
    address owner;
    address recipient;

    // Create a new instance of the contract, declare owner and random recipient
    function setUp() public {
        instance = new NFTuneV1(address(this));
        // create a random recipient address
        recipient = makeAddr("recipient");
    }

    function testSafeMint() public {
        string memory tokenURI = "ipfs://CID";
        instance.safeMint(recipient, tokenURI);
        // Make sure the owner of NFT 0 is the recipient and the tokenURI 0 is what we passed in 
        assertEq(instance.ownerOf(0), recipient);
        assertEq(instance.tokenURI(0), tokenURI);
    }
    
}