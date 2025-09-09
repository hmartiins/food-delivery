import { useEffect } from 'react';

import { FlatList, Text, View } from 'react-native';

import { useLocalSearchParams } from 'expo-router';

import { SafeAreaView } from 'react-native-safe-area-context';

import { CartButton, Filter, MenuCard, SearchBar } from '@/components';
import { getCategories, getMenu } from '@/lib/appwrite';
import { useAppwrite } from '@/lib/useAppwrite';
import { Category, MenuItem } from '@/type';

export default function Search() {
  const { category, query } = useLocalSearchParams<{
    query: string;
    category: string;
  }>();

  const { data, refetch, loading } = useAppwrite({
    fn: getMenu,
    params: { category, query, limit: 5 },
  });

  const { data: categories } = useAppwrite({ fn: getCategories });

  useEffect(() => {
    refetch({
      category,
      query,
      limit: 5,
    });
  }, [category, query]);

  return (
    <SafeAreaView className="h-full bg-white " testID="search-safe-area">
      <FlatList
        testID="search-results-list"
        data={data}
        keyExtractor={item => item.$id}
        numColumns={2}
        columnWrapperClassName="gap-7"
        contentContainerClassName="gap-12 px-5 pb-32"
        renderItem={({ item }) => (
          <View className={'max-w-[48%] flex-1'}>
            <MenuCard item={item as MenuItem} />
          </View>
        )}
        ListHeaderComponent={() => (
          <View className="my-5 gap-5" testID="search-header">
            <View className="flex-between flex-row" testID="search-header-top">
              <View className="flex-start">
                <Text
                  className="small-bold uppercase text-primary"
                  testID="search-title"
                >
                  Search
                </Text>
                <View className="flex-start mt-0.5 flex-row gap-x-1">
                  <Text
                    className="paragraph-semibold text-dark-100"
                    testID="search-subtitle"
                  >
                    Find your favorite food
                  </Text>
                </View>
              </View>

              <CartButton />
            </View>

            <SearchBar />

            <Filter categories={categories! as Category[]} />
          </View>
        )}
        ListEmptyComponent={() =>
          !loading && <Text testID="empty-results-text">No results found</Text>
        }
      />
    </SafeAreaView>
  );
}
