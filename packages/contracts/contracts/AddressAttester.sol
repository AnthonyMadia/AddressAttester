// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import {Unirep} from "@unirep/contracts/Unirep.sol";
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';

contract AddressAttester {

    Unirep public unirep;

    constructor(Unirep _unirep, uint256 _epochLength) {
        // set unirep address
        unirep = _unirep;

        // sign up as an attester
        unirep.attesterSignUp(_epochLength);
    }

    function userSignUp(
        uint256[] memory publicSignals,
        uint256[8] memory proof
    ) public {
        unirep.userSignUp(publicSignals, proof);
    }

    // verify signature use for relayer
    // NOTE: This method not safe, contract may attack by signature replay.
    /**
     * Verify if the signer has a valid signature as claimed
     * @param signer The address of user who wants to perform an action
     * @param signature The signature signed by the signer
     */
    function isValidSignature(address signer, bytes memory signature)
        internal
        view
        returns (bool)
    {
        // Attester signs over it's own address concatenated with this contract address
        // todo: this should be a unique value and not text they would use somewhere else
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                '\x19Ethereum Signed Message:\n32',
                keccak256(abi.encodePacked(signer, this))
            )
        );
        return ECDSA.recover(messageHash, signature) == signer;
    }

    // todo: submit address attestation as pos rep
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