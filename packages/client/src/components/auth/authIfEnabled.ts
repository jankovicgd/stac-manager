import { useAuth0 } from '@auth0/auth0-react';

export type EnabledAuth0Context =
  | {
      isEnabled: false;
      isAuthenticated: false;
      user: undefined;
      isLoading: false;
    }
  | (ReturnType<typeof useAuth0> & {
      isEnabled: true;
    });

export function useAuth0IfEnabled(): EnabledAuth0Context {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

  if (domain && clientId) {
    return { ...useAuth0(), isEnabled: true };
  }

  return {
    isEnabled: false,
    isAuthenticated: false,
    user: undefined,
    isLoading: false
  };
}
