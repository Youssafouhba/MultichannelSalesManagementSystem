import { Color } from '@/GlobalStyles';
import { useAppContext } from '@/components/AppContext';
import LogInRequiredPage from '@/components/LogInRequiredPage';
import NoInternetConnection from '@/components/NoInternetConnection';
import RatingFeedbackModal from '@/components/RatingFeedbackModal';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import useBackButtonHandler from '@/components/useBackButtonHandler';
import useInternetCheck from '@/components/useInternetCheck';
import { Order, OrderStatus, ProductInfos } from '@/constants/Classes';
import { useCart } from '@/contex/CartContex';
import { useUser } from '@/contex/UserContext';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { differenceInDays, format } from 'date-fns';
import { useLocalSearchParams, usePathname, } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import tw from 'tailwind-react-native-classnames';

interface RouteParams {
  payload: ProductInfos; // Replace 'any' with the actual type of payload
}

type IconConfig = {
  name: string;
  color: string;
  Component: typeof Icon | typeof TabBarIcon;
};

const STATUS_ICON_CONFIG: Record<OrderStatus, IconConfig> = {
  delivered: { name: 'check-circle', color: 'green', Component: Icon },
  "picked up": { name: 'cube-outline', color: '#0077b6', Component: TabBarIcon },
  Pending: { name: 'schedule', color: 'orange', Component: Icon },
  "cancelled":{ name: 'schedule', color: 'red', Component: Icon }
};

const StatusIcon: React.FC<{ status?: OrderStatus }> = React.memo(({ status = 'pending' }) => {
  const { name, color, Component } = STATUS_ICON_CONFIG[status];
  return <Component name={name} color={color} size={24} />;
});


const OrderDateDisplay: React.FC<{ orderDate: string | Date }> = ({ orderDate }) => {
  const today = new Date();
  const orderDateTime = new Date(orderDate);
  const daysDifference = differenceInDays(today, orderDateTime);

  let displayText;
  if (daysDifference === 0) {
    displayText = `${format(orderDateTime, 'yyyy-MM-dd')} Today`;
  } else if (daysDifference <= 7) {
    displayText = `${daysDifference} Days`;
  } else if (daysDifference <= 15) {
    displayText = `${format(orderDateTime, 'yyyy-MM-dd')} Last Week`;
  } else {
    displayText = format(orderDateTime, 'yyyy-MM-dd');
  }

  return <Text>{displayText}</Text>;
};

const badgeColor = (status: OrderStatus) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'picked up':
      return 'bg-blue-100 text-blue-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-red-100 text-red-800';
  }
};

const Orders: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute()
  const {appstate,setPreviouspage,setIsRated } = useAppContext();
  const {state,OnReload} = useUser();
  const {statecart,cleanCart} = useCart();
  const [isRatingModalVisible,setisRatingModalVisible] = useState<boolean>(false)
  const [orderedProducts, setOrderedProducts] = useState({});
  var cartItems = statecart.items || {};
  const pathname = usePathname();
  const {rated} = useLocalSearchParams();
  const { isConnected, connectionType } = useInternetCheck();
  useBackButtonHandler(() => {
    const payload = {
      ...(route.params as RouteParams)?.payload,
    };
    if(pathname=="/"+appstate.previouspage){
      setPreviouspage("index")
    }
    if(appstate.previouspage=="ProductDetails"){
      pathname=="/ProductDetails"?navigation.navigate("index" as never):navigation.navigate(appstate.previouspage as never,{payload})
     }else{
      pathname=="/"+appstate.previouspage&&appstate.previouspage!="ProductDetails"?navigation.navigate("index" as never):navigation.navigate(appstate.previouspage as never,{payload});
    }
    return true;
  });

  useFocusEffect(
    useCallback(()=>{
      if(appstate.isRated){
        setisRatingModalVisible(true)
        setOrderedProducts(cartItems)
        cleanCart()
      }
      return () => {
      };
  },[appstate.isRated]))


  useEffect(()=>{
    OnReload(state.userInfos)
  },[])

  const gotoDetails = (order: Order) =>{  
    const payload = {
      ...order,
    };  
    navigation.navigate(`OrderDetails`,{payload})
    setPreviouspage("Orders")
  }

  const OrderItem: React.FC<{ order: Order; onPress: () => void }> = React.memo(({ order, onPress }) => (
    <TouchableOpacity style={styles.orderItem} onPress={onPress}>
      <View style={tw`flex-row justify-between items-center my-2`}>
        <Text style={styles.date}>Date:</Text>
        <Text style={[tw`text-base font-medium px-2 rounded`,{backgroundColor: Color.COLORALICEBLUE}]}>
          <OrderDateDisplay orderDate={order.creationDate} />
        </Text>
      </View>
      {
      order.paymentMethod=='Card'?
        ( 
          <View style={tw`flex-row items-center my-2`}>
            <Text style={[styles.address,tw`text-base`]}>Address:</Text>
            <Text style={tw`ml-5 text-base`} numberOfLines={2}>{order.adresse}</Text>
          </View>
        )
        :
        ('')
      }
      <View style={tw`flex-row justify-between items-center my-2`}>
        <Text style={styles.total}>Total:</Text>
        <Text style={[tw`text-lg font-medium text-base`,{color: "#e84c11"}]} >£ {parseFloat(order.totalAmount.toFixed(1))}</Text>
        <View style={[styles.statusContainer, tw`px-2 py-1 rounded-xl ${badgeColor(order.status)}`]}>
          <StatusIcon status={order.status} />
          <Text style={[styles.status,tw`text-base`]}>{order.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  ));

  const renderItem = useCallback(({ item }: { item: Order }) => (
    <OrderItem
      key={item.id}
      order={item}
      onPress={() => gotoDetails(item)}
    />
  ), [navigation]);

  const keyExtractor = useCallback((item: Order) => item.id, []);

  return (
    !isConnected?
      <NoInternetConnection/>
    :
    <View style={styles.container}>
      <RatingFeedbackModal
        visible={isRatingModalVisible}
        onClose={() => {setIsRated(false),setisRatingModalVisible(false)}}
        onSubmit={()=>{setIsRated(false),setisRatingModalVisible(false)}}
        products={state.orderedProducts}
      />
      {!state.isLoggedIn ?
      (
        <LogInRequiredPage message='Please log in to view your Orders' page='Orders'/>):
      (
        state.userInfos.myOrders.length > 0?
      <FlatList
        data={state.userInfos.myOrders}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
      />
        : 
      <View style={[tw`justify-center items-center h-80`]}>
        <Text style={[tw`text-base`]}>Your Order List is empty !</Text>
        <Image source={require("@/assets/images/icons8-aucun-résultat-48.png")}/>
      </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.mainbackgroundcolor,
  },
  listContainer: {
    marginVertical: 8,
    padding: 16,
  },
  orderItem: {
    backgroundColor: Color.colorWhite,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#0077b6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});

export default Orders;
