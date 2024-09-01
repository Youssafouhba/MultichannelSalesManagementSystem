import React, { useState } from 'react';
import { Modal, View, Text, Button, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MultiSelectPicker = ({ options, selectedValues, onValueChange }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleSelection = (itemValue) => {
    const selectedIndex = selectedValues.indexOf(itemValue);
    if (selectedIndex > -1) {
      onValueChange(selectedValues.filter((_, index) => index !== selectedIndex));
    } else {
      onValueChange([...selectedValues, itemValue]);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <View style={{ padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 4 }}>
          <Text>{selectedValues.length > 0 ? selectedValues.join(', ') : 'Select options'}</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ margin: 20, backgroundColor: 'white', borderRadius: 8, padding: 20 }}>
            <ScrollView>
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}
                  onPress={() => toggleSelection(option.value)}
                >
                  <Ionicons
                    name={selectedValues.includes(option.value) ? 'checkbox' : 'square-outline'}
                    size={24}
                    color="black"
                  />
                  <Text style={{ marginLeft: 10 }}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button title="Done" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MultiSelectPicker;
