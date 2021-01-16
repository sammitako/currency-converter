const axios = require('axios');

// get exchagne rate
const getExchangeRate = async (fromCurrency, toCurrency) => {
    const response = await axios.get('https://api.exchangeratesapi.io/latest?base=USD');

    const rate = response.data.rates;
    const dollar = 1 / rate[fromCurrency];
    const exchangeRate = dollar * rate[toCurrency];

    if(isNaN(exchangeRate)) {
        throw new Error(`Unable to get currency ${fromCurrency} and ${toCurrency}, check your spelling`);
    }

    return exchangeRate;
}

// get countries
const getCountries = async (toCurrency) => {
    try {
        const response = await axios.get(`http://restcountries.eu/rest/v2/currency/${toCurrency}`);
        return response.data.map(country => country.name);
    } catch(error) {
        throw new Error(`Unable to get countries that use ${toCurrency}, check your spelling`);
    }
}
    

// convert currency
const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
    const countries = await getCountries(toCurrency);
    const convertedAmount = (amount * exchangeRate).toFixed(2);

    return `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}.\n
    You can use ${toCurrency} in the following countries: ${countries}`;
}

// call convert currency to get meaningful data
convertCurrency('USD', 'EUR', 10000)
    .then((message) => {
        console.log(message);
    }).catch((error) => {
        console.log(error.message); // to prevent from misspelling currency name
    })
