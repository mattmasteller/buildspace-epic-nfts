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

const OPENSEA_LINK = ''
const TOTAL_MINT_COUNT = 50

const HomePage = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const [currentAccount, setCurrentAccount] = useState('')

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window

    // Check if MetaMask is installed
    if (!ethereum) {
      console.log('Make sure you have metamask!')
      return
    } else {
      console.log('We have the ethereum object', ethereum)
    }

    // Check if we're authorized to access user's wallet
    const accounts = await ethereum.request({ method: 'eth_accounts' })

    // User can have multiple authorized accounts. Grab the first one, if
    // it is there.
    if (accounts.length !== 0) {
      const account = accounts[0]
      console.log('Found an authorized account:', account)
      setCurrentAccount(account)
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

      // Request access to account
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      // Set authorized account (first one)
      console.log('Connected to account', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {}
  }

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  const ConnectToWalletButton = () => (
    <Button
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

  const MintNftButton = () => (
    <Button
      colorScheme={'green'}
      bg={'green.400'}
      rounded={'full'}
      px={6}
      _hover={{
        bg: 'green.500',
      }}
      onClick={null}
    >
      Mint NFT
    </Button>
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
              <MintNftButton />
            )}
          </Stack>
        </Stack>
        {/* Footer */}
        <Footer />
      </Flex>
    </Container>
  )
}

export default HomePage
