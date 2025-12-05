// Use the main navigation file under src/navigation so the full app flow (splash, auth, tabs)
// is loaded instead of a minimal placeholder `src/AppNavigator`.
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return <AppNavigator />;
}