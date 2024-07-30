import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { useNavigation ,useFocusEffect} from '@react-navigation/native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import tw from 'tailwind-react-native-classnames';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppContext } from '@/components/AppContext';
import { Card, Order, OrderItem } from '@/constants/Classes';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import CustomAlert from '@/components/CustomAlert';

import ModernCustomAlert from '@/components/ModernCustomAlert';

type OrderStatus = 'Pending' | 'Picked up' | 'Delivered';



const OrderItemComponent = React.memo(({ item, onPress }: { item: OrderItem; onPress: () => void }) => (
  <Pressable onPress={onPress} style={tw`flex-row items-center p-4 bg-white rounded-lg shadow-sm mb-2`}>
    <Image
      source={{ uri: item.product.imageUrls[0].url }}
      style={tw`w-16 h-16 rounded`}
      contentFit="cover"
    />
    <View style={tw`flex-1 ml-4`}>
      <Text style={tw`text-sm font-medium text-gray-900`}>{item.product.name}</Text>
      <Text style={tw`text-xs text-gray-600`}>Quantity: {item.quantity}</Text>
    </View>
    <Text style={tw`text-sm font-semibold text-gray-900`}>£{item.sub_total}</Text>
  </Pressable>
));

const OrderStatusBadge = ({ status }: { status: OrderStatus }) => {
  const badgeColor = useMemo(() => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Picked up': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
    }
  }, [status]);

  return (
    <View style={tw`px-2 py-1 rounded-full ${badgeColor}`}>
      <Text style={tw`text-xs font-medium`}>{status}</Text>
    </View>
  );
};

export default function OrderDetails() {
  const navigation = useNavigation();
  const { state,dispatch } = useAppContext();
  const [alertVisible, setAlertVisible] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const { id } = useLocalSearchParams();
  const offers = state.offers || [];
  var token = state.JWT_TOKEN;

  useFocusEffect(
    useCallback(() => {
      const fetchOrder = async () => {
        const response = await axios.get<Order[]>(`${state.API_BASE_URL}/api/client/getMyOrders`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const foundOrder = response.data.find((item) => item.id == id);
        setOrder(foundOrder || null);
        console.log(foundOrder)
      };
      fetchOrder();

      return () => {
        // Fonction de nettoyage
      };
    }, [id, offers])
  );
 

  const renderItem = ({ item }: { item: OrderItem }) => (
    <OrderItemComponent 
      item={item} 
      onPress={() => router.navigate(`/ProductDetails?id=${item.product.id}`)}
    />
  );

  const handleCancel = () => {
    setAlertVisible(false);
  };

  const handleConfirm = () => {
    setAlertVisible(false);
    dispatch({type: 'CLEAN_CART'})
      order?.orderItems.map((item: OrderItem)=>{
        const quantity = item.quantity
        dispatch({ type: 'ADD_TO_CART', payload: { ...item.product, quantity } });
      })
      router.push("/Checkout?id=r")
  };

  const handleReorder = async () => {
    if(state.cartItemsCount==0){
      console.log(state.cartItems)
      order?.orderItems.map((item: OrderItem)=>{
        const quantity = item.quantity
        dispatch({ type: 'ADD_TO_CART', payload: { ...item.product, quantity } });
      })
      router.push("/Checkout?id=r")
    }else{
      setAlertVisible(true)
    }
  };

  if (!order) {
    return (
      <SafeAreaView style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <Text>Loading order details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      
      <ModernCustomAlert
        visible={alertVisible}
        title="Confirm Reorder"
        message="You already have items in your cart. Do you want to replace them with this order?"
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
      <View style={tw`p-4`}>
        <Text style={tw`text-2xl font-bold text-gray-900 mb-2`}>Order Details</Text>
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <Text style={tw`text-sm text-gray-600`}>Order ID: {order.id}</Text>
          <OrderStatusBadge status={order.status} />
        </View>
        <Text style={tw`text-sm text-gray-600 mb-4`}>Date: {new Date(order.creationDate).toLocaleDateString()}</Text>
        
        <FlatList
          data={order.orderItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          scrollEnabled={true}
          style={[tw`mb-4`,{height: '55%'}]}
        />
        
        <View style={tw`bg-white p-4 rounded-lg shadow-sm mb-4`}>
          <Text style={tw`text-lg font-semibold text-gray-900 mb-2`}>Order Summary</Text>
          <View style={tw`flex-row justify-between`}>
            <Text style={tw`text-base text-gray-600`}>Total Amount:</Text>
            <Text style={tw`text-base font-semibold text-gray-900`}>£{order.totalAmount}</Text>
          </View>
        </View>
        
        <Pressable
          onPress={handleReorder}
          style={tw`bg-green-500 py-3 px-4 rounded-lg`}
        >
          <Text style={tw`text-white text-center font-semibold`}>REORDER</Text>
        </Pressable>
      </View>
    </View>
  );
}