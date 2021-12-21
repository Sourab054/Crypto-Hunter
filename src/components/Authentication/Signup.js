import { Box, Button, TextField } from "@material-ui/core";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { CryptoState } from "../../CryptoContext";
import { auth } from "../../firebase";

const Signup = ({ setValue }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { setAlert, setUser } = CryptoState();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setAlert({
        open: true,
        msg: "Passwords do not match. Try again",
        type: "error",
      });
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
        name
      );
      res.user.displayName = name;
      console.log(res);
      setAlert({
        open: true,
        msg: `Sign Up Successful. Welcome ${res.user.displayName}`,
        type: "success",
      });
      setUser(res.user);
      setValue(0);
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
      <div style={{ display: "flex" }}>
        <TextField
          variant="outlined"
          label="Enter name"
          type="email"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "70%", marginRight: "2%" }}
          fullWidth
        ></TextField>
        <TextField
          variant="outlined"
          label="Enter email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        ></TextField>
      </div>

      <TextField
        variant="outlined"
        label="Enter password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      ></TextField>
      <TextField
        variant="outlined"
        label="Confirm password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
      ></TextField>
      <Button
        variant="contained"
        size="large"
        style={{ backgroundColor: "#c208f4", color: "white" }}
        onClick={handleSubmit}
      >
        Signup
      </Button>
    </Box>
  );
};

export default Signup;
