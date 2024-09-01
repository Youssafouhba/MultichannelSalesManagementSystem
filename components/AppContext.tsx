import { Order, Product, ProductInfos } from "@/constants/Classes";
import { CartItems } from "@/contex/CartContex";
import { createContext, useCallback, useContext, useMemo, useReducer } from "react";

interface AppState {
    API_BASE_URL: string;
    products: [],
    filtredproducts: ProductInfos[],
    offers: {},
    previouspage: string,
    isLoggedIn: boolean,
    isRated: boolean,
    order: Order | null,
    orderedProducts: CartItems,
    product: ProductInfos,
    productId: number,
  }
  
type AppAction =
    | { type: 'Set_isRated'; payload: boolean }
    | { type: 'Set_previouspage'; payload: string }
    | { type: 'SET_JWT_TOKEN'; payload: string }
    | { type: 'SET_Product'; payload: ProductInfos }
    | { type: 'Set_Order'; payload: Order | null }
    | { type: 'Set_orderedProducts'; payload: CartItems }
    | { type: 'Set_filtredproducts'; payload: ProductInfos[] };

const initialState: AppState = {
    API_BASE_URL: '',
    products: [],
    filtredproducts: [],
    offers: {},
    previouspage: 'index',
    isLoggedIn: false,
    isRated: false,
    order: {
        id: '',
        creationDate: '',
        adresse: '',
        totalAmount: 0,
        status: 'Pending',
        paymentMethod: 'Card',
        shepingDate: new Date,
        orderItems: [],
      },
    orderedProducts: {},
    product: {
      product: {
        id: "",
        isNew: false,
        isBestSeller: false,
        name: "",
        description: "",
        price: 0,
        priceAfterDiscount: 0,
        quantityInStock: 0,
        size: 0,
        imageUrls: [],
        category: "",
        postedDate: ""
      },
      comments: [],
      raiting: 0,
      saledQuantity: 0
    },
    productId: 0,
};
function appReducer(appstate: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'Set_orderedProducts':
            return { ...appstate, orderedProducts: action.payload }
        case 'Set_filtredproducts':
          return { ...appstate, filtredproducts: action.payload }
        case 'Set_Order':
            return { ...appstate, order: action.payload };
        case 'SET_Product':
            return { ...appstate, product: action.payload };
        case 'Set_isRated':
            return { ...appstate, isRated: action.payload };
        case 'Set_previouspage':
            return { ...appstate, previouspage: action.payload };
        default:
            return appstate;
    }
}

const AppContext = createContext<{
    appstate: AppState;
    setProduct: (product: ProductInfos)=> void;
    setOrder1: (order: Order | null)=> void;
    setOrderedProducts: (orderedProducts: CartItems)=> void;
    setIsRated: (israted: boolean)=> void;
    setPreviouspage: (prevpage: string)=> void;
    setfiltredproducts: (filteredProducts: ProductInfos[])=> void;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [appstate, dispatch] = useReducer(appReducer, initialState);
  
    const setPreviouspage = useCallback((prvpage: string)=>{
      dispatch({ type: 'Set_previouspage', payload: prvpage });
    }, []);

    const setfiltredproducts = useCallback((filtredproducts: ProductInfos[])=>{
      dispatch({ type: 'Set_filtredproducts', payload: filtredproducts });
    }, []);

    const setProduct = useCallback((product: ProductInfos) => {
      dispatch({ type: 'SET_Product', payload: product });
    }, []);
  
    const setOrder1 = useCallback((order: Order | null) => {
      dispatch({ type: 'Set_Order', payload: order });
    }, []);
  
    const setOrderedProducts = useCallback((products: CartItems) => {
      dispatch({ type: 'Set_orderedProducts', payload: products });
    }, []);

    const setIsRated = useCallback((israted: boolean) => {
        dispatch({ type: 'Set_isRated', payload: israted });
      }, []);
  
    const value = useMemo(() => ({
      appstate,
      setOrder1,
      setOrderedProducts,
      setProduct,
      setIsRated,
      setPreviouspage,
      setfiltredproducts,
    }), [appstate]);
  
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
  };

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
      throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};      