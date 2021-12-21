import {
  Container,
  createTheme,
  LinearProgress,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { CoinList } from "../config/api";
import { CryptoState } from "../CryptoContext";
import { numberWithCommas } from "./Banner/Carousel";

const useStyles = makeStyles({
  row: {
    backgroundColor: "#171717",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#131111",
    },
    fontFamily: "Montserrat",
  },
  pagination: {
    "& .MuiPaginationItem-root": {
      color: "#c208f4",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
    type: "dark",
  },
});

const CoinsTable = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  const [page, setPage] = useState(1);
  const { currency, symbol } = CryptoState();
  const history = useHistory();

  const classes = useStyles();

  const fetchCoins = async () => {
    const { data } = await axios.get(CoinList(currency));
    // console.log(data);
    setCoins(data);
    setLoading(false);
  };

  const handleSearch = () => {
    const searchCoins = coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
    // console.log(searchCoins);
    return searchCoins;
  };

  useEffect(() => {
    fetchCoins();
  }, [currency]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: 18, fontFamily: "Montserrat" }}
        >
          {" "}
          Cryptocurrency Prices by Market Cap
        </Typography>
        <TextField
          label="Search For a Crypto Currency..."
          variant="outlined"
          style={{ marginBottom: 20, width: "100%" }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TableContainer component={Paper}>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "#c208f4" }} />
          ) : (
            <Table aria-label="simple table">
              <TableHead style={{ backgroundColor: "#c208f4" }}>
                <TableRow>
                  {["Coin", "Price", "1D Change", "Market Cap"].map(
                    (tableHead) => {
                      return (
                        <TableCell
                          style={{
                            color: "white",
                            fontWeight: "700",
                            fontFamily: "Montserrat",
                          }}
                          key={tableHead}
                          align={tableHead === "Coin" ? "left" : "right"}
                        >
                          {tableHead}
                        </TableCell>
                      );
                    }
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {handleSearch()
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((row) => {
                    const profit = row.price_change_percentage_24h > 0;
                    return (
                      <TableRow
                        onClick={() => history.push(`/coins/${row.id}`)}
                        className={classes.row}
                        key={row.name}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            display: "flex",
                            gap: 15,
                          }}
                        >
                          <img
                            src={row?.image}
                            alt={row.name}
                            height="50"
                            style={{ marginBottom: 10 }}
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontSize: 22,
                              }}
                            >
                              {row.symbol}
                            </span>
                            <span style={{ color: "darkgrey" }}>
                              {row.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          {symbol}{" "}
                          {numberWithCommas(row.current_price.toFixed(2))}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                            fontWeight: 500,
                          }}
                        >
                          {profit && "+"}
                          {row.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell align="right">
                          {symbol}{" "}
                          {numberWithCommas(
                            row.market_cap.toString().slice(0, -6)
                          )}{" "}
                          <strong> M</strong>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <Pagination
          style={{
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          count={parseInt((handleSearch().length / 10).toFixed(0))}
          classes={{ ul: classes.pagination }}
          onChange={(e, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
    </ThemeProvider>
  );
};

export default CoinsTable;
