import { Button, Input, Label } from '@windmill/react-ui';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ImageDark from '../assets/img/login-office-dark.jpeg';
import ImageLight from '../assets/img/login-office.jpeg';
import { useAuth } from "../security/Authentification";

const baseUrl = "http://localhost:9999";

function Login() {
  const Auth = useAuth();
  const isLoggedIn=Auth.userIsAuthenticated();
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useHistory();

  const handleLogin = () => {
    Auth.userLogin(mail, password)
      .then(() => {
        navigate.push("/app/Dashboard");
        console.log("Login success");
      })
      .catch(error => {
        console.log(error);
        setError(error.message || 'An unexpected error occurred');
      });
   
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate.push("/app/Dashboard");
    }
  }, [isLoggedIn, navigate]);


  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Login</h1>
              <Label>
                <span>Email</span>
                <Input className="mt-1" type="email" onChange={(e) => setMail(e.target.value)} placeholder="example@example.com" />
              </Label>
              <Label className="mt-4">
                <span>Password</span>
                <Input className="mt-1" type="password" onChange={(e) => setPassword(e.target.value)} placeholder="***************" />
              </Label>
              {error ? <h1 className='text-red-500'>{error}</h1> : null}
              <Button onClick={handleLogin} className="mt-4" block>
                Log in
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Login;
