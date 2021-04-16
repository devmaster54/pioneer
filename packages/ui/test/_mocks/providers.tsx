import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client'
import React, { ReactNode } from 'react'

import { KeyringContext } from '../../src/common/providers/keyring/context'
import { MembershipContextProvider } from '../../src/memberships/providers/membership/provider'

import { mockKeyring } from './keyring'

const link = new HttpLink({
  uri: 'http://localhost:8081/graphql',
  fetch: (uri, options) => fetch(uri, options),
})

interface Props {
  children: ReactNode
}

export const MockApolloProvider = ({ children }: Props) => {
  return <ApolloProvider client={new ApolloClient({ link, cache: new InMemoryCache() })}>{children}</ApolloProvider>
}

export const MockQueryNodeProviders = ({ children }: Props) => {
  return (
    <MockApolloProvider>
      <MembershipContextProvider>{children}</MembershipContextProvider>
    </MockApolloProvider>
  )
}

export const MockKeyringProvider = ({ children }: Props) => {
  const keyring = mockKeyring()

  return <KeyringContext.Provider value={keyring}>{children}</KeyringContext.Provider>
}