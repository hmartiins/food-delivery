import { useState } from 'react';

import { Alert, Text, View } from 'react-native';

import { Link, router } from 'expo-router';

import { CustomButton, CustomInput } from '@/components';
import { createUser } from '@/lib/appwrite';

export default function SignUp() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const submit = async () => {
    const { name, email, password } = form;

    if (!name || !email || !password) {
      Alert.alert(
        'Error',
        'Please enter valid name, e-mail address and password'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await createUser({ name, email, password });

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
        placeholder="Enter your full name"
        value={form.name}
        label="Full Name"
        onChangeText={text => setForm(prev => ({ ...prev, name: text }))}
      />
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

      <CustomButton title="Sign Up" isLoading={isSubmitting} onPress={submit} />

      <View className="mt-5 flex flex-row justify-center gap-2">
        <Text className="base-regular text-gray-100">
          Already have an account?
        </Text>
        <Link href="/sign-in" className="base-bold text-primary">
          Sign In
        </Link>
      </View>
    </View>
  );
}
