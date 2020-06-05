// ==UserScript==
// @name         Card Default Prices
// @version      0.1
// @namespace    dithpri.RCES
// @description  Automatically inputs a default value in the ask/bid fields
// @author       dithpri
// @noframes
// @match        https://www.nationstates.net/*page=deck*/card=*
// @match        https://www.nationstates.net/*card=*/page=deck*
// @grant        none
// ==/UserScript==

// SPDX-License-Identifier: 0BSD

(function () {
    'use strict';
    // Change values here:
    const default_prices = {
        "common": { ask: 0.01, bid: 0.01 },
        "uncommon": { ask: 0.05, bid: 0.05 },
        "rare": { ask: 0.10, bid: 0.10 },
        "ultra-rare": { ask: 0.20, bid: 0.20 },
        "epic": { ask: 0.50, bid: 0.50 },
        "legendary": { ask: 1.00, bid: 1.00 }
    };

    const rarity = document.querySelector(".deckcard-season-list-card-selected > .deckcard-token").textContent.toLowerCase();

    document.querySelector("input[name=\"auction_ask\"").value = default_prices[rarity].ask.toFixed(2);
    document.querySelector("input[name=\"auction_bid\"").value = default_prices[rarity].bid.toFixed(2);

})();
