import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// The Graph Studio endpoint for your subgraph
// Replace with your actual deployed subgraph URL after deployment
const SUBGRAPH_URL =
  process.env.NEXT_PUBLIC_SUBGRAPH_URL ||
  "https://api.studio.thegraph.com/query/YOUR_SUBGRAPH_ID/spotify-web3/version/latest";

const httpLink = new HttpLink({
  uri: SUBGRAPH_URL,
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          albums: {
            keyArgs: false,
            merge(existing = [], incoming) {
              return [...incoming];
            },
          },
          songs: {
            keyArgs: ["where"],
            merge(existing = [], incoming) {
              return [...incoming];
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
    query: {
      fetchPolicy: "network-only",
    },
  },
});
