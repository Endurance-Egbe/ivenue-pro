import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import { AuthScreen } from './src/features/auth/screens/AuthScreen';
import { BrowseScreen } from './src/features/browse/screens/BrowseScreen';
import { HostScreen } from './src/features/host/screens/HostScreen';
import { ProfileScreen } from './src/features/profile/screens/ProfileScreen';
import { SessionResponse } from './src/lib/api';

export default function App() {
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [screen, setScreen] = useState<'browse' | 'auth' | 'profile'>('browse');

  return (
    <>
      <StatusBar style="light" />
      {session?.user.role === 'host' ? (
        <HostScreen token={session.access_token} />
      ) : screen === 'auth' ? (
        <AuthScreen
          onBack={() => setScreen('browse')}
          onAuthenticated={(nextSession) => { setSession(nextSession); setScreen('profile'); }}
        />
      ) : screen === 'profile' && session ? (
        <ProfileScreen session={session} onBrowse={() => setScreen('browse')} onSignOut={() => { setSession(null); setScreen('browse'); }} />
      ) : (
        <BrowseScreen onSignIn={() => setScreen('auth')} onProfile={() => setScreen(session ? 'profile' : 'auth')} />
      )}
    </>
  );
}
