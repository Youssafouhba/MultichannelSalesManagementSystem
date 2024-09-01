import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProductInfos } from '@/constants/Classes';
import tw from 'tailwind-react-native-classnames';
interface SearchBarProps {
  data: ProductInfos[];
  onItemSelect: (item: ProductInfos[]) => void;
}

const DynamicSearchBar: React.FC<SearchBarProps> = ({ data, onItemSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(data);
  const [searchBy, setSearchBy] = useState<'title' | 'price' | 'category'>('title');

  useEffect(() => {
    if (query === '') {
      setResults(data);
      onItemSelect(data)
    } else {
      let filteredResults =  data.filter(
        (product: ProductInfos) =>
          product.product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.product.price.toString().includes(query)
      );
      onItemSelect(filteredResults)
      setResults(filteredResults);
    }
  }, [query, data, searchBy]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <View style={[tw`h-16 w-full items-center overflow-hidden bg-white`]}>
        <View style={tw`flex-row w-80 items-center px-4 py-2 bg-gray-100 rounded-full`}>
        <TextInput
            style={styles.input}
            placeholder={`Search ...`}
            value={query}
            onChangeText={setQuery}
            />
            {query.length > 0? (
                <TouchableOpacity onPress={handleClear}>
                    <Ionicons name="close-circle" size={20} color="#888" />
                </TouchableOpacity>
            ):(
                <Ionicons name="search" size={25} color="gray" style={tw`ml-3`} />
            )}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  activeFilter: {
    backgroundColor: '#a0a0a0',
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
  },
});

export default DynamicSearchBar;