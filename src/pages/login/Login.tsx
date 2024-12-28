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
        flexDirection: "row",
        height: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      {/* Left Section with Image */}
      <Box
        sx={{
          flex: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "url('/images/art-expense.png') no-repeat center center",
          backgroundSize: "cover",
        }}
      ></Box>

      {/* Right Section with Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Stack
          spacing={2}
          sx={{ width: "100%", maxWidth: "400px" }}
        >
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
