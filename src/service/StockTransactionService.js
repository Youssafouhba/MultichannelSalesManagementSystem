import axios from 'axios';
import { Admin_url } from "../constant/GlobalsVeriables";

const baseUrl = Admin_url;

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
            },

            inStockAction(stockActionReq,token){
                return instance.post(`/Stock/Management/stocks/in`,stockActionReq, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } ,
            outStockAction(stockActionReq,token){
                return instance.post(`/Stock/Management/stocks/out`,stockActionReq, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
            ,
            getAllPendingStockActions(token){
                return instance.get(`/Stock/Management/stocks/pending`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
            ,
            reviewAction(actionId,status,token){
                return instance.post(`/Stock/Management/stocks/review/action/${actionId}?status=${status}`,{},{
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
        }