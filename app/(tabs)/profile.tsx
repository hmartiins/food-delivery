import { useState } from 'react';

import { Text, TouchableOpacity, View } from 'react-native';

import { BottomSheet } from '@/components';

export default function Profile() {
  const [bottomSheetVisible, setBottomSheetVisible] = useState(true);

  function handleCloseBottomSheet() {
    setBottomSheetVisible(prev => !prev);
  }

  return (
    <View className="h-full bg-white">
      <TouchableOpacity
        className="mt-20"
        onPress={() => setBottomSheetVisible(true)}
      >
        <Text>Open Bottom Sheet</Text>
      </TouchableOpacity>

      {bottomSheetVisible && <BottomSheet onClose={handleCloseBottomSheet} />}
    </View>
  );
}
