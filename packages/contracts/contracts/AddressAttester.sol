// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import {Unirep} from "@unirep/contracts/Unirep.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

// this attester aims to create an anonymity set for eth addresses 
// an eth address would receive a semaphore identity

// pseudocode

contract AddressAttester {

    Unirep public unirep;

    struct AddressProof {
        bytes32 epochKey;
        bytes32 merkleRoot;
        address eoa;
    }

    mapping(address => AddressProof) public addressProofs;


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

    function register(bytes32 epochKey, bytes32 merkleRoot, address addr) public {
        // Address hasn't been registered before
        require(addressProofs[addr].epochKey == bytes32(0));
        // Only the address owner can register it
        require(msg.sender == addr); 
        addressProofs[addr] = AddressProof({epochKey: epochKey, merkleRoot: merkleRoot, eoa: addr});
    }

    function verify(address addr, bytes32 epochKey, bytes32 merkleRoot) public view returns (bool) {
        return addressProofs[addr].epochKey == epochKey && addressProofs[addr].merkleRoot == merkleRoot;
    }
}

// how would this be integrated into other applications? For Dapps, the smart contract could inherit this functionality
// and the eth address would be added to the AddressAttester's data strucutre (merkle or mapping?). 