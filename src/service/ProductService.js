import axios from 'axios';
import { Admin_url,Client_url } from "../constant/GlobalsVeriables";

const baseUrl = Admin_url;
const cientBaseUrl = Client_url;

const instance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

const clientsideinstance = axios.create({
    baseURL: Client_url,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const ProductService = {
    getAllProducts(token) {
        return instance.get('/Stock/Management/products/', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    ,
            getProductDetails(id,token){
                return instance.get(`/Stock/Management/products/details/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
    ,
    getProductComments(id){
        //console.log(clientsideinstance.get(`/Comments/${id}`).)
        return clientsideinstance.get(`/Comments/${id}`).then(
            response => {return response.data}
        );
    }
    ,
    fetchProductRating(productId) {
        return clientsideinstance.get(`/Comments/${productId}`).then(response => {
            const fetchedComments = response.data;
            const totalRating = fetchedComments.reduce((sum, item) => sum + item.rating, 0);
            const averageRating = fetchedComments.length > 0 ? totalRating / fetchedComments.length : 0;
            return parseFloat(averageRating.toFixed(1)); // Return as a number
        }).catch(error => {
            console.error(`Error fetching rating for product ${productId}:`, error);
            return 0; // Return 0 in case of an error, as a number
        });
    }
    
    
    ,
            AddProduct(product,token){
                return instance.post(`/Stock/Management/products/`,product, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
    ,

    UpdateProduct(product,token){
        return axios.put(`${baseUrl}/Stock/Management/products/`,product, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }        

    ,

            DeleteProduct(productId, token){
                return instance.delete(`/Stock/Management/products/${productId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
    ,
        }