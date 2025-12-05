import React, { useEffect } from 'react';
// Ensure Firebase default app is registered on the JS side before any auth calls
import '@react-native-firebase/app';
import { StatusBar, LogBox } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';
import { probeAndFixBase } from './src/services/api';
// import { auth as firebaseAuth } from './src/firebase';

function App(): React.JSX.Element {
  // Ignore known noisy dev warnings (non-blocking)
  LogBox.ignoreLogs([
    /InteractionManager has been deprecated/i,
  ]);
  // On app start, quickly probe and set the best API base to avoid long timeouts on first requests
  useEffect(() => {
    (async () => {
      try { await probeAndFixBase(); } catch {}
    })();
  }, []);

  // Note: Avoid subscribing to Firebase auth here to prevent early initialization race.
  return (
    <ErrorBoundary>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0A" />
      <AppNavigator />
    </ErrorBoundary>
  );
}

export default App;