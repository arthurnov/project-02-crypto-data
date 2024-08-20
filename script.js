"use strict";

(() => {

    // SETUP TIMESTAMP HERE! THEN DATE.NOW - TIMESTEMP >= 120000 THEN GETDATA()
    let timestamp = Date.now();
    const searchButton = document.getElementById("search-button");
    const searchTextField = document.getElementById("search-textbox");
    const mainArea = document.getElementById("main-area");

    searchButton.addEventListener("click", () => search(searchTextField.value));
    searchTextField.addEventListener("input", () => search(searchTextField.value));

    // create empty object in local storage in case of a read from it before data is loaded in.
    if (JSON.parse(localStorage.getItem("coins-list")) === null) {
        //localStorage.setItem("coins-list", JSON.stringify([]));
        getData();
    };

    // get data from api
    function getData() {
        const options = { method: 'GET', headers: { accept: 'application/json' } }; // copy-paste code example from coingecko
        fetch('https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&vs_currency=usd#', options)
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

    // find coins that contain search string in coin name
    function searchData(queryString) {
        const data = loadData();
        let results = [];
        data.forEach(element => {
            if (element["name"].toLowerCase().includes(queryString.toLowerCase())) {
                let foundCoin = {};
                for (const key in element) {
                    foundCoin[key] = element[key];
                }
                results.push(foundCoin);
            }
        });
        return results;
    }

    // display search results
    function search(queryString) {
        const results = searchData(queryString);
        console.log(results);
        mainArea.textContent = '';
        mainArea.appendChild(document.createElement("div"))
    }

})();