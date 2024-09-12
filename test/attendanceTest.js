const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Attendance Contract", function () {
    let Attendance;
    let attendance;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        Attendance = await ethers.getContractFactory("Attendance");
        [owner, addr1, addr2] = await ethers.getSigners();

        attendance = await Attendance.deploy();
        await attendance.deployed();
    });

    it("Should initialize with 0 attendees", async function () {
        const initialCount = await attendance.numberAttending();
        expect(initialCount).to.equal(0);
    });

    it("Should increment attendees count when IM_HERE is called", async function () {
        await attendance.connect(addr1).IM_HERE();
        expect(await attendance.numberAttending()).to.equal(1);

        await attendance.connect(addr2).IM_HERE();
        expect(await attendance.numberAttending()).to.equal(2);
    });

    it("Should accept Ether when IM_HERE is called", async function () {
        const initialBalance = await ethers.provider.getBalance(attendance.address);
        expect(initialBalance).to.equal(0);

        await attendance.connect(addr1).IM_HERE({ value: ethers.utils.parseEther("0.1") });

        const finalBalance = await ethers.provider.getBalance(attendance.address);
        expect(finalBalance).to.equal(ethers.utils.parseEther("0.1"));
    });
});