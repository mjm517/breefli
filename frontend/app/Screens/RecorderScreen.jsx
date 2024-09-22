import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { FontAwesome } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";

export const RecorderScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingObject, setRecordingObject] = useState(null);
  const [sound, setSound] = useState();
  const [recordings, setRecordings] = useState([]);

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
        const fileName = `recording-${Date.now()}.m4a`;
        const directory = FileSystem.documentDirectory + "recordings/";
        const destinationUri = directory + fileName;

        console.log("Source URI:", uri);
        console.log("Destination URI:", destinationUri);

        // Check if the directory exists, create it if it doesn't
        const dirInfo = await FileSystem.getInfoAsync(directory);
        if (!dirInfo.exists) {
          console.log("Creating directory");
          await FileSystem.makeDirectoryAsync(directory, {
            intermediates: true,
          });
        }

        await FileSystem.moveAsync({
          from: uri,
          to: destinationUri,
        });

        console.log("Recording saved locally at:", destinationUri);

        // Add the new recording to the state
        setRecordings((prevRecordings) => [
          ...prevRecordings,
          { uri: destinationUri, name: fileName },
        ]);
      } else {
        console.log("No URI available from recording object");
      }
    } catch (error) {
      console.error("Failed to stop recording or save file", error);
      if (error.message) {
        console.error("Error message:", error.message);
      }
      if (error.cause) {
        console.error("Error cause:", error.cause);
      }
    }
  };

  const playRecording = async (uri) => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error("Failed to play recording", error);
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

  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
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
      </View>
      <TouchableOpacity
        style={styles.fullWidthButton}
        onPress={() => navigation.navigate("Library")}
      >
        <Text style={styles.fullWidthButtonText}>Go to Library</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between", // This will push content to top and bottom
    backgroundColor: "#f0f0f0",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  recordingsList: {
    width: "100%",
    marginTop: 20,
  },
  recordingItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  fullWidthButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    elevation: 5,
  },
  fullWidthButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default RecorderScreen;
