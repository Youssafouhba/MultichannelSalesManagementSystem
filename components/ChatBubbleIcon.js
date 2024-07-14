import * as React from "react";
import { StyleProp, ViewStyle, StyleSheet, View } from "react-native";

const ChatBubbleIcon = ({ style }) => {
  return <View style={[styles.chatBubble, style]} />;
};

const styles = StyleSheet.create({
  chatBubble: {
    width: 24,
    height: 24,
  },
});

export default ChatBubbleIcon;
