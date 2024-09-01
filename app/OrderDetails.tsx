import React, { useCallback, useMemo, useState } from 'react';
import { Image,View, Text, Pressable, FlatList } from 'react-native';
import {useNavigation ,useFocusEffect, useRoute} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'tailwind-react-native-classnames';
import { useAppContext } from '@/components/AppContext';
import { Order, OrderItem, Product, ProductInfos } from '@/constants/Classes';
import { OrderStatus } from '@/constants/Classes';
import ModernCustomAlert from '@/components/ModernCustomAlert';
import { useAppData } from '@/components/AppDataProvider';
import { useUser } from '@/contex/UserContext';
import { useCart } from '@/contex/CartContex';
import useInternetCheck from '@/components/useInternetCheck';
import NoInternetConnection from '@/components/NoInternetConnection';

interface RouteParams {
  payload: Order;
}

const OrderItemComponent = (({ item, onPress }: { item: OrderItem; onPress: () => void }) => (
  <Pressable onPress={onPress} style={tw`flex-row items-center p-4 bg-white rounded-lg shadow-sm mb-2`}>
    <Image
      source={{ uri: item.product.imageUrls[0]?.url }}
      style={tw`w-16 h-16 rounded`}
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
  const { ProductsInfos} = useAppData();
  const route = useNavigation<any>();
  const route1 = useRoute();
  const {setPreviouspage,setOrder1 } = useAppContext();
  const {statecart,cleanCart,addToCart} = useCart();
  const {state} = useUser();
  const [alertVisible, setAlertVisible] = useState(false);
  const [order, setOrder] = useState<Order | null>((route1.params as RouteParams)?.payload);
  const { isConnected, connectionType } = useInternetCheck();
  useFocusEffect(
    useCallback(() => {
      const fetchOrder = async () => {
        setPreviouspage( "Orders")
        setOrder((route1.params as RouteParams)?.payload);
      };
      fetchOrder();
    }, [state.userInfos.myOrders ])
  );
 
  const goTo = (pageToGo: string) => {
    route.navigate(pageToGo as never)
    setPreviouspage("OrderDetails");
  }

  const gotodetails = (itemId: string) => {    
    const payload = {
      ...ProductsInfos.find((prodinfos: ProductInfos)=>prodinfos.product.id== itemId),
    };
    route.navigate(`ProductDetails`,{payload})
    setPreviouspage("OrderDetails");
  }

  const renderItem = ({ item }: { item: OrderItem }) => (
    <OrderItemComponent 
      item={item} 
      onPress={() =>gotodetails(item.product.id)}
    />
  );

  const handleCancel = () => {
    setAlertVisible(false);
  };

  const handleConfirm = () => {
    setAlertVisible(false);
    cleanCart();
    order?.orderItems.map((item: OrderItem)=>{
      const quantity = item.quantity
      addToCart(item.product.id, quantity);
    })
    setOrder1(order);
    goTo("Cart")
  };

  const handleReorder = async () => {
    if(statecart.itemsCount==0){
      order?.orderItems.map((item: OrderItem)=>{
        const quantity = item.quantity
        addToCart(item.product.id, quantity);
      })
      setOrder1(order);
      goTo("Cart")
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
    !isConnected?
    <NoInternetConnection/>
    :
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
            <Text style={tw`text-base font-semibold text-gray-900`}>£{parseFloat(order.totalAmount.toFixed(1))}</Text>
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