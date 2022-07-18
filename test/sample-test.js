const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("Greeter", function () {
  const ONE_ETHER = 1_000_000_000_000_000_000;
  const provider = waffle.provider;

  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const [addrA, addrB, addrC, addrD, addrE] = await ethers.getSigners();
    
    //Just test send token between addesses
    // await addrA.sendTransaction({ to: addrB, value: ONE_ETHER });
    const txether = await addrA.sendTransaction({
      to: addrB.address,
      value: ethers.utils.parseEther("5000") // 1 ether
    });

    await txether.wait();

    const balanceA = await provider.getBalance(addrA.address);
    const balanceB = await provider.getBalance(addrB.address);
    console.log("AddressA: ", addrA.address, "; Balances: ", balanceA);
    console.log("AddressB: ", addrB.address, "; Balances: ", balanceB);

    const greeter = await Greeter.connect(addrC).deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.connect(addrB).setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    const greetMsg = await greeter.connect(addrA).greet();
    expect(greetMsg).to.equal("Hola, mundo!");

    const blockNumber = await greeter.getBlocknumber();
    const owner = await greeter.owner();


    console.log("Greeter Addr: ", greeter.address);
    console.log("Set Greet: ", greetMsg);
    console.log("BlockNumber: ", blockNumber);
    console.log("Owner", owner);
  });
});
