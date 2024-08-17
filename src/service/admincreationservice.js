import axios from 'axios';

import { Admin_url } from "../constant/GlobalsVeriables";

const baseUrl = Admin_url;

const instance = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const AdminCreationService = {
    
    AddUserAdmin(user,token){
        return instance.post(`/AdminPanel/Sing/api/auth/register`,user, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    getAdmins(token){
        return instance.get("/AdminPanel/Sing/api/auth/getAdmins", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
    deleteAdmin(email,token){
        return instance.delete(`/AdminPanel/Sing/api/auth/delete/${email}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },

    Update(user,token){
        return instance.put(`/AdminPanel/Sing/api/auth/Update`,user, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    },
}