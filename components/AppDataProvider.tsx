import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { CartElement, CommentItem, Order, OrderItem, Product, ProductInfos, UserInfos } from '@/constants/Classes';
import Config from '@/components/config';
import { UserDTO } from '@/constants/Classes';
import { Notification } from '@/constants/Classes';
import LogoPage from '@/app/LogoPage';
import { Client } from '@stomp/stompjs';
import { set } from 'lodash';
import { jwtDecode } from 'jwt-decode';
var SockJS = require('sockjs-client/dist/sockjs.js');

interface AppData {
  products: Product[];
  ratings: { [key: number]: number };
}

interface AppDataContextType {
  data: AppData | null;
  ProductsData: {};
  token: string | null;
  cartElements: CartElement[];
  orders: Order[];
  favProducts: Product[];
  ProductsInfos: ProductInfos[];
  userInfos: UserInfos;
  BestProducts: ProductInfos[];
  NewProducts: ProductInfos[];
  user: UserDTO | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (userdto: UserDTO) => Promise<void>;
  logout: () => void;
  fetchprofile: ()=> Promise<void>;
  deleteAccount: () => void;
  markNotificationAsRead: (id: any) => Promise<void>;
  fetchFavorites: ()=> Promise<void>;
  fetchOrders: ()=> Promise<Order[]>;
  fetchCart: ()=> Promise<void>;
  fetchdt: () => void;
  login: (tok: string) => void;
  fetchNotification: (token: string) => Promise<Notification[]>;
  fetchProductRating: (productId: number) =>Promise<number>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
};

interface AppDataProviderProps {
  children: ReactNode;
}

