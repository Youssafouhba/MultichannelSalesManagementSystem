import React, { useState } from 'react';
import { ScrollView, Text,ImageBackground, View, Image, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { grayscale } from '@cloudinary/url-gen/actions/effect';
import RNPickerSelect from 'react-native-picker-select';


import {CLOUDINARY_URL,UPLOAD_PRESET } from '../constants/GlobalsVeriables';
import { Product } from "@/constants/Classes";
import { useAppContext } from './AppContext';


const AddProductScreen = () => {
  const { state, dispatch } = useAppContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [size, setSize] = useState('');
  const [category,setCategory] = useState('');
  const [images, setImages] = useState<string[]>([]);
  var cartItems = state.cartItems || {};
  var isLoggedIn = state.JWT_TOKEN !=='';
  var token = state.JWT_TOKEN;

  const categories = [
    { label: 'Ceiling Light Fixtures', value: 'Ceiling Light Fixtures' },
    { label: 'Lighting Fixtures', value: 'Lighting Fixtures' },
    { label: 'Light Ropes & Strings', value: 'Light Ropes & Strings' },
  ];
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const uploadImagesToCloudinary = async () => {
    if (images.length === 0) {
      throw new Error('Please select at least one image.');
    }

    try {
      const uploadedUrls = await Promise.all(
        images.map(async (image) => {
          const formData = new FormData();
          formData.append('file', {
            uri: image,
            type: 'image/jpeg',
            name: 'upload.jpg',
          } as any);
          formData.append('upload_preset', UPLOAD_PRESET);

          const response = await axios.post(CLOUDINARY_URL, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          return response.data.secure_url;
        })
      );

      console.log('All images uploaded successfully');
      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading images to Cloudinary:', error);
      throw error;
    }
  };

  const apiHandler = async (url, payload, token) => {
    try {
      const response = await axios.post(`${state.API_BASE_URL_ADMIN}${url}`, payload, {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MiIsImlhdCI6MTcyMTA3NDA2NywidXNlcmlkIjo0MiwiZW1haWwiOiJhbGtoc3BhbWVyckBnbWFpbC5jb20iLCJyb2xlIjpbIlN1cGVyQWRtaW4iXX0.omkORJ7wcRh0072FhNUT8SdmxWD_LDzubNZgCYLQUfA`
        }
      });
      console.log(response);
      return response;
    } catch (error) {
      return error.response;
    }
  }

  const submitProduct = async () => {
    try {
      const imageUrls = await uploadImagesToCloudinary();

      const product: Product = {
        name: title,
        description,
        price: parseFloat(price),
        priceAfterDiscount: 0,
        quantityInStock: parseInt(stock, 10),
        size: parseInt(size, 10),
        imageUrls: imageUrls,
        category: category,
        id: '',
        //isNew: true,
        postedDate: '',
      };

      const response = await apiHandler(`/Stock/Management/products/`,product,token);

      console.log('Product submitted successfully:', response);

      // Réinitialiser le formulaire après la soumission
      setImages([]);
      setTitle('');
      setDescription('');
      setPrice('');
      setStock('');
      setSize('');
      Alert.alert('Succès', 'Produit ajouté avec succès !');
    } catch (error) {
      console.error('Error submitting product:', error);
      Alert.alert('Erreur', 'Échec de l\'ajout du produit. Veuillez réessayer.');
    }
  };


  const renderImageItem = ({ item, index }) => (
    <View style={tw`mr-2 mb-2`}>
      <Image source={{ uri: item }} style={tw`w-32 h-32 mt-4 ml-3 mr-3 rounded-lg`} />
      <TouchableOpacity
        style={tw`absolute top-1 right-4 bg-white rounded-full p-1`}
        onPress={() => removeImage(index)}
      >
        <Text style={tw`text-red-500 text-xs font-bold`}>X</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={tw`px-4`}>
      <View>
        <Text style={tw`mt-8 text-lg font-medium`}>
          Add New Product
        </Text>
        <Text style={tw`text-gray-300`}>
          Create New Product and Start Selling
        </Text>
      </View>
      
      <View style={tw`mt-4`}>
      <Text style={tw`font-medium mb-2`}>Title :</Text>
        <TextInput
          style={tw`border h-12 rounded-lg px-3 text-lg mb-4`}
          placeholder="Enter The Product Title..."
          value={title}
          onChangeText={setTitle}
        />
        <Text style={tw`font-medium mb-2`}>Description:</Text>
        <TextInput
          editable
          multiline
          numberOfLines={10}
          maxLength={2000}
          style={tw`border rounded-lg px-3 py-2 text-lg mb-4`}
          placeholder="Enter The Product Description..."
          textAlignVertical="top"
          value={description}
          onChangeText={setDescription}
        />
        <Text style={tw`font-medium mb-2`}>Price :</Text>
        <View style={tw`flex-row items-center mb-4`}>
          <TextInput
            style={tw`flex-1 border h-12 rounded-lg px-3 text-lg`}
            placeholder="Enter The Price..."
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          <Text style={tw`ml-2 text-lg`}>£</Text>
        </View>
        <Text style={tw`font-medium mb-2`}>Stock :</Text>
        <TextInput
          style={tw`border h-12 rounded-lg px-3 text-lg mb-4`}
          placeholder="Enter The Stock Quantity..."
          keyboardType="numeric"
          value={stock}
          onChangeText={setStock}
        />
        <Text style={tw`font-medium`}>Category :</Text>
       <RNPickerSelect
          onValueChange={(value) => setCategory(value)}
          items={categories}
          style={{
            inputAndroid: tw`border h-12 rounded-lg px-3 text-lg mb-4`,
            inputIOS: tw`border h-12 rounded-lg px-3 text-lg mb-4`,
          }}
          placeholder={{
            label: 'Select a category...',
            value: null,
          }}
        />
        <View style={tw`mt-4`}>
        <Text style={tw`text-lg font-medium mb-2`}>Product Images</Text>
        <TouchableOpacity 
          style={tw`bg-blue-500 p-2 rounded-lg mb-2`}
          onPress={pickImage}
        >
          <Text style={tw`text-white text-center`}>Add Image</Text>
        </TouchableOpacity>

         <ScrollView style={tw`mt-4`}>
          <ImageBackground
          source={{ uri: 'https://img.freepik.com/free-vector/image-upload-concept-landing-page_52683-27130.jpg?size=338&ext=jpg' }} // Replace with your background image URL
         
          style={{marginBottom: 2,minHeight: 250,top: 2,borderWidth: 2,borderColor: "#edf2f4",borderRadius: 2,padding: 2,borderStyle: "dashed"}}
          imageStyle={tw`rounded-lg h-40 w-60 mt-10 ml-10 opacity-70`}
          >
         <FlatList
          data={images}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal={false}
          numColumns={2}
          style={{marginBottom: 2}}
        />
      
        </ImageBackground>
      </ScrollView>
      </View>
        <TouchableOpacity 
          style={tw`bg-green-500 mt-4 h-12 rounded-lg justify-center items-center mb-8`}
          onPress={submitProduct}
        >
          <Text style={tw`text-white text-lg font-medium`}>Add Product</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddProductScreen;

