import CartButton from '@/components/CartButton';
import { getCategories, getMenu } from '@/lib/appwrite';
import { useAppwrite } from '@/lib/useAppwrite';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView className="h-full bg-white ">
      <FlatList
        data={data}
        keyExtractor={item => item.$id}
        numColumns={2}
        columnWrapperClassName="gap-7"
        contentContainerClassName="gap-7 px-5 pb-32"
        renderItem={({ item, index }) => {
          return (
            <View className="max-w-[48%] flex-1">
              <Text>{item.name}</Text>
            </View>
          );
        }}
        ListHeaderComponent={() => (
          <View className="my-5 gap-5">
            <View className="flex-between flex-row">
              <View className="flex-start">
                <Text className="small-bold uppercase text-primary">
                  Search
                </Text>
                <View className="flex-start mt-0.5 flex-row gap-x-1">
                  <Text className="paragraph-semibold text-dark-100">
                    Find your favorite food
                  </Text>
                </View>
              </View>

              <CartButton />
            </View>

            <Text>Search Input</Text>

            <Text>Filter</Text>
          </View>
        )}
        ListEmptyComponent={() => !loading && <Text>No results found</Text>}
      />
    </SafeAreaView>
  );
}
