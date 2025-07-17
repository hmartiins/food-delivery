import { router } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function SignUp() {
  return (
    <View>
      <Text>Sign Up</Text>
      <Button title="Sign In" onPress={() => router.push('/sign-in')} />
    </View>
  );
}
