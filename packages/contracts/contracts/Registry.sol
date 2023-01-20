// // SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.0;

// contract Registry {

//     // data structures are important here 
//     // if registry is for Unirep Users, their 'id' would be epoch keys so 
//         // we would use a mapping that maps epoch keys to NFTs

//     // epochKey => NFT
//     mapping(uint256 => uint256) registry;

//     // 

//     // how would I efficently store the addresses -> NFT ownership

//     function joinGroupWithNFT(address eoa, address nftContract) public payable {
//         // checks the NFT contract 0xbb has 0xaa as an owner
//         // Address is now marked as owning the NFT in Registry

//         //2. Address 0xaa calls a function Registry.joinGroup
//         //  This function accepts a semaphore identity that is added to the group
//         // joinGroup(msg.sender, 'example');
//         // Now the owner of the semaphore identity can make proofs as an anonymous members of the group!

        
   
//     }

//     function joinGroup(address eoa, string memory groupName) public {
//         //  allow user to join group
//     }

//     function joinGroup() public {
//     // Get the address of the user calling the function
//     address userAddress = msg.sender;

//     // Call the NFT smart contract to get the owner of the NFT
//     bytes32 returnValue = address(nftContractAddress).call(abi.encodeWithSignature("ownerOf(uint256)", nftId));
//     address nftOwner = abi.decode(returnValue, (address));

//     require(nftOwner == userAddress, "User does not have the necessary NFT");

//     // Add the user to the group if they have the necessary NFT
//     members[userAddress] = true;

//     emit JoinedGroup(userAddress);
// }   
// }