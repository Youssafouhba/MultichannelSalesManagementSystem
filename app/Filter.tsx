import React, { useState, useCallback } from "react";
import { StyleSheet, Text, TextInput, View, Pressable } from "react-native";
import { CheckBox } from "@rneui/themed";
import { Picker } from "@react-native-picker/picker";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { Color, FontSize, StyleVariable } from "../GlobalStyles";
import { useAppData } from "@/components/AppDataProvider";
import { Product, ProductInfos } from "@/constants/Classes";
import { useAppContext } from "@/components/AppContext";
import { useRouter } from "expo-router";
import NoInternetConnection from "@/components/NoInternetConnection";
import useInternetCheck from "@/components/useInternetCheck";

const Filter = () => {
  const { ProductsInfos } = useAppData();
  const minPrice = Math.min(...ProductsInfos.map((p: ProductInfos) => p.product.price));
  const maxPrice = Math.max(...ProductsInfos.map((p: ProductInfos) => p.product.price));
  const { isConnected, connectionType } = useInternetCheck();
  const [filters, setFilters] = useState({
    price: { enabled: false, range: [minPrice, maxPrice] },
    category: { enabled: false, value: "" },
  });

  const [priceInputs, setPriceInputs] = useState({ min: minPrice.toString(), max: maxPrice.toString() });

  const navigation = useRouter();
  const { setfiltredproducts,setPreviouspage } = useAppContext();

  const handleFilterChange = useCallback((filterType, key, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: { ...prev[filterType], [key]: value }
    }));
  }, []);

  const handleRangeChange = useCallback((filterType, values) => {
    handleFilterChange(filterType, 'range', values);
    setPriceInputs({ min: values[0].toString(), max: values[1].toString() });
  }, [handleFilterChange]);

  const validateAndSetPriceInputs = useCallback(() => {
    let min = parseFloat(priceInputs.min);
    let max = parseFloat(priceInputs.max);

    // Apply validation
    if (isNaN(min) || min < minPrice) min = minPrice;
    if (isNaN(max) || max > maxPrice) max = maxPrice;
    if (min > max) min = max; // Ensure min is not greater than max

    setPriceInputs({ min: min.toString(), max: max.toString() });
    handleRangeChange('price', [min, max]);
  }, [priceInputs, minPrice, maxPrice, handleRangeChange]);

  const submitFiltering = useCallback(() => {
    validateAndSetPriceInputs();

    const filteredProducts = ProductsInfos.filter((productinf: ProductInfos) => {
      const { price, category } = filters;
      return (
        (!price.enabled || (productinf.product.price >= price.range[0] && productinf.product.price <= price.range[1])) &&
        (!category.enabled || productinf.product.category.toLowerCase().includes(category.value.toLowerCase()))
      );
    });

    setfiltredproducts(filteredProducts);
    setPreviouspage("Filter")
    navigation.navigate(`/FilterResult?filter=applied`);
  }, [filters, setfiltredproducts,setPreviouspage, navigation, ProductsInfos, validateAndSetPriceInputs]);

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
    !isConnected?
    <NoInternetConnection/>
  :
    <View style={styles.filter}>
      {renderFilterSection("Price", "price", (
        <>
          <MultiSlider
            values={filters.price.range}
            onValuesChange={(values) => handleRangeChange("price", values)}
            min={minPrice}
            max={maxPrice}
            step={1}
            selectedStyle={{ backgroundColor: Color.colorsBlue }}
            markerStyle={styles.sliderMarker}
            containerStyle={styles.sliderContainer}
          />
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={priceInputs.min}
              keyboardType="numeric"
              onChangeText={(text) => setPriceInputs(prev => ({ ...prev, min: text }))}
              onBlur={validateAndSetPriceInputs} // Validate when user leaves the input field
            />
            <TextInput
              style={styles.input}
              value={priceInputs.max}
              keyboardType="numeric"
              onChangeText={(text) => setPriceInputs(prev => ({ ...prev, max: text }))}
              onBlur={validateAndSetPriceInputs} // Validate when user leaves the input field
            />
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
          <Picker.Item label="LED Strip Lighting" value="LED Strip Lighting" />
          <Picker.Item label="Led Profiles" value="Led Profiles" />
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