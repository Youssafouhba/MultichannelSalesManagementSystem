import axios from 'axios';

const baseUrl = 'https://clientside-8l93.onrender.com';

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