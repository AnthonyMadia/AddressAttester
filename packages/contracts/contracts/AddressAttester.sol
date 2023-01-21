// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import {Unirep} from "@unirep/contracts/Unirep.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract AddressAttester {

    Unirep public unirep;


    // todo: change to SMT 
    mapping (address => bool) public registeredAddresses;

    constructor(Unirep _unirep, uint256 _epochLength) {
        // set unirep address
        unirep = _unirep;

        // sign up as an attester
        unirep.attesterSignUp(_epochLength);
    }

    // sign up users in this app
    function userSignUp(
        uint256[] memory publicSignals,
        uint256[8] memory proof
    ) public {
        unirep.userSignUp(publicSignals, proof);
    }

    // submit attestations (fields may change with https://github.com/Unirep/Unirep/issues/285)
    function submitAttestation(
        uint256 targetEpoch,
        uint256 epochKey,
        uint256 posRep,
        uint256 negRep,
        uint256 graffiti
    ) public {
        unirep.submitAttestation(
            targetEpoch,
            epochKey,
            posRep,
            negRep,
            graffiti
        );
    }

    function register(address addr) public {
        // check if Address hasn't been registered before and only the address owner can register it
        require(!registeredAddresses[addr]); 
        require(msg.sender == addr);
        registeredAddresses[addr] = true;
    }

    function verify(address addr) public view returns (bool) {
        return registeredAddresses[addr];
    }
}

