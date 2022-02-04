import { useEffect, useState } from 'react'

import {
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Flex,
  useColorMode,
  Spacer,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/button'

import Footer from '../components/footer'
import { ethers } from 'ethers'

import abi from '../utils/MyEpicNFT.json'

const OPENSEA_BASE_URL = 'https://testnets.opensea.io/assets/'
const RARIBLE_BASE_URL = 'https://rinkeby.rarible.com/token/'
const TOTAL_MINT_COUNT = 50

const providerUrl = process.env.NEXT_PUBLIC_NETWORK_URL
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
const contractABI = abi.abi

const HomePage = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const [currentAccount, setCurrentAccount] = useState('')
  const [isMining, setIsMining] = useState(false)
  const [nftCount, setNftCount] = useState(undefined)
  const [openSeaUrl, setOpenSeaUrl] = useState(undefined)
  const [raribleUrl, setRaribleUrl] = useState(undefined)

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window

    // Check if MetaMask is installed
    if (!ethereum) {
      console.log('Make sure you have metamask!')
      return
    } else {
      console.log('We have the ethereum object', ethereum)
    }

    // Verify network
    const chainId = await ethereum.request({ method: 'eth_chainId' })
    console.log(`Connected to chain ${chainId}`)
    const rinkebyChainId = '0x4'
    if (chainId !== rinkebyChainId)
      alert('You are not connected to the Rinkeby Test Network!')

    // Check if we're authorized to access user's wallet
    const accounts = await ethereum.request({ method: 'eth_accounts' })

    // User can have multiple authorized accounts. Grab the first one, if
    // it is there.
    if (accounts.length !== 0) {
      const account = accounts[0]
      console.log('Found an authorized account:', account)
      setCurrentAccount(account)

      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      setupEventListener()
    } else {
      console.log('No authorized account found')
    }
  }

  // Connect to user's wallet
  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        alert('Get MetaMask!')
        return
      }

      // Verify network
      const chainId = await ethereum.request({ method: 'eth_chainId' })
      console.log(`Connected to chain ${chainId}`)
      const rinkebyChainId = '0x4'
      if (chainId !== rinkebyChainId)
        alert('You are not connected to the Rinkeby Test Network!')

      // Request access to account
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      // Set authorized account (first one)
      console.log('Connected to account', accounts[0])
      setCurrentAccount(accounts[0])

      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener()
    } catch (error) {}
  }

  const fetchNftCount = async () => {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl)
    const contract = new ethers.Contract(contractAddress, contractABI, provider)
    const nftCount = await contract.getTotalNFTsMintedSoFar()
    console.log('nftCount', nftCount.toNumber())
    setNftCount(nftCount)
  }

  // Setup listener
  const setupEventListener = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        // Capture event when contract throws it
        contract.on('NewEpicNFTMinted', (from, tokenId) => {
          console.log(from, tokenId.toNumber())

          setOpenSeaUrl(
            `${OPENSEA_BASE_URL}${contractAddress}/${tokenId.toNumber()}`
          )
          setRaribleUrl(
            `${RARIBLE_BASE_URL}${contractAddress}:${tokenId.toNumber()}`
          )
        })

        console.log('Setup event listener')
      } else {
        console.log('Ethereum object does not exist')
      }
    } catch (error) {}
  }

  // Mint NFT
  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        // Set UI elements
        setIsMining(true)
        setOpenSeaUrl(undefined)
        setRaribleUrl(undefined)

        try {
          // Execute mint operation on contract
          console.log('Going to pop wallet now to pay gas')
          const txn = await contract.makeAnEpicNFT()
          await txn.wait()
          console.log(
            `Mined, see transaction: https://rinkeby.etherscan.io/tx/${txn.hash}`
          )
          fetchNftCount()
        } catch (error) {
          console.log('minting error', error)
        }
      } else {
        console.log('Ethereum object does not exist!')
      }

      setIsMining(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected()
    fetchNftCount()
  }, [])

  const ConnectToWalletButton = () => (
    <Button
      size="lg"
      colorScheme={'green'}
      bg={'green.400'}
      rounded={'full'}
      px={6}
      _hover={{
        bg: 'green.500',
      }}
      onClick={connectWallet}
    >
      Connect to Wallet
    </Button>
  )

  const MintNftButton = ({ isMining }) => (
    <Button
      isDisabled={nftCount >= TOTAL_MINT_COUNT}
      isLoading={isMining}
      loadingText="Mining"
      size="lg"
      colorScheme={'green'}
      bg={'green.400'}
      rounded={'full'}
      px={6}
      _hover={{
        bg: 'green.500',
      }}
      onClick={askContractToMintNft}
    >
      Mint New NFT
    </Button>
  )

  const ViewNftButton = ({ marketplace, url }) => (
    <a href={url} target="_blank">
      <Button
        size="lg"
        colorScheme={'green'}
        bg={'green.400'}
        rounded={'full'}
        px={6}
        _hover={{
          bg: 'green.500',
        }}
      >
        View on {marketplace}
      </Button>
    </a>
  )

  const ViewCollectionButton = () => (
    <a
      href="https://rinkeby.rarible.com/collection/0x80b718A38CA4Bfc0eCa023A65d0599D9c9d5E73C/items"
      target="_blank"
    >
      <Button
        size="lg"
        colorScheme={'green'}
        bg={'green.400'}
        rounded={'full'}
        px={6}
        _hover={{
          bg: 'green.500',
        }}
      >
        View Collection
      </Button>
    </a>
  )

  return (
    <Container h="100vh" maxW={'3xl'}>
      <Flex h="100%" direction="column">
        {/* Dark mode toggle */}
        <Flex>
          <Spacer />
          <IconButton mt={4} aria-label="Toggle Mode" onClick={toggleColorMode}>
            {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          </IconButton>
        </Flex>
        {/* Header */}
        <Stack
          py={{ base: 10, md: 18 }}
          spacing={{ base: 4, md: 7 }}
          textAlign={'center'}
        >
          {/* Text */}
          <Heading
            fontWeight={800}
            fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
            lineHeight={'110%'}
          >
            My&nbsp;
            <Text as={'span'} color={'green.400'}>
              NFT
            </Text>
            &nbsp;Collection
          </Heading>
          <Text px={8} fontSize={{ sm: 'xl', md: '2xl' }} color={'gray.500'}>
            Each unique. Each beautiful. Discover your NFT today.
          </Text>
          {/* Buttons */}
          <Stack
            pt={6}
            direction={'row'}
            spacing={3}
            align={'center'}
            alignSelf={'center'}
            position={'relative'}
          >
            {currentAccount === '' ? (
              <ConnectToWalletButton />
            ) : (
              <MintNftButton isMining={isMining} />
            )}
            <ViewCollectionButton />
          </Stack>
          {nftCount < TOTAL_MINT_COUNT && (
            <Text
              pt={6}
              px={8}
              fontSize={{ sm: 'xl', md: '2xl' }}
              color={'gray.500'}
            >{`${nftCount} of ${TOTAL_MINT_COUNT} minted.`}</Text>
          )}
          {nftCount >= TOTAL_MINT_COUNT && (
            <Heading pt={12}>Sorry! The NFT's are all minted. ☹️</Heading>
          )}
          {(openSeaUrl || raribleUrl) && (
            <>
              <Heading
                pt={24}
                fontSize={{ base: '2xl', sm: '3xl', md: '5xl' }}
                lineHeight={'110%'}
              >
                <Text as={'span'} color={'green.400'}>
                  Congrats!!
                </Text>{' '}
                <br />
                Go check out your new NFT.
              </Heading>
              <Stack
                pt={6}
                direction={'row'}
                spacing={3}
                align={'center'}
                alignSelf={'center'}
                position={'relative'}
              >
                {openSeaUrl && (
                  <ViewNftButton marketplace="OpenSea" url={openSeaUrl} />
                )}
                {raribleUrl && (
                  <ViewNftButton marketplace="Rarible" url={raribleUrl} />
                )}
              </Stack>
              <Text color={'gray'}>
                Note: it can take several minutes for your NFT to show up in the
                marketplaces.
              </Text>
            </>
          )}
        </Stack>
        {/* Footer */}
        <Footer />
      </Flex>
    </Container>
  )
}

export default HomePage
