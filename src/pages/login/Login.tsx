import React, { useState } from "react";
import Stack from "../../components/Stack";
import './login.css'
import { signIn } from "../../api/authApi";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Login() {

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  async function tryLogin(){
    try{
      const response = await signIn({username, password});
      localStorage.setItem('authToken', response.data.token);
      toast("Login Success", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      navigate('/home');
    }catch(error){
      toast("Login Failed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  }

  return (
    <Stack className="container" direction="row">
      <Stack className="imageSection" direction="row" justify='center'>
        <img src="/images/login_wallpaper.jpg" className="img"  alt="login_wallpaper"/>
      </Stack>
      <Stack className="formSection" direction="column" justify="center" align="center">
        <Stack direction="column" align="flex-start" justify="center">
          <label className="inputLabel" htmlFor="email">Email</label>
          <input 
            className="inputField"
            id="email" 
            type="email" 
            value={username} 
            onChange={(e) => {
              setUsername(e.target.value)
            }} 
            placeholder="Enter your email" 
          />
          <label className="inputLabel" htmlFor="password">Password</label>
          <input 
            className="inputField"
            id="password" 
            type="password" 
            value={password} 
            onChange={(e) => {
              setPassword(e.target.value)
            }} 
            placeholder="Enter your password" 
          />
          <button className="submitButton" type="submit" onClick={tryLogin}>
            Submit
          </button>
        </Stack>
      </Stack>
    </Stack>
  );
}
