import React from "react";
import { Text, View, StyleSheet, Button, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useMicrophonePermission,
} from "react-native-vision-camera";
import LinkButton from "@/components/LinkButton";
import { CameraSide } from "@/constants/Enums";

export default function Index() {
  const {
    hasPermission: cameraPermission,
    requestPermission: requestCameraPermission,
  } = useCameraPermission();
  const {
    hasPermission: microphonePermission,
    requestPermission: requestMicrophonePermission,
  } = useMicrophonePermission();
  const device = useCameraDevice(CameraSide.Front);

  React.useEffect(() => {
    if (!cameraPermission) {
      requestCameraPermission();
    }
    if (!microphonePermission) {
      requestMicrophonePermission();
    }
  }, [cameraPermission, microphonePermission]);

  const handleRequestPermission = async () => {
    const cameraGranted = await requestCameraPermission();
    const microphoneGranted = await requestMicrophonePermission();
    if (!cameraGranted || !microphoneGranted) {
      Linking.openSettings();
    }
  };

  if (cameraPermission === null || microphonePermission === null) {
    return <Text>Checking permissions...</Text>;
  }

  if (!cameraPermission || !microphonePermission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.view}>
          <Text style={styles.title}>
            Camera and Microphone Permissions Needed
          </Text>
          <Button title="Grant Permissions" onPress={handleRequestPermission} />
        </View>
      </SafeAreaView>
    );
  }

  if (device == null) return <Text>No Camera Device Found</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <Text style={styles.title}>Camera</Text>
        <Camera style={styles.camera} device={device} isActive={true} />
        <LinkButton route="feed" title="Feed" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4fa",
  },
  view: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "black",
  },
  camera: {
    width: "90%",
    aspectRatio: 3 / 4,
    borderRadius: 16,
  },
});
