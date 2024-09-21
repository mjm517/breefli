import React from 'react';
import { Text, View } from 'react-native';
import Recorder from 'C:/Users/jonat/GitHub/breefli/frontend/components/Recorder.tsx'; // Adjust the path if Recorder.tsx is in a different directory

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Recorder />
    </View>
  );
}