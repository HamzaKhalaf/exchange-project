import axios from "axios";
import { subDays, format } from 'date-fns'
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3 });

export const getCurrenciesExchangeRates = () => {
    return axios.get(`https://api.exchangerate.host/latest?&base=USD`).then(res => res.data)
}

export const getCurrenciesRatesHistory = (currencyFrom, currencyTo, days) => {
    const endDate = format(new Date(), "yyyy-MM-dd")
    const startDate = format(subDays(new Date(), Number(days)), "yyyy-MM-dd")
    return axios.get(`https://api.exchangerate.host/timeseries?start_date=${startDate}&end_date=${endDate}&base=${currencyFrom}&symbols=${currencyTo}`).then(res => res.data)
}
