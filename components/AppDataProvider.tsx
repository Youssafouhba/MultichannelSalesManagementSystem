import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { CartElement, CommentItem, Order, Product } from '@/constants/Classes';
import Config from '@/components/config';
import { Text } from 'react-native';
import { UserDTO } from '@/constants/Classes';
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
  user: UserDTO | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  updateProfile: (userdto: UserDTO) => Promise<void>;
  logout: () => void;
  deleteAccount: () => void;
  fetchFavorites: ()=> Promise<void>;
  fetchOrders: ()=> Promise<void>;
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
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => {
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

        const ratings = Object.fromEntries(
          products.map((product, index) => [parseInt(product.id), ratingValues[index]])
        );

        setData({ products, ratings });

        console.log('Data set successfully');
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch app data');
        setIsLoading(false);
      }
    };

    fetchAppData();
  }, []);

  
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
      console.log(error.response.data);
      return error.response;
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
      console.log(error.response.data);
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
      console.log(updateResponse.data)
    }catch(error: any){
      console.log(error.response.data);
      return error.response;
    }finally{
      
    }
  }
  
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${Config.API_BASE_URL}/api/auth/singin`, { email, password });
      const responseAuth = await axios.get(`${Config.API_BASE_URL}/api/client/getMyProfil`,{
        headers: {
          Authorization: `Bearer ${response.data.token}`
        }
      });
      const cart = await axios.get(`${Config.API_BASE_URL}/api/client/getMyCart`,{
        headers: {
          Authorization: `Bearer ${response.data.token}`
        }
      })
      fetchFavorites()    
      setToken(response.data.token);
      setUser(responseAuth.data);
      setCartElements(cart.data)
    } catch (err) {
      console.error('Login failed:', err);
      setError('Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    setCartElements([])
    setToken(null)
    setFavProducts([])
  }



  return (
    <AppDataContext.Provider value={{ 
      data, user,token,cartElements,orders,updateProfile,fetchOrders,deleteAccount,favProducts, isLoading, error, login, logout,fetchFavorites }}>
      {isLoading ? <Text>Loading...</Text> : children}
    </AppDataContext.Provider>
  );
};
