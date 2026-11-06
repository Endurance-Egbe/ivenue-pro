import { useState } from 'react';

import { authApi } from '../../../lib/api';
import { SessionResponse } from '../../../lib/api';
import { AuthMode } from '../auth.types';

type PasswordAuthState = {
  mode: AuthMode;
  fullName: string;
  email: string;
  password: string;
  role: 'customer' | 'host';
  error: string;
};

export function usePasswordAuthFlow(onAuthenticated: (session: SessionResponse) => void) {
  const [state, setState] = useState<PasswordAuthState>({ mode: 'signin', fullName: '', email: '', password: '', role: 'customer', error: '' });

  const update = (field: keyof PasswordAuthState, value: string) => setState((current) => ({ ...current, [field]: value, error: '' }));
  const setMode = (mode: AuthMode) => setState((current) => ({ ...current, mode, error: '' }));

  const submit = async () => {
    try {
      if (state.mode === 'signup') {
        const session = await authApi.signupWithPassword(state.fullName, state.email, state.password, 'customer');
        onAuthenticated(session);
      } else {
        const session = await authApi.signinWithPassword(state.email, state.password);
        onAuthenticated(session);
      }
    } catch (error) {
      setState((current) => ({ ...current, error: error instanceof Error ? error.message : 'Unable to sign in right now.' }));
    }
  };

  const socialPress = (provider: 'Google' | 'Facebook' | 'X') => {
    setState((current) => ({ ...current, error: `${provider} sign-in will be available when the secure provider connection is configured.` }));
  };

  return { state, update, setMode, submit, socialPress };
}
