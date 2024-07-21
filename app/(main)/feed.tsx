import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LinkButton from "@/components/LinkButton";

export default function Feed() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Feed</Text>
        <LinkButton route="index" title="Camera" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E2E8F0", // slate-200 equivalent
  },
  innerContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
});
