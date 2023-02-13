// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import {Unirep} from "@unirep/contracts/Unirep.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract AddressAttester is Ownable {

    // root stored onchain
    bytes32 public root;

    Unirep public unirep;

    constructor(Unirep _unirep, uint256 _epochLength, bytes32 _root) {
        // set unirep address
        unirep = _unirep;

        // set SMT root
        root = _root;

        // sign up as an attester
        unirep.attesterSignUp(_epochLength);
    }

    
    function getRoot() public view returns (bytes32) {
      return root;
    }


    // sign up users in this app
    function userSignUp(
        uint256[] memory publicSignals,
        uint256[8] memory proof
    ) public {
        unirep.userSignUp(publicSignals, proof);
    }

    // todo: Verify proofs when circuits are built

}