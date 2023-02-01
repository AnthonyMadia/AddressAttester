# Address Attester

This project aims to create a [Unirep Attester](https://developer.unirep.io/docs/protocol/users-and-attesters#:~:text=Attesters%20%F0%9F%91%91%E2%80%8B,the%20users%27%20reputation.) that will create an anonymity set for all Ethereum Addresses. The central idea is an `AddressAttester` that will give an Ethereum address a semaphore identity as user data. When the user wants to sign up with another platform they can prove control of an Ethereum address by proving their unirep user data. A user may be able to directly interact with applications without signing up.

When a user wants to anonymously sign up for an application they can do the following in ZK:

- Prove Ethereum address in unirep user data
- Prove that the address exists in a merkle tree with root R

Every address that registers will, by default, be visible. This can be solved by symmetrically encrypting the address in the user data. A zk proof for this would:

- Calculate ethereum address from private key (500k constraints)
- Encrypt the address using chacha (use semaphore private key as password) (~15k constraints)
- Output the encrypted address

This proof would be given to the attester, and the attester would give the encrypted address to the user as user data (after verifying the proof).

Then, when a user wants to join an application they can prove they control an address in zk by:

- Prove they have the encrypted address as user data
- Decrypt the address (~15k constraints)
- Prove the address exists in a tree with root R

### Todos:

- [ ] Simple AddressAttester that registers an ethereum address
- [ ] Circuit tfor user to set the leaf at their address index to 1
- [ ] Circuit that proves the control an address
- [ ] Circuit that would encrypt the address in the UniRep user data correct using a chacha20 implementation

---

- [ ] Demo application built with this `AddressAttester` that allows users to anonymously join groups

### Acknowledgements

- Bootstrapped with [Create-Unirep-App](https://github.com/Unirep/create-unirep-app)
- PrivateKeyToAddress component from [0xPARC](https://github.com/0xPARC/circom-ecdsa)
