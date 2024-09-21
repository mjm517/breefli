import React from 'react';
import { Text, View } from 'react-native';
import Recorder from '@/components/Recorder'; // Adjust the path if Recorder.tsx is in a different directory

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Recorder />
      {/* <mybreefs /> */}
    </View>
  );
}