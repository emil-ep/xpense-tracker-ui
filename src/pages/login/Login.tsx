import React, { useState } from "react";
import { Box, Typography, TextField, Button, Stack, Link } from "@mui/material";
import { signInV2 } from "../../api/authApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { apiCaller } from "../../api/apicaller";
import { showToast } from "../../utils/ToastUtil";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const navigate = useNavigate();

  async function tryLogin() {
    try {
      const response: any = await apiCaller(signInV2({ username: email, password }));
      localStorage.setItem("authToken", response.data.token);
      showToast("Login Success");
      navigate("/home");
    } catch (error) {
      showToast("Login Failed");
    }
  }

  async function trySignUp() {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
      });
      return;
    }

    // Call the signup API
    try {
      await apiCaller({ method: "POST", url: "http://localhost:8080/v1/auth/signUp", body: { name, email, password } });
      showToast("Signup Success. Please log in");
      setIsSignUp(false);
    } catch (error) {
      toast.error("Signup Failed", {
        position: "top-right",
        autoClose: 5000,
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
      <Box
        sx={{
          width: "100%",
          maxWidth: "400px",
          padding: 4,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: 2,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          {isSignUp ? "Sign Up" : "Login"}
        </Typography>
        <Stack spacing={2}>
          {isSignUp && (
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isSignUp && (
            <TextField
              label="Confirm Password"
              variant="outlined"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={isSignUp ? trySignUp : tryLogin}
          >
            {isSignUp ? "Sign Up" : "Login"}
          </Button>
          <Typography variant="body2" align="center">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => setIsSignUp(false)}
                >
                  Log in
                </Link>
              </>
            ) : (
              <>
                Don't have an account yet?{" "}
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => setIsSignUp(true)}
                >
                  Sign up
                </Link>
              </>
            )}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
