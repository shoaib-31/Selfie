import React from "react";
import { Text, View, StyleSheet, Button, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
  useMicrophonePermission,
} from "react-native-vision-camera";
import { runOnJS } from "react-native-reanimated";
import LinkButton from "@/components/LinkButton";
import { CameraSide } from "@/constants/Enums";
import { loadTensorflowModel } from "react-native-fast-tflite";
import { useResizePlugin } from "vision-camera-resize-plugin";
export default function Index() {
  //States

  const [model, setModel] = React.useState<any>(null);
  const [isModelReady, setIsModelReady] = React.useState(false);

  // Fucntions
  const { resize } = useResizePlugin();

  // Permissions

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
    console.log("Permissions granted");
    if (!isModelReady) {
      (async () => {
        const loadedModel = await loadTensorflowModel(
          require("../../assets/face_detection_front.tflite")
        );
        console.log("Model Loaded");
        setModel(loadedModel);
        setIsModelReady(true);
      })();
    }
  }, [cameraPermission, microphonePermission]);

  const handleRequestPermission = async () => {
    const cameraGranted = await requestCameraPermission();
    const microphoneGranted = await requestMicrophonePermission();
    if (!cameraGranted || !microphoneGranted) {
      Linking.openSettings();
    }
  };

  // Frame Processor

  const frameProcessor = useFrameProcessor(
    (frame: any) => {
      "worklet";

      if (!isModelReady || !model) return;

      const resized = resize(frame, {
        scale: {
          width: 192,
          height: 192,
        },
        pixelFormat: "rgb",
        dataType: "uint8",
      });

      try {
        const outputs = model.runSync([resized]);
        const detection_boxes = outputs[0];
        const detection_classes = outputs[1];
        const detection_scores = outputs[2];
        const num_detections = outputs[3];
        // console.log(outputs);

        console.log(`Detected ${num_detections[0]} objects!`);

        for (let i = 0; i < detection_boxes.length; i += 4) {
          const confidence = detection_scores[i / 4];
          if (confidence > 0.7) {
            const left = detection_boxes[i];
            const top = detection_boxes[i + 1];
            const right = detection_boxes[i + 2];
            const bottom = detection_boxes[i + 3];
            console.log(
              `Object detected at ${left}, ${top}, ${right}, ${bottom}`
            );
          }
        }
      } catch (error: any) {}
    },
    [model]
  );

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

  // Camera

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.view}>
        <Text style={styles.title}>Camera</Text>
        <Camera
          style={styles.camera}
          frameProcessor={frameProcessor}
          device={device}
          isActive={true}
        />
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
