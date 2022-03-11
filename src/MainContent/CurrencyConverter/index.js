import { useState, useCallback, useEffect, useMemo } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Autocomplete,
  Divider,
  LinearProgress,
} from "@mui/material";
import { CompareArrows } from "@mui/icons-material/";
import { format } from 'date-fns'
import { useLocation } from "react-router-dom";

import ExchangeHistory from "./ExchangeHistory";
import {
  getCurrenciesExchangeRates,
  getCurrenciesRatesHistory,
} from "../../utils/apiActions";

const CurrencyConverter = () => {
  const { search } = useLocation();
  const getParams = useCallback(() => {
    return new URLSearchParams(search);
  }, [search])

  const urlParams = useMemo(getParams, [getParams])

  const [amount, setAmount] = useState(urlParams.get("amount") || "500");
  const [busy, setBusy] = useState(true);
  const [days, setDays] = useState('7');

  const initFrom = urlParams.get("from") || "EUR"
  const initTo = urlParams.get("to") || "USD"

  const [exchangeRates, setExchangeRates] = useState([
    { currency: initFrom },
    { currency: initTo },
  ])

  const [currencies, setCurrencies] = useState({
    from: { currency: initFrom },
    to: { currency: initTo },
  });

  const [results, setResults] = useState({
    exchangeRateHistory: [],
    to: { rate: '1', currency: initFrom, amount: "1"},
    from: { rate: '1', currency: initTo, amount: "1"},
  });
  
  const calculateExchangeRate = (value, from, to) => {
    return ((Number(value) / from.rate) * to.rate).toLocaleString();
  };

  const mapExchangeHistory = useCallback((historyData) => {
    const newExchangeHistory = []
    Object.entries(historyData).forEach((entry) => {
      const [date, symbols] = entry
      if (symbols[currencies.to.currency]) {
        newExchangeHistory.push({
          date: format(new Date(date), 'dd/MM/yyyy'),
          rate: symbols[currencies.to.currency]
        });
      }
    })

    return newExchangeHistory.reverse()
  } , [currencies.to.currency])

  const handleConvert = useCallback((amount, from, to, exchangeRateHistory) => {
    setResults({
      exchangeRateHistory: mapExchangeHistory(exchangeRateHistory),
      from: { rate: calculateExchangeRate('1', from, to), currency: from.currency, amount: Number(amount).toLocaleString() },
      to: { rate: calculateExchangeRate('1', to, from), currency: to.currency, amount: calculateExchangeRate(amount, from, to) },
    });
  }, [mapExchangeHistory])


  // init component data
  useEffect(() => {
    Promise.all([
      getCurrenciesExchangeRates().then(data => data.rates),
      getCurrenciesRatesHistory(currencies.from.currency, currencies.to.currency, days).then(data => data.rates),
    ]).then((res) => {
      const [newExchangeRates, exchangeRateHistory] = res;
      const from = {
        currency: currencies.from.currency,
        rate: newExchangeRates[currencies.from.currency]
      };

      const to = {
        currency: currencies.to.currency,
        rate: newExchangeRates[currencies.to.currency]
      };

      const mappedRates = Object.entries(newExchangeRates).map((entry) => {
        const [key, value] = entry;

        return {
          currency: key,
          rate: value.toString()
        }
      });

      setCurrencies({ from, to });
      setExchangeRates(mappedRates)
      handleConvert(amount, from, to, exchangeRateHistory)
      setBusy(false);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateAmountCB = useCallback((e) => {
    setAmount(e.target.value);
  }, []);

  const updateCurrenciesCB = useCallback(
    (field) => (_, value) => {
      setCurrencies((prevState) => {
        return {
          ...prevState,
          [field]: value,
        };
      });
    },
    []
  );

  const swapCurrenciesCB = useCallback(() => {
    setCurrencies((prevState) => {
      return {
        to: prevState.from,
        from: prevState.to,
      };
    });
  }, []);

  const handleConvertCB = useCallback(
    (e) => {
      e.preventDefault();
      setBusy(true);
      const { from, to } = currencies;

      const convertHistory = JSON.parse(localStorage.getItem("convertHistory")) || [];
      convertHistory.push({
        date: new Date(),
        amount,
        from: from.currency,
        to: to.currency, 
      });
      localStorage.setItem("convertHistory", JSON.stringify(convertHistory))

      getCurrenciesRatesHistory(from.currency, to.currency, days).then(exchangeRateHistory => {
        handleConvert(amount, from, to, exchangeRateHistory.rates);
        setBusy(false);
      })
    },
    [amount, currencies, days, handleConvert]
  );

  const handleDaysChangeCB = useCallback((_, value) => {
    setDays(value);
    setBusy(true);

    getCurrenciesRatesHistory(currencies.from.currency, currencies.to.currency, value).then(exchangeRateHistory => {
      const { from, to } = currencies;
      
      handleConvert(amount, from, to, exchangeRateHistory.rates);
      setBusy(false);
    })
  }, [amount, currencies, handleConvert])

  return (
    <Box marginTop="20px">
      <Typography variant="h3" sx={{ fontWeight: "bold" }}>I want to Convert</Typography>
      {busy && <LinearProgress />}
      <form onSubmit={handleConvertCB}>
        <Box display="flex" justifyContent="space-between" marginTop="20px">
          <TextField
            label="Amount"
            onChange={updateAmountCB}
            type="number"
            autoComplete="off"
            value={amount}
            variant="standard"
            required
            disabled={busy}
          />
          <Autocomplete
            value={currencies.from}
            onChange={updateCurrenciesCB("from")}
            options={exchangeRates}
            getOptionLabel={(option) => option.currency}
            isOptionEqualToValue={(option, value) =>
              option.currency === value.currency
            }
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField required variant="standard" {...params} label="From" />
            )}
            disabled={busy}
          />
          <Button
            disabled={busy}
            variant="contained"
            color="info"
            onClick={swapCurrenciesCB}
          >
            <CompareArrows color="primary" sx={{ pointerEvents: "none" }} />
          </Button>

          <Autocomplete
            value={currencies.to}
            onChange={updateCurrenciesCB("to")}
            options={exchangeRates}
            getOptionLabel={(option) => option.currency}
            isOptionEqualToValue={(option, value) =>
              option.currency === value.currency
            }
            sx={{ width: 300 }}
            disabled={busy}
            renderInput={(params) => (
              <TextField required variant="standard" {...params} label="To" />
            )}
          />
          <Button disabled={busy} variant="contained" type="sumbit">
            CONVERT
          </Button>
        </Box>
      </form>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        marginTop="20px"
        alignItems="center"
      >
        <Box display="flex">
          <Typography variant="h3">{results.from.amount} {results.from.currency} =&nbsp;</Typography>
          <Typography variant="h3" sx={{ fontWeight: "bold" }} color="secondary">
            {results.to.amount} {results.to.currency}
          </Typography>
        </Box>
        <Box margin="25px 0">
          <Typography>1 {results.from.currency} = {results.from.rate} {results.to.currency}</Typography>
          <Typography>1 {results.to.currency} = {results.to.rate} {results.from.currency}</Typography>
        </Box>
      </Box>
      <Divider />
      <ExchangeHistory historyData={results.exchangeRateHistory} days={days} setDays={handleDaysChangeCB} busy={busy}/>
    </Box>
  );
};

export default CurrencyConverter;
