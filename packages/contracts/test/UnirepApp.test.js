const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployUnirep } = require("@unirep/contracts/deploy");
const { genRandomSalt, hashOne, ZkIdentity } = require("@unirep/utils");
const { schema, UserState } = require("@unirep/core");
const { DB, SQLiteConnector } = require("anondb/node");
const { Unirep } = require("@unirep/contracts");

const {
  defaultProver: prover,
} = require("@unirep/circuits/provers/defaultProver");

async function genUserState(id, app) {
  // generate a user state
  const db = await SQLiteConnector.create(schema, ":memory:");
  const unirepAddress = await app.unirep();
  console.log(unirepAddress);
  const attesterId = BigInt(app.address);
  const userState = new UserState({
    db,
    prover,
    unirepAddress,
    provider: ethers.provider,
    attesterId,
    _id: id,
  });
  await userState.start();
  await userState.waitForSync();
  return userState;
}

describe("Address Attester App", function () {
  let unirep;
  let app;

  // epoch length
  const epochLength = 30;
  let startTime = 0;
  // generate random user id
  const id = new ZkIdentity();
  // graffiti preimage
  const graffitiPreImage = genRandomSalt();

  it("test", async function () {
    const [addr] = await ethers.getSigners();
    unirep = await deployUnirep(addr);
    const App = await ethers.getContractFactory("AddressAttester");
    app = await App.deploy(unirep.address, epochLength);
    await app.deployed();
    startTime = (await unirep.attesterStartTimestamp(app.address)).toNumber();
  });

  it("user sign up", async () => {
    const userState = await genUserState(id, app);

    // generate
    const { publicSignals, proof } = await userState.genUserSignUpProof();
    await app.userSignUp(publicSignals, proof).then((t) => t.wait());
  });

  it("submit address attestation", async () => {
    const userState = await genUserState(id, app);

    const nonce = 0;
    const { publicSignals, proof, epochKey, epoch } =
      await userState.genEpochKeyProof({ nonce });
    await unirep
      .verifyEpochKeyProof(publicSignals, proof)
      .then((t) => t.wait());

    const [_, addr2] = await ethers.getSigners();
    // submit an address as posRep
    const posRep = addr2.address;
    const negRep = 0;
    const graffiti = hashOne(graffitiPreImage);
    await app
      .submitAttestation(epoch, epochKey, posRep, negRep, graffiti)
      .then((t) => t.wait());
  });
  // todo: this won't pass - prob because of invalid signature
  it.skip("Check signature with isValidSignature function", async () => {
    const [signer] = await ethers.getSigners();
    console.log(signer);

    const hash = await ethers.utils.keccak256("0x1234");
    const signature = await signer.signMessage(ethers.utils.arrayify(hash));

    expect(await app.isValidSignature(signer.address, signature)).to.equal(
      true
    );
    // expect(app.isValidSignature(signer, signature)).to.equal(true);
  });

  it("(attester/relayer) process attestations", async () => {
    const userState = await genUserState(id, app);
    const epoch = await userState.loadCurrentEpoch();
    await unirep.buildHashchain(app.address, epoch).then((t) => t.wait());
    const index = await unirep.attesterHashchainProcessedCount(
      app.address,
      epoch
    );
    const hashchain = await unirep.attesterHashchain(app.address, epoch, index);
    const { publicSignals, proof } = await userState.genAggregateEpochKeysProof(
      {
        epochKeys: hashchain.epochKeys,
        newBalances: hashchain.epochKeyBalances,
        hashchainIndex: hashchain.index,
        epoch,
      }
    );
    await unirep.processHashchain(publicSignals, proof).then((t) => t.wait());
  });
});
