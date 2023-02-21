// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import { Unirep } from '@unirep/contracts/Unirep.sol';
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

    // NOTE: This method not safe, contract may attack by signature replay.
    /**
     * Verify if the signer has a valid signature as claimed
     * @param signer The address of user who wants to perform an action
     * @param signature The signature signed by the signer
     */
    function isValidSignature(address signer, bytes memory signature)
        public
        view
        returns (bool)
    {
        // Attester signs over it's own address concatenated with this contract address
        bytes32 messageHash = keccak256(
            abi.encodePacked(
                '\x19Ethereum Signed Message:\n32',
                keccak256(abi.encodePacked(signer, this))
            )
        );
        return ECDSA.recover(messageHash, signature) == signer;
    }

    function submitManyAttestations(
        uint256 epochKey,
        uint256 targetEpoch,
        uint[] calldata fieldIndices,
        uint[] calldata vals
    ) public {
        require(fieldIndices.length == vals.length, 'arrmismatch');
        for (uint8 x = 0; x < fieldIndices.length; x++) {
            unirep.attest(epochKey, targetEpoch, fieldIndices[x], vals[x]);
        }
    }

    function submitAttestation(
        uint256 epochKey,
        uint256 targetEpoch,
        uint256 fieldIndex,
        uint256 val
    ) public {
        unirep.attest(
            epochKey,
            targetEpoch,
            fieldIndex,
            val
        );
    }
}