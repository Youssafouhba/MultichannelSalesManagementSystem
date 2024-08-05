import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../security/Authentification";

function LogOut(){
    const navigate = useHistory();
    const { signOut } = useAuth();

    useEffect(() => {
        signOut();
        navigate.push('/'); // Navigate to the desired route after signing out
    }, [signOut, navigate]);

    return (
        <div>
            Logging out...
        </div>
    );

}
export default LogOut;