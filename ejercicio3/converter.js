class Currency {
    constructor(code, name) {
        this.code = code;
        this.name = name;
    }
}

class CurrencyConverter {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
        this.currencies = [];
    }

    async getCurrencies(){

        try{
            const response = await fetch(`${this.apiUrl}/currencies`);
            const data = wait response.json();
            this.currencies = Object.entries(data).map(([code, name])=> new Currency(code,name));
        } catch (error) {

        console.error("Error al obtener las monedas:",error);
        return null;
            
        }
    }

    async convertCurrency (amount, fromCurrency, toCurrency) {
        if (fromCurrency.code === toCurrency, toCurrency) {
            return amount;
        }

    }

    try {
        const response = awite fetch(`${this.apiUrl}/lastest?amoun=${amount}&to=${toCurrency.code}`);
        const data = await response.json();
        return data.rates[toCurrency.code];

    } catch (error) {
        console.error("Error al convertir la moneda", error);
        return null;

    }

    async getExchangeRateDifference(fromCurrency, toCurrency){
        
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const todayStr = today.toISOString().split('T')[0];

        try {
            const todayRespons = await fetch(`{this.apiUrl}/${todayStr}?from=${fromCurrency.code}&to=${toCurrency.code}`);
            const todayData = await todayResponse.json();

            const yesterdayResponse = await fetch(`${this.apiUrl}/${yesterdayStr}?from=${fromCurrency.code}&to=${toCurrency.code}`);
            const yesterdayData = await yesterdayResponse.json();

            const todayRate = todayData.rates[toCurrency.code];
            const yesterdayRate = yesterdayData.rates[toCurrency.code];

            return todayRate - yesterdayRate;
        } catch (error) {
            console.error("Error al obtener la diferencia en la tasa de cambio:", error);
            return null;
        }
    }
}


document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("conversion-form");
    const resultDiv = document.getElementById("result");
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");
    const rateDifferenceBtn = document.getElementById("rate-difference-btn");
    const differenceDiv = document.getElementById("difference");


    const converter = new CurrencyConverter("https://api.frankfurter.app");

    await converter.getCurrencies();
    populateCurrencies(fromCurrencySelect, converter.currencies);
    populateCurrencies(toCurrencySelect, converter.currencies);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const amount = document.getElementById("amount").value;
        const fromCurrency = converter.currencies.find(
            (currency) => currency.code === fromCurrencySelect.value
        );
        const toCurrency = converter.currencies.find(
            (currency) => currency.code === toCurrencySelect.value
        );

        const convertedAmount = await converter.convertCurrency(
            amount,
            fromCurrency,
            toCurrency
        );

        if (convertedAmount !== null && !isNaN(convertedAmount)) {
            resultDiv.textContent = `${amount} ${
                fromCurrency.code
            } son ${convertedAmount.toFixed(2)} ${toCurrency.code}`;
        } else {
            resultDiv.textContent = "Error al realizar la conversión.";
        }
    });


    rateDifferenceBtn.addEventListener("click", async () => {
        const fromCurrency = converter.currencies.find(
            (currency) => currency.code === fromCurrencySelect.value
        );

        const toCurrency = converter.currencies.find(
            (currency) => currency.code === toCurrencySelect.value
        );

        const difference = await converter.getExchangeRateDifference(
            fromCurrency,
            toCurrency
        );

        if (difference !== null && !isNaN(difference)) {
            differenceDiv.textContent = `La diferencia en la tasa de cambio entre hoy y ayer es ${difference.toFixed(4)} ${toCurrency.code}.`;
        } else {
            differenceDiv.textContent = "Error al obtener la diferencia en la tasa de cambio.";
        }
    });

    function populateCurrencies(selectElement, currencies) {
        if (currencies) {
            currencies.forEach((currency) => {
                const option = document.createElement("option");
                option.value = currency.code;
                option.textContent = `${currency.code} - ${currency.name}`;
                selectElement.appendChild(option);
            });
        }
    }
});
