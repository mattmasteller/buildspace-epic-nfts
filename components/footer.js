import { Text, Flex, Image, Center } from '@chakra-ui/react'

// Constants
const TWITTER_HANDLE_BUILDSPACE = '_buildspace'
const TWITTER_LINK_BUILDSPACE = `https://twitter.com/${TWITTER_HANDLE_BUILDSPACE}`
const TWITTER_HANDLE_MATT = 'mattmasteller'
const TWITTER_LINK_MATT = `https://twitter.com/${TWITTER_HANDLE_MATT}`

const Footer = () => (
  <Center flex={1} pb={4} alignContent="center" alignItems="flex-end">
    <Flex alignItems={'center'}>
      <Image h={10} src="/images/twitter-logo.svg" alt="Twitter" />
      <Text as="span" pl={2}>
        Built by{' '}
        <a href={TWITTER_LINK_MATT} target="_blank" rel="noreferrer">
          {`@${TWITTER_HANDLE_MATT}`}
        </a>{' '}
        on{' '}
        <a href={TWITTER_LINK_BUILDSPACE} target="_blank" rel="noreferrer">
          {`@${TWITTER_HANDLE_BUILDSPACE}`}
        </a>
      </Text>
    </Flex>
  </Center>
)

export default Footer
