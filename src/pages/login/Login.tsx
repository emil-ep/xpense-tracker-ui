import React from "react";
import Stack from "../../components/Stack";
import './login.css'

export default function Login() {
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
            // value={email} 
            // onChange={handleEmailChange} 
            placeholder="Enter your email" 
          />
          <label className="inputLabel" htmlFor="password">Password</label>
          <input 
            className="inputField"
            id="password" 
            type="password" 
            // value={password} 
            // onChange={handlePasswordChange} 
            placeholder="Enter your password" 
          />
          <button className="submitButton">
            Submit
          </button>
        </Stack>
      </Stack>
    </Stack>
  );
}
