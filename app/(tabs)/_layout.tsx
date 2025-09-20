import { Redirect } from 'expo-router';

import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

import { useAuthStore } from '@/stores/auth.store';

export default function TabLayout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Redirect href="/sign-in" />;

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={'house.fill'} drawable="ic_menu_home" />
        <Label>Home</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search">
        <Icon sf={'magnifyingglass'} drawable="ic_menu_search" />
        <Label>Search</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="cart">
        <Icon sf={'bag.fill'} drawable="ic_menu_cart" />
        <Label>Cart</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Icon sf={'person.fill'} drawable="ic_menu_profile" />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
