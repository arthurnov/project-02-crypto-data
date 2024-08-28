"use strict";

(async () => {

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
    let moreInfo = [];


    searchButton.addEventListener("click", () => search(searchTextField.value));
    searchTextField.addEventListener("input", () => search(searchTextField.value));

    // if first page load - get coins from api
    if (JSON.parse(localStorage.getItem("coins-list")) === null) {
        //localStorage.setItem("coins-list", JSON.stringify([]));
        await getData();
        drawCards(loadData());
    } else {
        drawCards(loadData());
    };


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
        if (Date.now() - timestamp > 120000) {
            getData();
            timestamp = Date.now();
        }
        const results = searchData(queryString);
        drawCards(results, queryString);
    }

    // -------------------- DATA MANIPULATION --------------------

    // save data to local storage
    function saveData(data) {
        localStorage.setItem("coins-list", JSON.stringify(data));
    }

    // save coin specific data local storage
    function saveCoinData(data) {
        let coins = (localStorage.getItem("coin-data-list") === null) ? new Map([]) : new Map(JSON.parse(localStorage.getItem("coin-data-list")));
        coins.set(data["id"], data);
        localStorage.setItem("coin-data-list", JSON.stringify([...coins]));
    }

    // load data from local storage
    function loadData() {
        return JSON.parse(localStorage.getItem("coins-list"));
    }

    // load coin specific data from local storage
    function loadCoinData(id) {
        return new Map(JSON.parse(localStorage.getItem("coin-data-list"))).get(id);
    }

    // get data from api
    async function getData() {
        const options = { method: 'GET', headers: { accept: 'application/json' } }; // copy-paste code example from coingecko
        await fetch('https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&vs_currency=usd#', options)
            .then(response => response.json())
            .then(response => saveData(response))
            .catch(err => console.error(err));
    }

    // get coin specific data from api
    async function getCoinData(id) {
        const options = { method: 'GET', headers: { accept: 'application/json' } }; // copy-paste code example from coingecko
        await fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false?tickers=false&community_data=false&developer_data=false&sparkline=false`, options)
            .then(response => response.json())
            .then(response => saveCoinData(response))
            .catch(err => console.error(err));
    }

    // -------------------- HOMEPAGE HELPERS --------------------

    // attach evenListeners to all the "more info" buttons
    function getInfoButtons() {
        moreInfo = document.getElementsByClassName("coin-info-button");
        for (let item of moreInfo) {
            item.addEventListener("click", () => showMoreInfo(item.id))
        }
    }

    async function showMoreInfo(id) {
        let moreInfoList = new Map((localStorage.getItem("more-info-list") === null) ? [] : JSON.parse(localStorage.getItem("more-info-list")));
        // if id not in list or its been more than 2 minutes since last api call for id - call api.
        if (!moreInfoList.has(id) || Date.now() - moreInfoList.get(id) > 120000) {
            moreInfoList.set(id, Date.now());
            await getCoinData(id);
        }
        localStorage.setItem("more-info-list", JSON.stringify([...moreInfoList]));

        const coin = loadCoinData(id);

        console.log(coin);
        console.log("image link: ", coin["image"]["large"]);
        console.log("coin name: ", coin["name"]);
        console.log("USD: ", coin["market_data"]["current_price"]["usd"]);
        console.log("EUR: ", coin["market_data"]["current_price"]["eur"]);
        console.log("ILS: ", coin["market_data"]["current_price"]["ils"]);
    }

    // -------------------- HOMEPAGE MANIPULATION --------------------

    // "home" page
    function drawCards(data, queryString) {
        document.title = "Crypto-Graph - Home";
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
            <div class="coin-info"><button class="coin-info-button" id="${element["id"]}">More Info</button></div>
            <input type="checkbox" class="coin-check" id="${element["id"]}-check">`;
            cardsDiv.appendChild(coinDiv);
        });

        // draw results counter.
        if (queryString === "" || queryString === undefined) {
            countDiv.innerText = `Showing ${count} coins`;
        } else {
            countDiv.innerText = `Showing ${count} results for "${queryString}"`;
        }

        getInfoButtons();

    }

    // "live reports" page
    function drawGraph() {
        document.title = "Crypto-Graph - Live Reports";
        // clear screen
        mainArea.textContent = '';
    }

    // "about" page
    function drawAbout() {
        document.title = "Crypto-Graph - About";
        // clear screen
        mainArea.textContent = '';
    }

})();