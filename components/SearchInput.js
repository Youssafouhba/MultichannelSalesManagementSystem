import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Color } from "@/GlobalStyles";
import { headerstyles } from "@/GlobalStyles";

const SearchInput = ({ value, onChangeText }) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchInput}>
        <TextInput
          placeholder="Search..."
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          numberOfLines={1}
        />
        <Ionicons style={styles.icon} name='search' size={25} color="gray" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '100%',
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: Color.colorWhite
  },
  searchInput: {
    ...headerstyles.searchInput,
  },
  input: {
    ...headerstyles.label,
  },
  icon: {
    marginLeft: 12,
    overflow: "hidden",
  },
});

export default SearchInput;