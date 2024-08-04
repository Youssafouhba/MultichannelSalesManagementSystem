import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { CartElement, CommentItem, Order, OrderItem, Product } from '@/constants/Classes';
import Config from '@/components/config';
import { Text } from 'react-native';
import { UserDTO } from '@/constants/Classes';
import { Notification } from '@/constants/Classes';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppData {
  products: Product[];
  ratings: { [key: number]: number };
}

interface AppDataContextType {
  data: AppData | null;
  token: string | null;
  cartElements: CartElement[];
  orders: Order[];
  favProducts: Product[];
  BestProducts: Product[];
  NewProducts: Product[];
  user: UserDTO | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (userdto: UserDTO) => Promise<void>;
  logout: () => void;
  fetchprofile: ()=> Promise<void>;
  deleteAccount: () => void;
  markNotificationAsRead: (id: any) => Promise<void>;
  fetchFavorites: ()=> Promise<void>;
  fetchOrders: ()=> Promise<void>;
  fetchCart: ()=> Promise<void>;
  fetchdt: (token: string)=> void;
  login: (tok: string) => Promise<void>;
  fetchNotification(): Promise<Notification[]>;
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
  const [token, setToken] = useState<string | null>(null);
  const [cartElements,setCartElements] = useState<CartElement[]>([]);
  const [favProducts, setFavProducts] = useState<Product[]>([]);
  const [NewProducts, setNewProducts] = useState<Product[]>([]);
  const [BestProducts, setBestProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect( () => {
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

    const fetchAppData = async () => {
      try {
        setIsLoading(true);
        const productsResponse = await axios.get(`${Config.API_BASE_URL}/api/Products`);
        const products = productsResponse.data;

        const ratingsPromises = products.map(product => fetchProductRating(parseInt(product.id)));
        const ratingValues = await Promise.all(ratingsPromises);

        const nweproducts = products.filter((product: Product) => product.isNew);
        const newones =  await Promise.all(nweproducts)

        const ratings = Object.fromEntries(products.map((product, index) => [parseInt(product.id), ratingValues[index]]));

        const bestproducts = products.filter((product: Product) => product.isBestSeller);
        const bestones =  await Promise.all(bestproducts)


        console.log('Data set successfully');
        setData({ products, ratings });
    
        setNewProducts(newones);
        setBestProducts(bestones)
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch app data');
        setIsLoading(false);
      }
    };

    fetchAppData();
  }, []);

  const fetchdt = async (token: string) => {
    //setToken(token)
  }

  const login = async (tok: string) => {
    try {     
      setToken(tok)
      const responseAuth = await axios.get(`${Config.API_BASE_URL}/api/client/getMyProfil`,{
        headers: {
          Authorization: `Bearer ${tok}`
        }});
        setUser(responseAuth.data);
        try {
          const responseFavorites = await axios.get<Product[]>(
            `${Config.API_BASE_URL}/api/client/getMyFavoriteProducts`,
            { headers: { Authorization: `Bearer ${tok}`}});
          setFavProducts(responseFavorites.data);
        } catch (err) {
          console.error('favorites :', err);
          setError('favorites failed');
        }
        fetchOrders()
    } catch (error) {
      return error;
    }
  }

const fetchprofile = async () => {
  const responseAuth = await axios.get(`${Config.API_BASE_URL}/api/client/getMyProfil`,{
    headers: {
      Authorization: `Bearer ${token}`
    }});
    setUser(responseAuth.data);
}

  const fetchFavorites = async () => {
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
    try {
      const response = await axios.get<Order[]>(`${Config.API_BASE_URL}/api/client/getMyOrders`,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const sortedOrders = response.data.sort((a, b) => 
        new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
      );
      setOrders(sortedOrders);
    } catch (error) {
      //console.log(error.response.data);
      return error.response;
    }
  }

  const fetchNotification = async () => {
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
      data, user,token,cartElements,orders,BestProducts,NewProducts,login,fetchCart,fetchprofile,fetchNotification,markNotificationAsRead,updateProfile,fetchOrders,deleteAccount,favProducts, isLoading, error,fetchdt, logout,fetchFavorites }}>
      {isLoading ? <Text>Loading...</Text> : children}
    </AppDataContext.Provider>
  );
};
