// ==UserScript==
// @name         Better Card Page Titles
// @namespace    dithpri.RCES
// @version      0.2
// @description  Descriptive titles for card pages, for easier browsing history searching.
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/miscellaneous/Better%20Card%20Page%20Titles.user.js
// @match        *.nationstates.net/page=deck*
// @match        *.nationstates.net/*/page=deck*
// @grant        none
// ==/UserScript==

const capitalize = (x) => x[0].toUpperCase() + x.slice(1);

(function () {
    "use strict";

    const urlParams = new Map(
        window.location.pathname
            .substr(1)
            .split("/")
            .map((x) => x.split("="))
    );

    let titleEx = "";

    if (document.querySelector("h2")) {
        titleEx += ` | ${document.querySelector("h2").textContent}`;
    }

    if (urlParams.has("value_deck")) {
        titleEx += ` | ${document
            .getElementById("deck-bank")
            .title.replace(/bank$/, "Deck")} (by value)`;
    } else if (urlParams.has("show_trades")) {
        titleEx += ` | ${capitalize(urlParams.get("show_trades"))}`;
    } else if (urlParams.has("card")) {
        // Check if it's a Season 4 card
        const s4CardWrapper = document.querySelector(".s4-card-wrapper a.title");
        if (s4CardWrapper) {
            const cardName = s4CardWrapper.textContent.trim();
            const seasonNumber = urlParams.get("season") || "Unknown Season";
            titleEx = ` | ${cardName} (S${seasonNumber}) ${titleEx}`;
        } else {
            // Fallback for older seasons
            const cardNameFallback = document.querySelector(".deckcard .nnameblock .nname");
            if (cardNameFallback) {
                const cardName = cardNameFallback.textContent.trim();
                const seasonNumber = document.querySelector(
                    ".deckcard-season-list-card-selected .minicard-season-number"
                )?.textContent || "Unknown Season";
                titleEx = ` | ${cardName} (S${seasonNumber}) ${titleEx}`;
            }
        }

        if (urlParams.has("finds_history")) {
            titleEx += ` | Finds history`;
        }
    }

    document.title += titleEx;
})();
