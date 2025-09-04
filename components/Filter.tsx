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
      testID="filter-list"
      data={filterData}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-x-2 pb-3"
      accessible={true}
      accessibilityRole="tablist"
      accessibilityLabel="Category filters"
      accessibilityHint="Swipe horizontally to browse different category filters"
      renderItem={({ item }) => {
        const isActive = active === item.$id;

        return (
          <TouchableOpacity
            key={item.$id}
            testID={`filter-item-${item.$id}`}
            onPress={() => handlePress(item.$id)}
            className={cn('filter', isActive ? 'bg-amber-500' : 'bg-white')}
            style={
              Platform.OS === 'android'
                ? { elevation: 5, shadowColor: '#878787' }
                : {}
            }
            accessible={true}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${item.name} filter`}
            accessibilityHint={
              isActive
                ? `${item.name} filter is currently active`
                : `Tap to filter by ${item.name}`
            }
          >
            <Text
              testID={`filter-text-${item.$id}`}
              className={cn(
                'body-medium',
                isActive ? 'text-white' : 'text-gray-200'
              )}
              accessible={false}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      }}
      keyExtractor={item => item.$id}
    />
  );
};
