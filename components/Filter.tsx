import { useState } from 'react';

import { FlatList, Platform, Text, TouchableOpacity } from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';

import cn from 'clsx';

import { Category } from '@/type';

export const Filter = ({ categories }: { categories: Category[] }) => {
  const searchParams = useLocalSearchParams();
  const [active, setActive] = useState(searchParams.category || '');

  const handlePress = (id: string) => {
    setActive(id);

    if (id === 'all') {
      router.setParams({ category: undefined });
    } else {
      router.setParams({ category: id });
    }
  };

  const filterData: (Category | { $id: string; name: string })[] = categories
    ? [{ $id: 'all', name: 'All' }, ...categories]
    : [{ $id: 'all', name: 'All' }];

  return (
    <FlatList
      data={filterData}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-x-2 pb-3"
      renderItem={({ item }) => (
        <TouchableOpacity
          key={item.$id}
          onPress={() => handlePress(item.$id)}
          className={cn(
            'filter',
            active === item.$id ? 'bg-amber-500' : 'bg-white'
          )}
          style={
            Platform.OS === 'android'
              ? { elevation: 5, shadowColor: '#878787' }
              : {}
          }
        >
          <Text
            className={cn(
              'body-medium',
              active === item.$id ? 'text-white' : 'text-gray-200'
            )}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
      keyExtractor={item => item.$id}
    />
  );
};
