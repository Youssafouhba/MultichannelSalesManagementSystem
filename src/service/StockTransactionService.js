import axios from 'axios';

const baseUrl = 'https://adminside-o69g.onrender.com';

const instance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const StockTransactionService = {
    getAllStockTransactions(token) {
        return instance.get('/Stock/Management/StockTransactions/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    ,
            getStockTransactionDetails(id,token){
                return instance.get(`/Stock/Management/StockTransactions/details/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        }