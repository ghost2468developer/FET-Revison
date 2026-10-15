import { ApolloClient, InMemoryCache, createHttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";

export const TOKEN_KEY = "fet_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string | null) {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}

const httpLink = createHttpLink({ uri: "/graphql" });

const authLink = setContext((_, { headers }) => {
  const token = getToken();
  return {
    headers: { ...headers, authorization: token ? `Bearer ${token}` : "" },
  };
});

// If the server says we're unauthenticated (bad/expired token), bounce to login.
const authGuard = onError(({ graphQLErrors }) => {
  if (graphQLErrors?.some((e) => e.extensions?.code === "UNAUTHENTICATED")) {
    setToken(null);
    window.location.replace("/login");
  }
});

export const apolloClient = new ApolloClient({
  link: from([authGuard, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: { watchQuery: { errorPolicy: "all" } },
});
