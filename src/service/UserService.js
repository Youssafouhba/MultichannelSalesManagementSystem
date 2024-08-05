import axios from 'axios';

const baseUrl = 'https://clientside-8l93.onrender.com';

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
    }
};