const main = async () => {
  // Deploy contract.
  const contractFactory = await hre.ethers.getContractFactory('MyEpicNFT')
  const contract = await contractFactory.deploy()
  await contract.deployed()
  console.log('Contract deployed to:', contract.address)

  // Call the function.
  let txn = await contract.makeAnEpicNFT()
  // Wait for it to be mined. 
  await txn.wait()

  // Mint another NFT for fun. 
  txn = await contract.makeAnEpicNFT()
  // Wait for it to be mined.
  await txn.wait()
}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

runMain()