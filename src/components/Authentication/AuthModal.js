import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { AppBar, Box, Button, Tab, Tabs } from "@material-ui/core";
import Login from "./Login";
import Signup from "./Signup";
import GoogleButton from "react-google-button";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { CryptoState } from "../../CryptoContext";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: 450,
    [theme.breakpoints.down("sm")]: {
      width: 400,
    },
    backgroundColor: "#171717",
    color: "white",
    borderRadius: 10,
  },
  google: {
    padding: 24,
    paddingTop: 0,
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    gap: 20,
    fontSize: 20,
  },
}));

export default function AuthModal() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = useState(0);

  const { setAlert } = CryptoState();

  const googleProvider = new GoogleAuthProvider();
  const signWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        setAlert({
          open: true,
          msg: `Sign Up Successful. Welcome ${res.user.displayName}`,
          type: "success",
        });

        handleClose();
      })
      .catch((error) => {
        setAlert({
          open: true,
          message: error.message,
          type: "error",
        });
        return;
      });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant="outlined"
        style={{
          width: 85,
          height: 40,
          marginLeft: 15,
          color: "white",
          backgroundColor: "#c208f4",
        }}
        onClick={handleOpen}
      >
        Login
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <AppBar
              position="static"
              style={{
                backgroundColor: "transparent",
                color: "white",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                style={{ borderRadius: 10 }}
              >
                <Tab label="Login" />
                <Tab label="Sign Up" />
              </Tabs>
            </AppBar>
            {value === 0 && <Login handleClose={handleClose} />}
            {value === 1 && <Signup setValue={setValue} />}
            <Box className={classes.google}>
              <span style={{ fontFamily: "sans-serif" }}>OR</span>
              <GoogleButton
                onClick={signWithGoogle}
                style={{
                  width: "100%",
                  outline: "none",
                  backgroundColor: "#1c1c1c",
                  borderRadius: 10,
                }}
              />
            </Box>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
