---
Title: 🧩 Introduction
---

# 🧩 Introduction

## How does the Unirep protocol work?

There are two different actors in the Unirep protocol: [users and attesters](protocol/glossary/users-and-attesters.md)

* **Users** can receive and spend [**reputation**](protocol/glossary/reputation.md), prove their reputation, and use temporary identities called [**epoch keys**](protocol/glossary/epoch-key.md) to interact with other people. Users can generate a set of new epoch keys every [**epoch**](protocol/glossary/epoch.md) (in this case, 7 days). In a way, the user gets a completely new identities every epoch which preserves their privacy.
* **Attesters** represent users to give reputation to an epoch key. Attester IDs are public and unchangeable so users can always prove that the reputation is from the attester.

### 1. Registration

_**Users and attesters use different ways to sign up in Unirep**_

![User signup and attester signup in Unirep](https://miro.medium.com/max/4800/0\*wcqrf4SN2TRx38YI)

*   **User**

    A user generates <font color="red">identity</font> and <font color="green">identity commitment</font> through [Semaphore](https://github.com/semaphore-protocol).

    The user holds the _identity_ like a private key, and the _identity commitment_ is like a public key that is submitted to the Unirep contract.
*   **Attester**

    The attester uses his own **wallet** or the address of a **smart contract** to register. After calling the attester sign up function, the Unirep contract will assign an _attester ID_ to this <font color="green">address</font>.

    Whenever the attester gives an attestation, the Unirep contract will check whether the address is registered. If it is registered, the attester is allowed to give reputation to an epoch key.

    > **Note:** Everyone can sign up as an attester with their wallet address and will receive a new attester ID

### 2. Give Reputation

_**Only epoch keys can receive reputation.**_

![How an attester attests to an epoch key](https://miro.medium.com/max/4800/0\*zxlIej01nppoYBoc)

After a user signs up to Unirep, he can generate epoch keys to receive reputation. These epoch keys change every epoch, are unique to every user and look completely random. Therefore, to convince others that the epoch key is computed correctly with the current epoch and a valid nonce, an [**epoch key proof**](protocol/circuits/epoch-key-proof.md) is used. Also, to convince others the epoch key is generated by a signed up user, the [**Global State Tree (GST)**](protocol/glossary/trees.md#global-state-tree) is proposed. If the output global state tree root matches one of the history roots in given epoch, others can be sure that the epoch key owner is a valid user in the given epoch.

After seeing the valid **epoch key** and **epoch key proof**, the attester (or a user can submit an attestation through an attester) can give reputation to the epoch key through the Unirep smart contract.

### 3. Receive Reputation

A user can prove which epoch key he owns and everyone can easily query how much reputation the epoch key has from the contract. A user that has received some bad reputation during a certain epoch could _decide not to show those epoch keys_ to other users. Therefore, after an epoch ends and all epoch keys are sealed, Unirep restricts users to generate a [**User State Transition**](protocol/glossary/user-state-transition.md) proof that is used to update their reputation status.

![User State Transition in Unirep](https://miro.medium.com/max/4800/0\*t18QHcnKhY5LA5P8)

The [**User State Transition Proof**](protocol/circuits/user-state-transition-proof.md) is used to ensure that the user calculates the latest user state (represents by a [**User State Tree (UST)**](protocol/glossary/trees.md#user-state-tree)) in the correct way, and the user does not miss any attestation.

### 4. Prove Reputation

After a user performs a User State Transition, he will have the latest user state. At this time, the user can prove everyone on the platform how many reputation points he has in Unirep through a [**reputation proof**](protocol/circuits/reputation-proof.md). The reputation proof checks&#x20;

1. whether the user exists, has the claimed reputation (for example, it sums up positive and negative reputation from a specified attester ID)
2. The user performs User State Transition in the given epoch.

### 5. Advanced

To see more functions in Unirep, please refer to the following links

* [Spend reputation](cli/spend-reputation.md)
* [Airdrop reputation](cli/airdrop-reputation.md)
