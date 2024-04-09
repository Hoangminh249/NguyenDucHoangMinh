import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import axios from "axios";

const BASE_URL = "https://interview.switcheo.com";

function App() {
  const [currencies, setCurrencies] = useState([]);

  const [fromCurrency, setFromCurrency] = useState("");

  const [toCurrency, setToCurrency] = useState("");

  const [amount, setAmount] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [swappedResult, setSwappedResult] = useState("");

  const fetchCurrencies = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/prices.json`);
      if (res.status === 200) {
        setCurrencies(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleFromCurrencyChange = (event) => {
    setFromCurrency(event.target.value);
  };

  const handleToCurrencyChange = (event) => {
    setToCurrency(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform validation
    if (!fromCurrency || !toCurrency || !amount) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (amount < 0) {
      setErrorMessage("Please enter number greater than 0 ");
      setAmount("");
      return;
    }

    const fromCurrencyPrice = currencies.find(
      (currency) => currency.currency === fromCurrency
    )?.price;
    const toCurrencyPrice = currencies.find(
      (currency) => currency.currency === toCurrency
    )?.price;

    // Check if the prices are available
    if (!fromCurrencyPrice || !toCurrencyPrice) {
      setErrorMessage(
        "Exchange rate information is not available for selected currencies."
      );
      return;
    }

    // Calculate exchange rate
    const exchangeRate = toCurrencyPrice / fromCurrencyPrice;

    // Calculate swapped amount
    const swappedAmount = parseFloat(amount) * exchangeRate;

    setSwappedResult(swappedAmount.toFixed(2) + " " + toCurrency);
    setAmount("");
    setErrorMessage("");
  };

  return (
    <Stack
      direction={"column"}
      gap={2}
      alignItems="center"
      justifyContent={"center"}
    >
      <Typography variant="h4">Currency Converter</Typography>
      <form
        onSubmit={handleSubmit}
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <Stack
          direction={"row"}
          justifyContent="space-between"
          gap={2}
          alignItems="center"
        >
          <FormControl fullWidth variant="outlined">
            <InputLabel id="from-currency-label">From Currency</InputLabel>
            <Select
              labelId="from-currency-label"
              id="from-currency"
              value={fromCurrency}
              onChange={handleFromCurrencyChange}
              label="From Currency"
            >
              {currencies.map((item, index) => (
                <MenuItem key={index} value={item.currency}>
                  {item.currency}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ArrowCircleRightIcon width={24} height={24} />

          <FormControl fullWidth variant="outlined">
            <InputLabel id="to-currency-label">To Currency</InputLabel>
            <Select
              labelId="to-currency-label"
              id="to-currency"
              value={toCurrency}
              onChange={handleToCurrencyChange}
              label="To Currency"
            >
              {currencies.map((item, index) => (
                <MenuItem key={index} value={item.currency}>
                  {item.currency}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <TextField
          label="Amount"
          variant="outlined"
          type="number"
          value={amount}
          onChange={handleAmountChange}
          margin="normal"
          fullWidth
        />
        {errorMessage && (
          <Typography variant="body2" color="error" gutterBottom>
            {errorMessage}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
        >
          Swap
        </Button>
      </form>

      {swappedResult && (
        <Typography variant="h6" color="green">
          Result: {swappedResult}
        </Typography>
      )}
    </Stack>
  );
}

export default App;
