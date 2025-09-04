import { useState } from 'react';

import { Image, TextInput, TouchableOpacity, View } from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';

import { images } from '@/constants';

export const SearchBar = () => {
  const params = useLocalSearchParams<{ query: string }>();
  const [query, setQuery] = useState(params.query || '');

  const handleSearch = (text: string) => {
    setQuery(text);

    if (!text) router.setParams({ query: undefined });
  };

  const handleSubmit = () => {
    if (query?.trim()) router.setParams({ query });
  };

  return (
    <View className="searchbar" testID="search-container">
      <TextInput
        testID="search-input"
        className="flex-1 p-5"
        placeholder="Search for pizzas, burgers..."
        value={query}
        onChangeText={handleSearch}
        onSubmitEditing={handleSubmit}
        placeholderTextColor={'#a0a0a0'}
        returnKeyType="search"
      />

      <TouchableOpacity
        className="pr-5"
        onPress={() => router.setParams({ query })}
        testID="search-button"
      >
        <Image
          source={images.search}
          className="size-6"
          resizeMode="contain"
          tintColor={'#5d5f6d'}
        />
      </TouchableOpacity>
    </View>
  );
};
