import axios from 'axios';
import { Admin_url, Client_url } from "../constant/GlobalsVeriables";

const baseUrl = Client_url;
const instance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const UserService = {
    getAllClients(token) {
        return instance.get('/api/client/getAllClient', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },

    getTradeCustomerRequests(token){
        
        return instance.get(`${Admin_url}/api/clientTradeCustomers/requests`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

};