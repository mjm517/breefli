import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";

export const Recorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingObject, setRecordingObject] =
    useState<Audio.Recording | null>(null);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await recording.startAsync();

      setRecordingObject(recording);
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording", error);
    }
  };

  const stopRecording = async () => {
    try {
      await recordingObject?.stopAndUnloadAsync();
      const uri = recordingObject?.getURI();
      setIsRecording(false);

      // Here you would typically send the audio file (uri) to your backend for processing
      console.log("Recording stopped and stored at", uri);
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  };

  useEffect(() => {
    return () => {
      if (recordingObject) {
        recordingObject.stopAndUnloadAsync();
      }
    };
  }, [recordingObject]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.microphoneButton}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <FontAwesome
          name={isRecording ? "stop-circle" : "microphone"}
          size={64}
          color={isRecording ? "red" : "black"}
        />
      </TouchableOpacity>
      <View style={styles.panel}>
        <Text style={styles.panelText}>
          {isRecording ? "Recording..." : "Tap the microphone to start"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  microphoneButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  panel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  panelText: {
    fontSize: 18,
    color: "#333",
  },
});

export default Recorder;
