import { ApolloClient, createHttpLink } from '@apollo/client/core'
import { InMemoryCache } from '@apollo/client/cache'
import { split } from '@apollo/client/link/core'
import { setContext } from '@apollo/client/link/context'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { createApolloProvider } from '@vue/apollo-option'

const getIdToken = () => {
    return `Bearer ${localStorage.getItem('AUTH_TOKEN')}` || null;
}

// HTTP connection to the API
const httpLink = createHttpLink({
    uri: `${process.env.VUE_APP_GRAPHQL_ENDPOINT}/v1/graphql`,
})

const wsLink = new WebSocketLink({
    uri: `${process.env.VUE_APP_GRAPHQL_SOCKET_ENDPOINT}/v1/graphql`,
    options: {
        reconnect: false,
        connectionParams: () => {
            return {
                headers: {
                    Authorization: getIdToken(),
                }
            }
        }
    }
});

const authMiddleware = setContext((_, { headers }) => {
    const token = localStorage.getItem("AUTH_TOKEN")
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
        );
    },
    wsLink,
    httpLink
);

const cache = new InMemoryCache()

// Create the apollo client
export const apolloClient = new ApolloClient({
    link: authMiddleware.concat(splitLink),
    cache,
})

// Create apollo provider
export const apolloProvider = createApolloProvider({
    defaultClient: apolloClient,
})