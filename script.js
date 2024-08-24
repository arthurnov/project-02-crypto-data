"use strict";

(() => {

    // timestamp to limit api calls
    let timestamp = Date.now();

    const searchButton = document.getElementById("search-button");
    const searchTextField = document.getElementById("search-textbox");
    const mainArea = document.getElementById("main-area");

    searchButton.addEventListener("click", () => search(searchTextField.value));
    searchTextField.addEventListener("input", () => search(searchTextField.value));

    //drawCards(loadData());

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
            if (element["name"].toLowerCase().includes(queryString.toLowerCase()) || element["symbol"].toLowerCase().includes(queryString.toLowerCase())) {
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
        // if (Date.now() - timestamp > 120000) {
        //     getData();
        // }
        const results = searchData(queryString);
        drawCards(results, queryString);
    }

    function drawCards(data, queryString) {
        // clear screen
        mainArea.textContent = '';

        // results counter div
        let countDiv = document.createElement("div");
        countDiv.id = "results-div";
        mainArea.appendChild(countDiv);
        let count = 0;

        // coin cards div
        let cardsDiv = document.createElement("div");
        cardsDiv.id = "cards-div";
        mainArea.appendChild(cardsDiv);

        // coin cards
        data.forEach(element => {
            count++;
            let coinDiv = document.createElement("div");
            coinDiv.id = `${element["symbol"]}-div`;
            coinDiv.className = `coin-div`;
            coinDiv.innerHTML += `<span class="coin-symbol">${element["symbol"]}</span>
            <span class="coin-name">${element["name"]}</span>
            <span class="coin-info"><button>More Info</button></span>`;
            cardsDiv.appendChild(coinDiv);
        });

        countDiv.innerText = `Showing ${count} results for "${queryString}"`;
    }

})();