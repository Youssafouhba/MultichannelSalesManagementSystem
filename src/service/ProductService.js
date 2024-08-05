import axios from 'axios';

const baseUrl = 'https://adminside-o69g.onrender.com';

const instance = axios.create({
    baseURL: baseUrl,
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
            AddProduct(product,token){
                return instance.post(`/Stock/Management/products/`,product, {
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
        }