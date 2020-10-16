// ==UserScript==
// @name         Junk Confirmation Remover
// @namespace    dithpri.RCES
// @version      0.1
// @description  Remove card junk confirmation alert
// @author       dithpri
// @match        https://www.nationstates.net/*page=deck*
// @grant        none
// ==/UserScript==

/*
 * Copyright (c) 2020 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

const shouldConfirm = (rarity, season, junkValue, marketValue, bid) => {
	// EDIT HERE
	// Note that marketValue and bid are *only* available when opening a pack,
	// they can't be checked on the deck page
	// Examples:
	// Confirm junking epics and legendariess
	if (rarity == "legendary" || rarity == "epic") {
		return true;
	}
	// Confirm junking uncommons
	if (rarity == "uncommon") {
		return true;
	}
	// Confirm junking cards with MV > 5
	if (marketValue > 0.1) {
		return true;
	}
	// Confirm junking cards with a bid higher than JV
	if (bid > junkValue) {
		return true;
	}
	// Confirm junking cards with a bid equal to at least 2×JV
	if (bid >= 2 * junkValue) {
		return true;
	}
	// Don't require confirmation for junking rares
	if (rarity == "rare") {
		return false;
	}
	// Confirm junking S1 cards
	if (season == 1) {
		return true;
	}
	// Require confirmation on junking anything
	return true;
};

/********************************/

function addOpt(...args) {
	return args.filter((x) => x).reduce((acc, cur) => `${acc} ${cur}`, "");
}

(function () {
	"use strict";

	document.querySelectorAll(".deckcard-junk-button").forEach((junkButton) => {
		const rarity = junkButton.dataset.rarity;
		const junkValue = Number(junkButton.dataset.junkprice);
		const season = Number(junkButton.dataset.season);

		const marketValueText = junkButton
			.closest(".deckcard-flag")
			.querySelector(".deckcard-card-mv")?.textContent;
		const bidText = junkButton
			.closest(".deckcard-flag")
			.querySelector(".deckcard-card-buyers")?.textContent;

		const marketValue =
			Number(marketValueText?.replaceAll(/[^0-9.]/g, "")) || 0.0;
		const bid = Number(bidText?.replaceAll(/[^0-9.]/g, "")) || 0.0;

		console.log(shouldConfirm(rarity, junkValue, marketValue, bid), [
			rarity,
			junkValue,
			marketValue,
			bid,
		]);
		const enableConfirmation = shouldConfirm(
			rarity,
			junkValue,
			marketValue,
			bid
		);
		if (enableConfirmation === true) {
			console.log(marketValue, bid);
			junkButton.dataset.rarity = junkButton.dataset.rarity.toUpperCase();
			junkButton.dataset.rarity += addOpt(marketValueText, bidText);
		} else if (enableConfirmation === false) {
			junkButton.dataset.rarity = "common";
		}
	});
})();
