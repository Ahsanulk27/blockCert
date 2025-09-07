import { ethers } from "hardhat";

async function main() {
  // Get the deployer's address
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log(
    "Account balance:",
    ethers.formatEther(await deployer.provider.getBalance(deployer.address))
  );

  // Note: Changed from "CertificateContract" to "CertificateIssuer" to match your contract name
  const Certificate = await ethers.getContractFactory("CertificateIssuer");

  // Pass the deployer's address as the initial owner
  const contract = await Certificate.deploy(deployer.address);
  await contract.waitForDeployment();

  console.log("Certificate contract deployed to:", await contract.getAddress());
  console.log("Contract owner:", await contract.owner());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
