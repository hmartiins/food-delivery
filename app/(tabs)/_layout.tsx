import { Redirect, Slot } from 'expo-router';

export default function _Layout() {
  const isAuthenticated = true;

  if (!isAuthenticated) return <Redirect href="/sign-in" />;

  return <Slot />;
}
