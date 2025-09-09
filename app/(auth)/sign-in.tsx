import { useState } from 'react';

import { Alert, Text, View } from 'react-native';

import { Link, router } from 'expo-router';

import { CustomButton, CustomInput } from '@/components';
import { signIn } from '@/lib/appwrite';

export default function SignIn() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const submit = async () => {
    const { email, password } = form;

    if (!email || !password) {
      Alert.alert('Error', 'Please enter valid e-mail address and password');
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn({ email, password });
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="mt-5 gap-10 rounded-lg bg-white p-5">
      <CustomInput
        placeholder="Enter your email"
        value={form.email}
        label="Email"
        onChangeText={text => setForm(prev => ({ ...prev, email: text }))}
        keyboardType="email-address"
      />

      <CustomInput
        placeholder="Enter your password"
        value={form.password}
        label="Password"
        onChangeText={text => setForm(prev => ({ ...prev, password: text }))}
        secureTextEntry={true}
      />

      <CustomButton title="Sign In" isLoading={isSubmitting} onPress={submit} />

      <View className="mt-5 flex flex-row justify-center gap-2">
        <Text className="base-regular text-gray-100">
          Don&apos;t have an account?
        </Text>
        <Link href="/sign-up" className="base-bold text-primary">
          Sign Up
        </Link>
      </View>
    </View>
  );
}
