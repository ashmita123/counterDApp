const hre = require("hardhat");

async function main() {
  const Attendance = await hre.ethers.getContractFactory("Attendance");
  const attendance = await Attendance.deploy();

  await attendance.deployed();

  console.log("Attendance contract deployed to:", attendance.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });