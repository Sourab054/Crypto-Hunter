import { makeStyles } from "@material-ui/core";
import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import CoinPage from "./routes/CoinPage";
import HomePage from "./routes/HomePage";
import Alert from "./components/Alert";

const useStyles = makeStyles(() => ({
  App: {
    backgroundColor: "#171717",
    color: "#fff",
    minHeight: "100vh",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header />
        <Route path="/" component={HomePage} exact />
        <Route path="/coins/:id" component={CoinPage} exact />
      </div>
      <Alert />
    </BrowserRouter>
  );
}

export default App;
