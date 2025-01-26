// ==UserScript==
// @name         Better Card Page Titles
// @namespace    dithpri.RCES
// @version      0.2.1
// @description  Descriptive titles for card pages, for easier browsing history searching.
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/miscellaneous/Better%20Card%20Page%20Titles.user.js
// @match        https://www.nationstates.net/page=deck*
// @match        https://www.nationstates.net/*/page=deck*
// @grant        none
// ==/UserScript==

const capitalize = (x) => x[0].toUpperCase() + x.slice(1);

const season = () =>
	document.querySelector(".deckcard-season-list-card-selected .minicard-season-number")?.textContent ||
	"Unknown season";

const name = () =>
	document.querySelector(".deckcard .nnameblock .nname, .s4-card-wrapper a.title")?.textContent || "Unknown card";

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
		titleEx += ` | ${document.getElementById("deck-bank").title.replace(/bank$/, "Deck")} (by value)`;
	} else if (urlParams.has("show_trades")) {
		titleEx += ` | ${capitalize(urlParams.get("show_trades"))}`;
	} else if (urlParams.has("card")) {
		titleEx = ` | ${name()} (S${season()}) ${titleEx}`;
		// ^ Prepend to titleEx, because it already contains the h2 title - which should go at the end.

		if (urlParams.has("finds_history")) {
			titleEx += ` | Finds history`;
		}
	}

	document.title += titleEx;
})();
