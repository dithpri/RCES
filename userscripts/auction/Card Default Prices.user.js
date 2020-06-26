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

/*
 * Copyright (c) 2019-2020 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

(function () {
	"use strict";
	// Change values here:
	const default_prices = {
		common: {ask: 0.01, bid: 0.01},
		uncommon: {ask: 0.05, bid: 0.05},
		rare: {ask: 0.1, bid: 0.1},
		"ultra-rare": {ask: 0.2, bid: 0.2},
		epic: {ask: 0.5, bid: 0.5},
		legendary: {ask: 1.0, bid: 1.0},
	};

	const rarity = document
		.querySelector(".deckcard-season-list-card-selected > .deckcard-token")
		.textContent.toLowerCase();

	document.querySelector('input[name="auction_ask"').value = default_prices[
		rarity
	].ask.toFixed(2);
	document.querySelector('input[name="auction_bid"').value = default_prices[
		rarity
	].bid.toFixed(2);
})();
