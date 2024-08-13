import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import { CheckBox } from "@rneui/themed";
import { Picker } from "@react-native-picker/picker";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { Color, FontSize, StyleVariable } from "../GlobalStyles";
import { useAppData } from "@/components/AppDataProvider";
import { Product, ProductInfos } from "@/constants/Classes";
import { useAppContext } from "@/components/AppContext";
import { useRouter } from "expo-router";
import tw from "tailwind-react-native-classnames";

const Filter = () => {
  const { ProductsInfos,data } = useAppData();
  const [filters, setFilters] = useState({
    price: { enabled: false, range: [Math.min(...ProductsInfos.map((p: Product) => p.product.price)), Math.max(...ProductsInfos.map((p: Product) => p.product.price))] },
    category: { enabled: false, value: "" },
    size: { enabled: false, range: [0, 100] },
  });
  const navigation = useRouter();
  const { state, dispatch } = useAppContext();
  const handleFilterChange = useCallback((filterType, key, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: { ...prev[filterType], [key]: value }
    }));
  }, []);

  const handleRangeChange = useCallback((filterType, values) => {
    handleFilterChange(filterType, 'range', values);
  }, [handleFilterChange]);

  const submitFiltering = useCallback(() => {
    const filteredProducts = ProductsInfos.filter((productinf: ProductInfos) => {
      const { price, category, size } = filters;
      return (
        (!price.enabled || (productinf.product.price >= price.range[0] && productinf.product.price <= price.range[1])) &&
        (!category.enabled || productinf.product.category.toLowerCase().includes(category.value.toLowerCase()))
      );
    });

    dispatch({ type: 'SET_filtredproducts', payload: filteredProducts });
    dispatch({type: 'Set_previouspage',payload: "Filter"})
    navigation.navigate(`/FilterResult?filter=applied`);
    filteredProducts?.map((item)=>console.log(item.product.price))
  }, [filters, data, dispatch, navigation]);

  const renderFilterSection = (title, filterType, children) => (
    <View style={styles.filterSection}>
      <View style={styles.filterHeader}>
        <CheckBox
          checked={filters[filterType].enabled}
          onPress={() => handleFilterChange(filterType, 'enabled', !filters[filterType].enabled)}
          containerStyle={styles.checkBox}
        />
        <Text style={styles.filterTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );

  return (
    <View style={styles.filter}>
      {renderFilterSection("Price", "price", (
        <>
          <MultiSlider
            values={filters.price.range}
            onValuesChange={(values) => handleRangeChange("price", values)}
            min={75}
            max={5000}
            step={1}
            selectedStyle={{ backgroundColor: Color.colorsBlue }}
            markerStyle={styles.sliderMarker}
            containerStyle={styles.sliderContainer}
          />
          <View style={styles.inputRow}>
            {filters.price.range.map((value, index) => (
              <TextInput
                key={index}
                style={styles.input}
                value={value.toString()}
                keyboardType="numeric"
                onChangeText={(text) => {
                  const newRange = [...filters.price.range];
                  newRange[index] = Number(text);
                  handleRangeChange("price", newRange);
                }}
              />
            ))}
          </View>
        </>
      ))}

      {renderFilterSection("Category", "category", (
        <Picker
          selectedValue={filters.category.value}
          style={styles.picker}
          onValueChange={(itemValue) => handleFilterChange("category", "value", itemValue)}
        >
          <Picker.Item label="LED Ceiling Panel" value="LED Ceiling Panel" />
          <Picker.Item label="LED Strip Lighting " value="LED Strip Lighting " />
          <Picker.Item label="Led Profiles" value="LED Ceiling Panel" />
          <Picker.Item label="Suspended Ceiling & Metal Grid" value="Suspended Ceiling & Metal Grid" />
        </Picker>
      ))}
      <Pressable style={styles.button} onPress={submitFiltering}>
        <Text style={styles.buttonText}>Done</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  filter: {
    flex: 1,
    padding: 20,
    backgroundColor: Color.backgroundDefaultDefault,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterTitle: {
    fontSize: FontSize.presetsBody2_size,
    color: Color.colorBlack,
    marginRight: 10,
  },
  checkBox: {
    padding: 0,
    backgroundColor: 'transparent',
  },
  sliderContainer: {
    left: 30,
    alignSelf: 'stretch',
  },
  sliderMarker: {
    height: 25,
    backgroundColor: 'orangered',
    width: 25,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  input: {
    width: '45%',
    borderWidth: 1,
    borderColor: Color.colorsBlue,
    borderRadius: StyleVariable.radius200,
    padding: 5,
    fontSize: FontSize.presetsBody2_size,
  },
  picker: {
    borderWidth: 1,
    borderColor: Color.colorLimegreen_100,
    borderRadius: StyleVariable.radius200,
  },
  button: {
    backgroundColor: Color.colorsBlue,
    padding: StyleVariable.space300,
    borderRadius: StyleVariable.radius200,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: Color.textBrandOnBrand,
    fontSize: FontSize.presetsBody2_size,
  },
});

export default Filter;