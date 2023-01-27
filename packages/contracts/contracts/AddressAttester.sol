// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import {Unirep} from "@unirep/contracts/Unirep.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract AddressAttester is Ownable {

    // root stored onchain
    uint SMTRoot;

    Unirep public unirep;

    // todo: using SMT library 

    mapping (address => bool) public registeredAddresses;

    constructor(Unirep _unirep, uint256 _epochLength) {
        // set unirep address
        unirep = _unirep;

        // sign up as an attester
        unirep.attesterSignUp(_epochLength);
    }

    
    function getRoot() public view returns (uint) {
      return SMTRoot;
    }

    // strictly reserved for owner of contract
    function setRoot(uint _SMTRoot) public onlyOwner (){
      SMTRoot = _SMTRoot;
    } 

    // insert into the tree -- index is the Address and value is 1
    function register(address addr) public {
        // check if Address hasn't been registered before and only the address owner can register it
        require(!registeredAddresses[addr]); 
        require(msg.sender == addr);
        registeredAddresses[addr] = true;
    }

    function verify(address addr) public view returns (bool) {
        return registeredAddresses[addr];
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

}