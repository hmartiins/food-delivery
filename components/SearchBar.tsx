import { useState } from 'react';

import { Image, TextInput, TouchableOpacity, View } from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';

import { images } from '@/constants';

export const SearchBar = () => {
  const params = useLocalSearchParams<{ query?: string }>();
  const [query, setQuery] = useState(params.query || '');

  const handleSearch = (text: string) => {
    setQuery(text);
    router.setParams({ query: text });
  };

  return (
    <View className="searchbar">
      <TextInput
        className="flex-1 p-5"
        placeholder="Search for pizzas, burgers..."
        value={query}
        onChangeText={handleSearch}
        placeholderTextColor={'#a0a0a0'}
      />

      <TouchableOpacity className="pr-5" onPress={() => handleSearch(query)}>
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
