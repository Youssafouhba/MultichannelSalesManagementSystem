import axios from 'axios';
import { Client_url } from "../constant/GlobalsVeriables";

const baseUrl = Client_url;

const instance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const OrderService = {
    getAllOrders(token) {
        return instance.get('/api/adMin/Orders/getAllOrders', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    ,
    setreview(token , statusUrl,id){
        console.log(token)
        return instance.post(`/api/adMin/Orders/${statusUrl}/${id}` ,{},{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
    
};