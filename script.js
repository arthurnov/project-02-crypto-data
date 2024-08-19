"use strict";

(() => {

    const searchButton = document.getElementById("search-button"); 3
    searchButton.addEventListener("click", () => { getData("text passed") });

    if (JSON.parse(localStorage.getItem("coins-list")) === null) {
        localStorage.setItem("coins-list", JSON.stringify([]));
    };



    function getData(text) {
        const options = { method: 'GET', headers: { accept: 'application/json' } };

        fetch('https://api.coingecko.com/api/v3/coins/markets?order=market_cap_desc&vs_currency=usd#', options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err));
    }

})();

