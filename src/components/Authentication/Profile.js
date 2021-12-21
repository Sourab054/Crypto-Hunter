import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import { Avatar } from "@material-ui/core";
import { CryptoState } from "../../CryptoContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { numberWithCommas } from "../Banner/Carousel";
import { doc, setDoc } from "firebase/firestore";
import { AiFillDelete } from "react-icons/ai";

const useStyles = makeStyles({
  container: {
    width: 350,
    padding: 25,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    fontFamily: "Montserrat",
    backgroundColor: "#424242",
    color: "#fff",
  },
  profile: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    height: "92%",
  },
  logout: {
    height: "8%",
    width: "100%",
    color: "white",
    backgroundColor: "#c208f4",
    marginTop: 20,
    "&:hover": {
      color: "#171717",
    },
  },
  picture: {
    width: 200,
    height: 200,
    cursor: "pointer",
    backgroundColor: "#c208f4",
    objectFit: "contain",
  },
  root: {
    flex: 1,
    width: "100%",
    backgroundColor: "gray",
    borderRadius: 10,
    padding: 15,
    paddingTop: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    overflowY: "scroll",
  },
  coin: {
    padding: 10,
    borderRadius: 5,
    color: "black",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#c208f4",
    boxShadow: "0 0 3px black",
  },
});

export default function Profile() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });

  const { user, setAlert, watchlist, coins, symbol } = CryptoState();

  const logOut = () => {
    signOut(auth);
    setAlert({
      open: true,
      type: "success",
      msg: "Logout Successfull!",
    });

    toggleDrawer();
  };

  const removeFromWatchlist = async (coin) => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist.filter((wish) => wish !== coin?.id) },
        { merge: true }
      );

      setAlert({
        open: true,
        msg: `${coin.name} removed from the Watchlist`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        msg: error.message,
        type: "error",
      });
    }
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar
            style={{
              height: 38,
              width: 38,
              marginLeft: 15,
              cursor: "pointer",
              backgroundColor: "#c208f4",
            }}
            src={user ? user?.photoURL : ""}
            alt={user ? user?.displayName || user?.email : ""}
            onClick={toggleDrawer(anchor, true)}
          />

          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div className={classes.container}>
              <div className={classes.profile}>
                <Avatar
                  className={classes.picture}
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                  onClick={toggleDrawer(anchor, true)}
                />
                <span
                  style={{
                    width: "100%",
                    fontSize: 25,
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  {user.displayName ? user.displayName : user.email}
                </span>
                <div className={classes.root}>
                  <span style={{ fontSize: 15, textShadow: "0 0 5px black" }}>
                    Watchlist
                  </span>
                  {coins.map((coin) => {
                    if (watchlist.includes(coin.id)) {
                      return (
                        <div key={coin.name} className={classes.coin}>
                          <span>{coin.name}</span>
                          <span style={{ display: "flex", gap: 8 }}>
                            {symbol}{" "}
                            {numberWithCommas(coin.current_price.toFixed(2))}
                            <AiFillDelete
                              style={{ cursor: "pointer" }}
                              fontSize="16"
                              onClick={() => removeFromWatchlist(coin)}
                            />
                          </span>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              <Button
                variant="contained"
                className={classes.logout}
                onClick={logOut}
              >
                Sign Out
              </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
