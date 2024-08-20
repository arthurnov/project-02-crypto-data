"use strict";

(() => {

    const searchButton = document.getElementById("search-button");
    const searchTextbox = document.getElementById("search-textbox");
    searchButton.addEventListener("click", () => searchData(searchTextbox.value));
    searchTextbox.addEventListener("input", () => searchData(searchTextbox.value));

    // create empty object in local storage in case of a read from it before data is loaded in.
    if (JSON.parse(localStorage.getItem("coins-list")) === null) {
        //localStorage.setItem("coins-list", JSON.stringify([]));
        getData();
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

    // find coins that contain search string in coin name
    function searchData(searchString) {
        const data = loadData();
        let results = [];
        data.forEach(element => {
            if (element["name"].toLowerCase().includes(searchString.toLowerCase())) {
                let foundCoin = {};
                for (const key in element) {
                    foundCoin[key] = element[key];
                }
                results.push(foundCoin);
            }
        });
        console.log(results);
        //return results;
    }

})();

