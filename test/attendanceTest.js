const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Attendance Contract", function () {
  let Attendance;
  let attendance;
  let mainInstructor;
  let instructor2;
  let addr1;
  let addr2;

  beforeEach(async function () {
    Attendance = await ethers.getContractFactory("Attendance");
    [mainInstructor, instructor2, addr1, addr2] = await ethers.getSigners();

    attendance = await Attendance.deploy();
    await attendance.deployed();
  });

  it("Should assign the deployer as the first instructor", async function () {
    expect(await attendance.isInstructor(mainInstructor.address)).to.equal(true);
  });

  it("Should allow the instructor to add another instructor", async function () {
    await attendance.connect(mainInstructor).addInstructor(instructor2.address);
    expect(await attendance.isInstructor(instructor2.address)).to.equal(true);
  });

  it("Should allow an instructor to create a session", async function () {
    const title = "Math 101";
    const startTime = Math.floor(Date.now() / 1000); // current time in seconds
    const endTime = startTime + 3600; // one hour later

    const tx = await attendance
      .connect(mainInstructor)
      .createSession(title, startTime, endTime);
    const receipt = await tx.wait();
    const sessionId = receipt.events[0].args.sessionId.toNumber(); // Convert BigNumber to a regular number

    const sessionDetails = await attendance.getSessionDetails(sessionId);

    expect(sessionDetails[0]).to.equal(title);
    expect(sessionDetails[1].toString()).to.equal(startTime.toString());
    expect(sessionDetails[2].toString()).to.equal(endTime.toString());
    expect(sessionDetails[3]).to.equal(false);
  });

  it("Should allow an instructor to open and close the session", async function () {
    const title = "Math 101";
    const startTime = Math.floor(Date.now() / 1000);
    const endTime = startTime + 3600;

    const tx = await attendance
      .connect(mainInstructor)
      .createSession(title, startTime, endTime);
    const receipt = await tx.wait();
    const sessionId = receipt.events[0].args.sessionId.toNumber(); // Convert BigNumber to a regular number

    await attendance.connect(mainInstructor).openSession(sessionId);
    const sessionDetails = await attendance.getSessionDetails(sessionId);
    expect(sessionDetails[3]).to.equal(true);

    await attendance.connect(mainInstructor).closeSession(sessionId);
    const sessionDetailsAfterClose = await attendance.getSessionDetails(sessionId);
    expect(sessionDetailsAfterClose[3]).to.equal(false);
  });

  it("Should allow a student to mark attendance", async function () {
    const title = "Math 101";
    const startTime = Math.floor(Date.now() / 1000);
    const endTime = startTime + 3600;

    const tx = await attendance
      .connect(mainInstructor)
      .createSession(title, startTime, endTime);
    const receipt = await tx.wait();
    const sessionId = receipt.events[0].args.sessionId.toNumber(); // Convert BigNumber to a regular number

    await attendance.connect(mainInstructor).openSession(sessionId);
    await attendance.connect(addr1).markAttendance(sessionId);
    const isPresent = await attendance.connect(addr1).getAttendanceStatus(sessionId);
    expect(isPresent).to.equal(true);
  });

  it("Should not allow a student to mark attendance more than once", async function () {
    const title = "Math 101";
    const startTime = Math.floor(Date.now() / 1000);
    const endTime = startTime + 3600;

    const tx = await attendance
      .connect(mainInstructor)
      .createSession(title, startTime, endTime);
    const receipt = await tx.wait();
    const sessionId = receipt.events[0].args.sessionId.toNumber(); // Convert BigNumber to a regular number

    await attendance.connect(mainInstructor).openSession(sessionId);
    await attendance.connect(addr1).markAttendance(sessionId);

    await expect(attendance.connect(addr1).markAttendance(sessionId)).to.be.revertedWith(
      "Attendance already marked for this session"
    );
  });

  it("Should show the correct count of present students after closing session", async function () {
    const title = "Math 101";
    const startTime = Math.floor(Date.now() / 1000);
    const endTime = startTime + 3600;

    const tx = await attendance
      .connect(mainInstructor)
      .createSession(title, startTime, endTime);
    const receipt = await tx.wait();
    const sessionId = receipt.events[0].args.sessionId.toNumber(); // Convert BigNumber to a regular number

    await attendance.connect(mainInstructor).openSession(sessionId);
    await attendance.connect(addr1).markAttendance(sessionId);
    await attendance.connect(addr2).markAttendance(sessionId);
    await attendance.connect(mainInstructor).closeSession(sessionId);

    const totalPresent = await attendance.getTotalAttendance(sessionId);
    expect(totalPresent).to.equal(ethers.BigNumber.from(2));
  });

  it("Should revert if a non-instructor tries to open or close a session", async function () {
    const title = "Math 101";
    const startTime = Math.floor(Date.now() / 1000);
    const endTime = startTime + 3600;

    const tx = await attendance
      .connect(mainInstructor)
      .createSession(title, startTime, endTime);
    const receipt = await tx.wait();
    const sessionId = receipt.events[0].args.sessionId.toNumber(); // Convert BigNumber to a regular number

    await expect(attendance.connect(addr1).openSession(sessionId)).to.be.revertedWith(
      "Only an instructor can perform this action"
    );
    await expect(attendance.connect(addr1).closeSession(sessionId)).to.be.revertedWith(
      "Only an instructor can perform this action"
    );
  });

  it("Should allow a newly added instructor to open and close sessions", async function () {
    const title = "Math 101";
    const startTime = Math.floor(Date.now() / 1000);
    const endTime = startTime + 3600;

    const tx = await attendance
      .connect(mainInstructor)
      .createSession(title, startTime, endTime);
    const receipt = await tx.wait();
    const sessionId = receipt.events[0].args.sessionId.toNumber(); // Convert BigNumber to a regular number

    await attendance.connect(mainInstructor).addInstructor(instructor2.address);
    await attendance.connect(instructor2).openSession(sessionId);
    const sessionDetails = await attendance.getSessionDetails(sessionId);
    expect(sessionDetails[3]).to.equal(true);

    await attendance.connect(instructor2).closeSession(sessionId);
    const sessionDetailsAfterClose = await attendance.getSessionDetails(sessionId);
    expect(sessionDetailsAfterClose[3]).to.equal(false);
  });

  it("Should allow a student to view their attendance history", async function () {
    const title1 = "Math 101";
    const startTime1 = Math.floor(Date.now() / 1000);
    const endTime1 = startTime1 + 3600;

    const title2 = "Math 102";
    const startTime2 = Math.floor(Date.now() / 1000) + 3600;
    const endTime2 = startTime2 + 3600;

    const tx1 = await attendance
      .connect(mainInstructor)
      .createSession(title1, startTime1, endTime1);
    const receipt1 = await tx1.wait();
    const sessionId1 = receipt1.events[0].args.sessionId.toNumber(); // Convert BigNumber to a regular number

    const tx2 = await attendance
      .connect(mainInstructor)
      .createSession(title2, startTime2, endTime2);
    const receipt2 = await tx2.wait();
    const sessionId2 = receipt2.events[0].args.sessionId.toNumber(); // Convert BigNumber to a regular number

    await attendance.connect(mainInstructor).openSession(sessionId1);
    await attendance.connect(addr1).markAttendance(sessionId1);
    await attendance.connect(mainInstructor).closeSession(sessionId1);

    await attendance.connect(mainInstructor).openSession(sessionId2);
    await attendance.connect(addr1).markAttendance(sessionId2);
    await attendance.connect(mainInstructor).closeSession(sessionId2);

    const history = await attendance.getStudentAttendanceHistory(addr1.address);
    expect(history.length).to.equal(2);
    expect(history[0].toNumber()).to.equal(sessionId1); // Convert BigNumber to a regular number
    expect(history[1].toNumber()).to.equal(sessionId2); // Convert BigNumber to a regular number
  });
});
