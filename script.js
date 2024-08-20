"use strict";

(() => {

    const searchButton = document.getElementById("search-button");
    searchButton.addEventListener("click", () => getData());

    // create empty object in local storage in case of a read from it before data is loaded in.
    if (JSON.parse(localStorage.getItem("coins-list")) === null) {
        localStorage.setItem("coins-list", JSON.stringify([]));
    };

    // get data from api
    async function getData() {
        const options = { method: 'GET', headers: { accept: 'application/json' } }; // copy-paste code example from coingecko

        await fetch('https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&vs_currency=usd#', options)
            .then(response => response.json())
            .then(response => saveData(response))
            .catch(err => console.error(err));
    }

    // save data to local storage
    function saveData(data) {
        localStorage.setItem("coins-list", JSON.stringify(data));
    }

    // load data from local storage
    function loadData() {
        return JSON.parse(localStorage.getItem("coins-list"));
    }

    console.log(loadData());

})();

