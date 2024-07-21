//@ts-nocheck
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

const LinkButton = ({ route, title }: { route: string; title: string }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate(route)}
      activeOpacity={0.7}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "black",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
  },
});

export default LinkButton;
