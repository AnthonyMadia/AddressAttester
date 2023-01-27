// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;

uint256 constant SIZE = 255;
uint256 constant BUFFER_LENGTH = 1;
uint256 constant DEPTH = 8;

library StateTree {
    // todo: convert index of type uintX to address and convert address to bytes
    function bitmap(uint256 index) internal pure returns (uint8) {
        uint8 bytePos = (uint8(BUFFER_LENGTH) - 1) - (uint8(index) / 8);
        return bytePos + 1 << (uint8(index) % 8);
    }

    function empty() internal pure returns (bytes32) {
		return 0;
    }

	function validate(
		bytes32[] memory _proofs,
        uint8 _bits,
      	address _index,
      	bytes32 _leaf,
	 	bytes32 _expectedRoot
	) internal pure returns (bool) {
		return (register(_proofs, _bits, _index, _leaf) == _expectedRoot);
	}

	function write(
		bytes32[] memory _proofs,
        uint8 _bits,
      	address _index,
	 	bytes32 _nextLeaf,
      	bytes32 _prevLeaf,
		bytes32 _prevRoot
	) internal pure returns (bytes32) {
		require(
			validate(_proofs, _bits, _index, _prevLeaf, _prevRoot),
		  	"update proof not valid"
		);
		return register(_proofs, _bits, _index, _nextLeaf);
	}

    function hash(bytes32 a, bytes32 b) internal pure returns (bytes32) {
        if (a == 0 && b == 0) {
            return 0;
        } else {
            return keccak256(abi.encode(a, b));
        }
    }

    // index is address and leaf will be `1`

    // can the address be typecasted into bytes32? no
	function register(
      bytes32[] memory _proofs,
      uint8 _bits,
      address _index,
      bytes32 _leaf
    ) internal pure returns (bytes32) {
       bytes32 index = bytes32(bytes20(address));
        
        require(_index < SIZE, "_index bigger than tree size");
        require(_proofs.length <= DEPTH, "Invalid _proofs length");

        // test bitwise logic
     	for (uint256 d = 0; d < DEPTH; d++) {
        	if ((_index & 1) == 1) {
              if ((_bits & 1) == 1) {
                _leaf = hash(_proofs[d], _leaf);
              } else {
                _leaf = hash(0, _leaf);
              }
        	} else {
              if ((_bits & 1) == 1) {
                _leaf = hash(_leaf, _proofs[d]);
              } else {
                _leaf = hash(_leaf, 0);
              }
        	}

            _bits = _bits >> 1;
        	_index = _index >> 1;
      	}
		return _leaf;
    }
}