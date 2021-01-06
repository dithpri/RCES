// ==UserScript==
// @name         Tab Card Name
// @namespace    dithpri.RCES
// @version      0.1
// @description  Include the card name and season in the tab title, for easier browsing history searching.
// @author       dithpri
// @match        https://www.nationstates.net/page=deck/card=*
// @grant        none
// ==/UserScript==

(function () {
	"use strict";
	document.title += ` | ${
		document.querySelector(".deckcard .nnameblock .nname").textContent
	} (S${
		document.querySelector(
			".deckcard-season-list-card-selected .minicard-season-number"
		).textContent
	})`;
})();
