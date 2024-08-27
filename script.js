"use strict";

(() => {

    // -------------------- INITIAL SETUP --------------------

    // timestamp to limit api calls
    let timestamp = Date.now();

    const searchButton = document.getElementById("search-button");
    const searchTextField = document.getElementById("search-textbox");
    const mainArea = document.getElementById("main-area");

    const homeLink = document.getElementById("home-link");
    homeLink.addEventListener("click", () => drawCards(loadData()));
    const liveLink = document.getElementById("live-link");
    liveLink.addEventListener("click", () => drawGraph());
    const aboutLink = document.getElementById("about-link");
    aboutLink.addEventListener("click", () => drawAbout());

    searchButton.addEventListener("click", () => search(searchTextField.value));
    searchTextField.addEventListener("input", () => search(searchTextField.value));

    // create empty object in local storage in case of a read from it before data is loaded in.
    if (JSON.parse(localStorage.getItem("coins-list")) === null) {
        //localStorage.setItem("coins-list", JSON.stringify([]));
        getData();
    };
    drawCards(loadData());

    // -------------------- SEARCH --------------------

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
        //     timestamp = Date.now();
        // }
        const results = searchData(queryString);
        drawCards(results, queryString);
    }

    // -------------------- DATA MANIPULATION --------------------

    // save data to local storage
    function saveData(data) {
        localStorage.setItem("coins-list", JSON.stringify(data));
    }

    function saveCoinData(data) {
        let coins = (localStorage.getItem("coin-data-list") === null) ? {} : localStorage.getItem("coin-data-list");

        localStorage.setItem("coin-data-list", JSON.stringify(coins));
    }

    // load data from local storage
    function loadData() {
        return JSON.parse(localStorage.getItem("coins-list"));
    }

    // get data from api
    function getData() {
        const options = { method: 'GET', headers: { accept: 'application/json' } }; // copy-paste code example from coingecko
        fetch('https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&vs_currency=usd#', options)
            .then(response => response.json())
            .then(response => saveData(response))
            .catch(err => console.error(err));
    }

    // get coin specific data from api
    // function getCoinData(id) {
    //     const options = { method: 'GET', headers: { accept: 'application/json' } }; // copy-paste code example from coingecko
    //     fetch(`https://api.coingecko.com/api/v3/coins/${id}?tickers=false&community_data=false&developer_data=false&sparkline=false`, options)
    //         .then(response => response.json())
    //         .then(response => console.log(response))
    //         .catch(err => console.error(err));
    // }

    console.log(localStorage.getItem("coin-data-list"));

    //getCoinData("bitcoin");

    // -------------------- HOMEPAGE MANIPULATION --------------------

    // "home" page
    function drawCards(data, queryString) {
        // clear screen
        mainArea.textContent = '';

        // setup results counter div
        let countDiv = document.createElement("div");
        countDiv.id = "results-div";
        mainArea.appendChild(countDiv);
        let count = 0;

        // setup coin cards div
        let cardsDiv = document.createElement("div");
        cardsDiv.id = "cards-div";
        mainArea.appendChild(cardsDiv);

        // build and "draw" coin cards
        data.forEach(element => {
            count++;
            let coinDiv = document.createElement("div");
            coinDiv.id = `${element["symbol"]}-div`;
            coinDiv.className = `coin-div`;
            coinDiv.innerHTML += `
            <div class="coin-symbol">${element["symbol"]}</div>
            <div class="coin-name">${element["name"]}</div>
            <div class="coin-info"><button>More Info</button></div>
            <input type="checkbox" class="coin-check" id="${element["symbol"]}-check">`;
            cardsDiv.appendChild(coinDiv);
        });

        // draw results counter.
        if (queryString === "" || queryString === undefined) {
            countDiv.innerText = `Showing ${count} coins`;
        } else {
            countDiv.innerText = `Showing ${count} results for "${queryString}"`;
        }
    }

    // "live reports" page
    function drawGraph() {
        // clear screen
        mainArea.textContent = '';
    }

    // "about" page
    function drawAbout() {
        // clear screen
        mainArea.textContent = '';
    }

})();