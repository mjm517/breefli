import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";

export const RecorderScreen: React.FC = () => {
  const [panelHeight] = useState<Animated.Value>(new Animated.Value(100));
  const [isRecording, setIsRecording] = useState(false);
  const [recordingObject, setRecordingObject] =
    useState<Audio.Recording | null>(null);

  const handleSwipeUp = (): void => {
    Animated.spring(panelHeight, {
      toValue: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSwipeDown = (): void => {
    Animated.spring(panelHeight, {
      toValue: 100,
      useNativeDriver: false,
    }).start();
  };

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

      if (uri) {
        console.log("Recording stopped and stored at", uri);

        // Send the URI to your API
        const response = await fetch("https://your-api-url.com/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ audioUri: uri }),
        });

        if (response.ok) {
          const jsonResponse = await response.json();
          console.log("Upload successful:", jsonResponse);
        } else {
          console.error("Upload failed:", response.status, response.statusText);
        }
      }
    } catch (error) {
      console.error("Failed to stop recording", error);
    }
  };

  useEffect(() => {
    return () => {
      if (recordingObject) {
        recordingObject.stopAndUnloadAsync().catch((error) => {
          console.warn("Error unloading recording:", error);
        });
      }
    };
  }, [recordingObject]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.mainButton}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <FontAwesome
          name={isRecording ? "stop-circle" : "microphone"}
          size={64}
          color={isRecording ? "red" : "white"}
        />
        <Text style={styles.buttonText}>
          {isRecording ? "Stop" : "Tap to Shazam"}
        </Text>
      </TouchableOpacity>

      <Animated.View style={[styles.swipePanel, { height: panelHeight }]}>
        <View style={styles.swipeHandle} />
        <TouchableOpacity onPress={handleSwipeUp}>
          <Text style={styles.swipePanelText}>
            {isRecording ? "Recording..." : "Swipe up for history"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSwipeDown}
          style={styles.closeButton}
        >
          <Text>Close</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  mainButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#1DB954",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  swipePanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  swipeHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    marginBottom: 10,
  },
  swipePanelText: {
    fontSize: 16,
    color: "#333",
  },
  closeButton: {
    marginTop: 20,
  },
});

export default RecorderScreen;
