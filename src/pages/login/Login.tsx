import React, { useState } from "react";
import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import { signInV2 } from "../../api/authApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { apiCaller } from "../../api/apicaller";

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  async function tryLogin() {
    try {
      const response: any = await apiCaller(signInV2({ username, password }));
      localStorage.setItem("authToken", response.data.token);
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
      navigate("/home");
    } catch (error) {
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
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "url('/images/art-expense.png') no-repeat center center",
        backgroundSize: "cover",
      }}
    >
      {/* Transparent Form */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "400px",
          padding: 4,
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Transparent white background
          borderRadius: 2,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={tryLogin}
          >
            Submit
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
