import { Fragment } from 'react';

import {
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import cn from 'clsx';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CartButton } from '@/components/CartButton';
import { images, offers } from '@/constants';

export default function Index() {
  return (
    <SafeAreaView testID="index-safe-area" className="flex-1 bg-white">
      <FlatList
        testID="offers-list"
        data={offers}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;
          return (
            <View testID={`offer-item-${item.id}`}>
              <Pressable
                testID={`offer-card-${item.id}`}
                className={cn(
                  'offer-card',
                  isEven ? 'flex-row-reverse' : 'flex-row'
                )}
                style={{
                  backgroundColor: item.color,
                }}
                android_ripple={{
                  color: '#ffffff22',
                }}
              >
                {({ pressed }) => (
                  <Fragment>
                    <View
                      testID={`offer-image-container-${item.id}`}
                      className="h-full w-1/2"
                    >
                      <Image
                        testID={`offer-image-${item.id}`}
                        source={item.image}
                        className="size-full"
                        resizeMode="contain"
                      />
                    </View>

                    <View
                      testID={`offer-info-${item.id}`}
                      className={cn(
                        'offer-card__info',
                        isEven ? 'pl-10' : 'pr-10'
                      )}
                    >
                      <Text
                        testID={`offer-title-${item.id}`}
                        className="h1-bold leading-tight text-white"
                      >
                        {item.title}
                      </Text>
                      <Image
                        source={images.arrowRight}
                        className="size-10"
                        resizeMode="contain"
                        tintColor="#ffffff"
                      />
                    </View>
                  </Fragment>
                )}
              </Pressable>
            </View>
          );
        }}
        contentContainerClassName="pb-28 px-5"
        ListHeaderComponent={() => (
          <View
            testID="header-container"
            className="flex-between my-5 w-full flex-row"
          >
            <View testID="location-section" className="flex-start">
              <Text
                testID="deliver-to-text"
                className="small-bold text-primary"
              >
                DELIVER TO
              </Text>
              <TouchableOpacity
                testID="location-button"
                className="flex-center mt-0.5 flex-row gap-x-1"
              >
                <Text
                  testID="location-text"
                  className="paragraph-bold text-dark-100"
                >
                  Brazil
                </Text>
                <Image
                  testID="location-arrow"
                  source={images.arrowDown}
                  className="size-3"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            <CartButton />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
