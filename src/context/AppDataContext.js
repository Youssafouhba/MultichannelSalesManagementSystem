import { Client } from '@stomp/stompjs';
import React, { createContext, useEffect, useState } from 'react';
import { Admin_url, Client_url } from '../constant/GlobalsVeriables';
import { useAuth } from '../security/Authentification';
import { OrderService } from '../service/OrderService';
import { ProductService } from '../service/ProductService';
import { StockTransactionService } from '../service/StockTransactionService';
import { UserService } from '../service/UserService';
import { AdminCreationService } from '../service/admincreationservice';
var SockJS = require('sockjs-client/dist/sockjs.js');
export const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [customers,setCustomers]=useState([]);
    const [orders, setOrders] = useState([]);
    const [stockActions, setStockActions] = useState([]);
    const [admins,setAdmins] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const Auth = useAuth();
    const token = Auth.userIsAuthenticated() ? Auth.getToken() : null;
    const userRole = Auth.getUser()?.role[0]; // Get the user's role

    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        async function fetchProducts() {
           
            try {
                const response = await ProductService.getAllProducts(token);
                setProducts(response.data);
            } catch (err) {
                setError("Failed to fetch Products");
            } finally {
            }
        }
        async function fetchClients() {
           
            try {
                const response = await UserService.getAllClients(token);
                setCustomers(response.data);
            } catch (err) {
                setError("Failed to fetch Products");
            } finally {
            }
        }

        async function fetchAdmins() {
          try {
            const response = await AdminCreationService.getAdmins(token);
            setAdmins(response.data);
          } catch (error) {
            setError("Failed to fetch Products");
          }
          
        }


        async function fetchOrders() {
           
            try {
                const response = await OrderService.getAllOrders(token);
                setOrders(response.data);
            } catch (err) {
                setError("Failed to fetch Orders");
            } finally {
            }
        }

        async function fetchStockTransaction() {
           
            try {
                const response = await StockTransactionService.getAllPendingStockActions(token);
                setStockActions(response.data);
            } catch (err) {
                setError("Failed to fetch Orders");
            } finally {
            }
        }



        const onConnectedAdmin = (admin) => {
         //   console.log('Connected to WebSocket');
            admin.subscribe('/products/update', onPublicNotificationReceived); // Adjust the topic as needed
            admin.subscribe('/stocks/update', onStickActionReceived)
        };
        const onConnected = (client)=>{
          client.subscribe(`/user/SuperAdmin/updates/order`, onPrivateOrderReceived, { Authorization: `Bearer ${token}` });
          client.subscribe(`/user/SuperAdmin/updates/client`, onClientReceived, { Authorization: `Bearer ${token}` });

        }

        const onClientReceived =(payload) =>{
          try {
            const {object,action}= JSON.parse(payload.body);
            console.log("received action : "+action)
            console.log("received client : "+object.id)
            
            setCustomers(prevcCustomers => {
              switch (action) {
                case 'update':
                  const indexToUpdate = prevcCustomers.findIndex(p => p.id === object.id);
                  if (indexToUpdate >= 0) {
                    const updatedProducts = [...prevcCustomers];
                    updatedProducts[indexToUpdate] = object;
                    return updatedProducts;
                  } else {
                    return [object, ...prevcCustomers];
                  }
                case 'delete':
                  return prevcCustomers.filter(p => p.id !== object.id);
                case 'add':
                  return [object, ...prevcCustomers];
                default:
                  return prevcCustomers;
              }
        
            });
        
          } catch (error) {
            console.error('Error parsing order update:', error);
          }
        };

        const onPrivateOrderReceived = (payload) =>{
          console.log("aaaaaaaaaaaaaaa")
          try {
            const {object,action}= JSON.parse(payload.body);
            console.log("received action : "+action)
            console.log("received order : "+object.id)
            
            setOrders(prevOrders => {
              switch (action) {
                case 'update':
                  const indexToUpdate = prevOrders.findIndex(p => p.id === object.id);
                  if (indexToUpdate >= 0) {
                    const updatedProducts = [...prevOrders];
                    updatedProducts[indexToUpdate] = object;
                    return updatedProducts;
                  } else {
                    return [object, ...prevOrders];
                  }
                case 'delete':
                  return prevOrders.filter(p => p.id !== object.id);
                case 'add':
                  return [object, ...prevOrders];
                default:
                  return prevOrders;
              }
        
            });
        
          } catch (error) {
            console.error('Error parsing order update:', error);
          }
        };
      
        const onStickActionReceived =(payload) =>{
          console.log("new message update is recieve : " + JSON.parse(payload.body))
          try {
            const { stockAction, action } = JSON.parse(payload.body);
            console.log(JSON.parse(payload.body))
            console.log('Received StockAction update:', JSON.parse(payload.body).stockAction, 'Action:', action);
        
            setStockActions(prevStockActions => {
              switch (action) {
                case 'update':
                  const indexToUpdate = prevStockActions.findIndex(p => p.id === stockAction.id);
                  if (indexToUpdate >= 0) {
                    const updatedProducts = [...prevStockActions];
                    updatedProducts[indexToUpdate] = stockAction;
                    return updatedProducts;
                  } else {
                    return [stockAction, ...prevStockActions];
                  }
        
                case 'delete':
                  return prevStockActions.filter(p => p.id !== stockAction.id);
                case 'add':
                  return [stockAction, ...prevStockActions];
                default:
                  return prevStockActions;
              }
            });
      
          } catch (error) {
            console.error('Error parsing stockactions update:', error);
          }
        }
      
        const onPublicNotificationReceived = (payload) => {
            console.log("new message update is recieve : " + payload)
          try {
            const { product, action } = JSON.parse(payload.body);
        
            console.log('Received product update:', product, 'Action:', action);
        
            setProducts(prevProducts => {
              switch (action) {
                case 'update':
                  const indexToUpdate = prevProducts.findIndex(p => p.id === product.id);
                  if (indexToUpdate >= 0) {
                    const updatedProducts = [...prevProducts];
                    updatedProducts[indexToUpdate] = product;
                    return updatedProducts;
                  } else {
                    return [product, ...prevProducts];
                  }
        
                case 'delete':
                  return prevProducts.filter(p => p.id !== product.id);
                case 'add':
                  return [product, ...prevProducts];
                default:
                  return prevProducts;
              }
            });
      
          } catch (error) {
            console.error('Error parsing product update:', error);
          }
        };
        
        
      
          const websocket = async () => {
            console.log("web socket cofigure" + loading)
                if(loading){
                    console.log('test')
      
                  const onError = (error) => {
                    console.error('STOMP error:', error);
                  };
      
                // Initialize the WebSocket connection and STOMP client
                const admin = new Client({
                  debug: (str) => { console.log(str); },
                  brokerURL: `${Admin_url}/updates`, // Ensure this URL is correct
                  connectHeaders: { Authorization: `Bearer ${token}` },
                  webSocketFactory: () => new SockJS(`${Admin_url}/updates`), // Ensure this URL matches your server configuration
                  onConnect: () => onConnectedAdmin(admin),
                  onStompError: onError
              });

              const client = new Client({
                debug: (str) => { console.log(str); },
                brokerURL: `${Client_url}/notifications`, // Ensure this URL is correct
                connectHeaders: { Authorization: `Bearer ${token}` },

                webSocketFactory: () => new SockJS(`${Client_url}/notifications`), // Ensure this URL matches your server configuration
                onConnect: () => onConnected(client),
                onStompError: onError
            });
            admin.activate();
              client.activate();
             // setStompClient(client);  
                }         
          }
          setLoading(true);
          setError(null);
         
         websocket();

         if (token) {
          
          // Fetch products for all roles
          fetchProducts();
          
          // Role-based conditional fetching
          if (userRole === "SuperAdmin" || userRole === "Admin") {
              fetchClients();
              fetchStockTransaction();
              fetchOrders();
          }if (userRole === "SuperAdmin" ) {
              fetchAdmins();
          } 
      }


        setLoading(false);

    }, [token]);

    return (
        <AppDataContext.Provider value={{ products, customers, orders, stockActions,admins,setAdmins,setProducts, setCustomers, setOrders,setStockActions, loading, error }}>
            {children}
        </AppDataContext.Provider>
    );
};