export const AppDataProvider: React.FC<AppDataProviderProps> = ({ children }) => {
  const [data, setData] = useState<AppData | null>(null);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  var   [token, setToken] = useState<string | null>(null);
  const [cartElements,setCartElements] = useState<CartElement[]>([]);
  const [favProducts, setFavProducts] = useState<ProductInfos[]>([]);
  const [NewProducts, setNewProducts] = useState<ProductInfos[]>([]);
  const [BestProducts, setBestProducts] = useState<ProductInfos[]>([]);
  const [ProductsInfos, setProductsInfos] = useState<ProductInfos[]>([]);
  const [userInfos, setUserInfos] = useState<UserInfos>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stompClient, setStompClient] = useState<Client | null>(null);

  useEffect(()=>{
    const fetchprofile = async () => {
      const responseAuth = await axios.get(`${Config.API_BASE_URL}/api/client/getMyProfil`,{
        headers: {
          Authorization: `Bearer ${token}`
        }});
        setUserInfos(responseAuth.data);
    }
    fetchprofile
  },[])

 
  const fetchProductRating = async (productId: number): Promise<number> => {
    try {
      const response = await axios.get(`${Config.API_BASE_URL}/Comments/${productId}`);
      const fetchedComments: CommentItem[] = response.data;
      const totalRating = fetchedComments.reduce((sum, item) => sum + item.rating, 0);
      const averageRating = fetchedComments.length > 0 ? totalRating / fetchedComments.length : 0;
      return parseFloat(averageRating.toFixed(1));
    } catch (error) {
      console.error(`Error fetching rating for product ${productId}:`, error);
      return 0;
    }
  };



  const fetchBestAnfNew = (P: ProductInfos[]) =>{
    setBestProducts(P.filter((prinf: ProductInfos)=> prinf.product.isBestSeller))
    setNewProducts(P.filter((prinf: ProductInfos)=> prinf.product.isNew))
  }

  useEffect( () => {
    const fetchAppData = async () => {
      try {
        setIsLoading(true);
        const productsResponse = await axios.get(`http://209.38.168.154:9000/api/Products`);
        const products = productsResponse.data;
        setProductsInfos(products);
        fetchBestAnfNew(products);
        setData({
          products: [],
          ratings: Object.fromEntries(products.map((product: ProductInfos, index: number) => [parseInt(product.product.id),product.raiting])),
        });
   
      } catch (error) {
        setError('Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    const onConnected = (client: Client) => {
      console.log('Connected to WebSocket');  
      client.subscribe('/updates/product', onPublicNotificationReceived); // Adjust the topic as needed
      client.subscribe('/updates/comments', onCommentAdded); 
    };

    


    const onCommentAdded = (payload: any) => {
      try{
        const { object, action } = JSON.parse(payload.body);

        setProductsInfos(prevProducts => {
          const indexToUpdate = prevProducts.findIndex((pinf) => pinf.product.id === object.product.id);
          if (indexToUpdate >= 0) {
            const updatedProducts = [...prevProducts];
            updatedProducts[indexToUpdate].product = object.product;
            updatedProducts[indexToUpdate].comments = object.comments;
            updatedProducts[indexToUpdate].raiting = object.raiting;
            fetchBestAnfNew(updatedProducts);
            return updatedProducts;
          } 
        });
      }catch(error){
        console.error('Error parsing Comments update:', error);
      }
    }

  const onPublicNotificationReceived = (payload: any) => {
    try {
      const { object, action } = JSON.parse(payload.body);
  
      setProductsInfos(prevProducts => {
        switch (action) {
          case 'update':
            const indexToUpdate = prevProducts.findIndex((pinf) => pinf.product.id === object.id);
            if (indexToUpdate >= 0) {
              const updatedProducts = [...prevProducts];
              updatedProducts[indexToUpdate].product = object;
              fetchBestAnfNew(updatedProducts);
              return updatedProducts;
            } 
          case 'delete':
            const filteredProducts = prevProducts.filter((pinf) => pinf.product.id !== object.id);
            fetchBestAnfNew(filteredProducts);
            return filteredProducts;
          case 'add':
            const productsWithNewItem = [{ product: object, raiting: 0 ,comments: []}, ...prevProducts];
            fetchBestAnfNew(productsWithNewItem);
            return productsWithNewItem;
          default:
            return prevProducts;
        }
      });

    } catch (error) {
      console.error('Error parsing product update:', error);
    }
  };
  
  

    const websocket = async () => {
          if(isLoading){

            const onError = (error: any) => {
              console.error('STOMP error:', error);
            };

          // Initialize the WebSocket connection and STOMP client
          const client = new Client({
            debug: (str) => { console.log(str); },
            brokerURL: `http://209.38.168.154:9000/products`,
            connectHeaders: { },
            appendMissingNULLonIncoming: true,
            webSocketFactory: () => new SockJS(`http://209.38.168.154:9000/products`), // Ensure this URL matches your server configuration
            onConnect: () => onConnected(client),
            onStompError: onError
        });

        client.activate();
        setStompClient(client);  
          }         
    }

  
    websocket();
    fetchAppData();
    
  }, []);

  const fetchdt = async () => {
    
  }

  const login = async (tok: string) => {
      try {     
        setToken(tok)
        const responseAuth = await axios.get(`${Config.API_BASE_URL}/api/client/getMyProfil`,{
          headers: {
            Authorization: `Bearer ${tok}`
          }});
          responseAuth.data.myOrders = responseAuth.data.myOrders.sort((a, b) => 
            new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
          );
          setCartElements(responseAuth.data.shoppingList)
        setUserInfos(responseAuth.data);   
      } catch (error) {
        return error;
      }
  }



  const fetchFavorites = async () => {
    if(token!=null)
      try {
        const responseFavorites = await axios.get<Product[]>(
          `${Config.API_BASE_URL}/api/client/getMyFavoriteProducts`,
          { headers: { Authorization: `Bearer ${token}`}});
        setFavProducts(responseFavorites.data);
      } catch (err) {
        console.error('favorites :', err);
        setError('favorites failed');
      }
  }

  const fetchCart = async () => {
    const cart = await axios.get(`${Config.API_BASE_URL}/api/client/getMyCart`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    setCartElements(cart.data)
  }

  const fetchOrders = async () => {
    if(token!=null)
      try {
        const response = await axios.get<Order[]>(`${Config.API_BASE_URL}/api/client/getMyOrders`,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const sortedOrders = response.data.sort((a, b) => 
          new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
        );
        //console.log(sortedOrders)
        setOrders(sortedOrders);
        return sortedOrders
      } catch (error) {
        //console.log(error.response.data);
        return error.response;
      }
  }

  const fetchNotification = async (token: string) => {
    if(token!=null)
      try {
          const response = await axios.get(`${Config.API_BASE_URL}/api/adMin/notification/mynotif`, {
              headers: {
                  Authorization: `Bearer ${token}`
              }
          });
          
          return response.data.map((notification: any) => ({
              ...notification,
              isRead: notification.isRead || false // Assurez-vous que le backend renvoie cette information
          }));
      } catch (error: any) {
          throw new Error(`Error fetching notification: ${error.message}`);
      }
}

  const deleteAccount =  async () => {
    if(token!=null)
      try{
        const deleteResponse = await axios.delete(`${Config.API_BASE_URL}/api/client`,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }catch(error: any){
        return error.response;
      }finally{
        setUser(null);
        setCartElements([])
        setToken(null)
        setFavProducts([])
      }
  }

  const updateProfile = async (userdto: UserDTO) => {
    if(token!=null)
      try{
        const updateResponse = await axios.put(`${Config.API_BASE_URL}/api/client`,userdto,{
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

      }catch(error: any){
        
        return error.response;
      }finally{
        
      }
  }

  const  markNotificationAsRead = async (id: any) => {
    if(token!=null)
      try{
        const response = await axios.post(`${Config.API_BASE_URL}/api/adMin/notification/MarAsRead/${id}`, {},{
          headers: {
              Authorization: `Bearer ${token}`
          }
      });
      }catch(error: any){
        console.log(error)
      }
  }

  const logout = () => {
    setUser(null);
    setCartElements([])
    setToken(null)
    setFavProducts([])
  }

  return (
    <AppDataContext.Provider value={{ 
      data, user,token,cartElements,orders,BestProducts,ProductsInfos,NewProducts,userInfos,fetchProductRating,login,fetchCart,fetchNotification,markNotificationAsRead,updateProfile,fetchOrders,deleteAccount, isLoading, error,fetchdt, logout,fetchFavorites }}>
      {isLoading ? <LogoPage/> : children}
    </AppDataContext.Provider>
  );
};
