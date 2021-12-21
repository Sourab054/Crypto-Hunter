import { Box, Button, TextField } from "@material-ui/core";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { CryptoState } from "../../CryptoContext";
import { auth } from "../../firebase";

const Login = ({ handleClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAlert, setIsLogged } = CryptoState();

  const handleSubmit = async () => {
    if (!email || !password) {
      setAlert({
        open: true,
        msg: "Please fill in the details",
        type: "error",
      });
    }

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log(res);
      // console.log(user);
      setAlert({
        open: true,
        msg: `Login Successful. Welcome ${res.user.displayName}`,
        type: "success",
      });
      setIsLogged(true);

      handleClose();
    } catch (error) {
      setAlert({
        open: true,
        msg: error.message,
        type: "error",
      });
    }
  };

  return (
    <Box
      p={3}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <TextField
        variant="outlined"
        label="Enter email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      ></TextField>
      <TextField
        variant="outlined"
        label="Enter password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      ></TextField>
      <Button
        variant="contained"
        size="large"
        style={{ backgroundColor: "#c208f4", color: "white" }}
        onClick={handleSubmit}
      >
        Login
      </Button>
    </Box>
  );
};

export default Login;
