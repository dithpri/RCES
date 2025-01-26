// ==UserScript==
// @name         Junk Confirmation Changer
// @namespace    dithpri.RCES
// @version      0.5
// @description  Change conditions for the junk confirmation alert
// @author       dithpri
// @match        https://www.nationstates.net/*page=deck*
// @grant        none
// ==/UserScript==

/*
 * Copyright (c) 2020-2022 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

const shouldConfirm = ({rarity, season, junkValue, name, id, region, badges, marketValue, bid}) => {
	// EDIT HERE
	// IMPORTANT: Note that marketValue and bid are *only* available when
	// opening a pack, they can't be checked on the deck page.
	// If they're not displayed, they'll be set to NaN.

	// This is a sane default config, examples follow
	// Will ask for confirmation when trying to junk a legendary,
	// cards with >= 5 MV and cards with bids over JV
	if (rarity == "legendary") {
		return true;
	}
	if (marketValue >= 5) {
		return true;
	}
	if (bid > junkValue) {
		return true;
	}
	return false; // don't require confirmation for anything else

	// Examples:
	// Confirm junking epics and legendariess
	//if (rarity == "legendary" || rarity == "epic") {
	//	return true;
	//}
	// Confirm junking uncommons
	//if (rarity == "uncommon") {
	//	return true;
	//}
	// Confirm junking cards with MV > 5
	//if (marketValue > 0.1) {
	//	return true;
	//}
	// Confirm junking cards with a bid higher than JV
	//if (bid > junkValue) {
	//	return true;
	//}
	// Confirm junking cards with a bid equal to at least 2×JV
	//if (bid >= 2 * junkValue) {
	//	return true;
	//}
	// Don't require confirmation for junking rares
	//if (rarity == "rare") {
	//	return false;
	//}
	// Confirm junking S1 cards
	//if (season == 1) {
	//	return true;
	//}
	// Confirm junking ex-nations (they have no region)
	//if (region == undefined) {
	//  return true;
	//}
	// Confirm junking cards from The South Pacific
	//if (region == "the_south_pacific") {
	//  return true;
	//}
	// Require confirmation on junking anything
	//return true;
	// There's also the badges parameter for more advanced users.
	// It's an array of badge names - the name is the image file's name
	// (or admin/delegate/wa/sec-gen/class for the non-image badges).
};

/********************************/

function canonicalize(name) {
	return name.toLowerCase().replaceAll(" ", "_");
}

function addOpt(...args) {
	return args.filter((x) => x).reduce((acc, cur) => `${acc} ${cur}`, "");
}

(function () {
	"use strict";

	document.querySelectorAll(".deckcard").forEach((card) => {
		const junkButton = card.querySelector(".deckcard-junk-button");
		const rarity = junkButton.dataset.rarity;
		const id = Number(junkButton.dataset.cardid);
		const junkValue = Number(junkButton.dataset.junkprice);
		const season = Number(junkButton.dataset.season);

		const name = canonicalize(
			card.querySelector(".deckcard .nnameblock .nname, .s4-card-wrapper a.title").textContent
		);
		const region = canonicalize(card.querySelector(".rlink").textContent);

		const badges = [...card.querySelectorAll("img.trophy")]
			.map((x) => x.src.replace(/^.*\/images\/trophies\/(.*)\.png$/, "$1"))
			.concat([...card.querySelectorAll(".badge")].map((x) => x.textContent.toLowerCase().trim()));

		const marketValueText = card.querySelector(".deckcard-card-mv")?.textContent;
		const bidText = card.querySelector(".deckcard-card-buyers")?.textContent;

		const marketValue = Number(marketValueText?.replaceAll(/[^0-9.]/g, "")) || NaN;
		const bid = Number(bidText?.replaceAll(/[^0-9.]/g, "")) || NaN;

		const params = {
			rarity,
			season,
			junkValue,
			marketValue,
			bid,
			name,
			id,
			region,
			badges,
		};

		const enableConfirmation = shouldConfirm(params);
		// console.info(params, enableConfirmation);
		if (enableConfirmation === true) {
			junkButton.dataset.rarity = junkButton.dataset.rarity.toUpperCase();
			junkButton.dataset.rarity += addOpt(marketValueText, bidText);
		} else if (enableConfirmation === false) {
			junkButton.dataset.rarity = "uncommon";
		}
	});
})();
