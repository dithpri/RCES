// ==UserScript==
// @name         Code Snippet / rces-cmtb
// @version      0.1
// @namespace    dithpri.RCES
// @description  mousetrap keybinds for card page
// @author       dithpri
// @noframes
// @match        https://www.nationstates.net/*page=deck/card=*
// @require      https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js?a4098
// ==/UserScript==

/*
 * Copyright (c) 2020 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

/*
 * Keybinds:
 * [s]ell, [a]sk
 * [b]uy, [b]id
 * [g]ift
 * [m]atch
 */

(function () {
	'use strict';
	function noinput_mousetrap(event) {
		if (event.target.classList.contains("mousetrap")) {
			event.preventDefault();
			event.stopPropagation();
		}
	}

	const inputs = document.querySelectorAll("input.auctionbid[name=\"auction_ask\"], input.auctionbid[name=\"auction_bid\"]");
	const ask_match = document.querySelector("#highest_matchable_ask_price > .cardprice_sell").textContent;
	const bid_match = document.querySelector("#lowest_matchable_bid_price > .cardprice_buy").textContent;

	// sell, ask
	Mousetrap.bind(['s', 'a', 'S', 'A'], function (ev) {
		noinput_mousetrap(ev);
		document.querySelector("th[data-mode=\"sell\"").click();
		const askbox = document.querySelector("input.auctionbid[name=\"auction_ask\"]");
		askbox.focus(); askbox.select();
	});

	// buy, bid
	Mousetrap.bind(['b', 'B'], function (ev) {
		noinput_mousetrap(ev);
		document.querySelector("th[data-mode=\"buy\"").click();
		const bidbox = document.querySelector("input.auctionbid[name=\"auction_bid\"]");
		bidbox.focus(); bidbox.select();
	});

	// gift
	Mousetrap.bind(['g', 'G'], function (ev) {
		noinput_mousetrap(ev);
		document.querySelectorAll("div.deckcard-info-cardbuttons > a.button").forEach(function (el) {
			if (el.textContent == "Gift") {
				el.click();
			}
		});
	});

	// match
	Mousetrap.bind(['m', 'M'], function (ev) {
		noinput_mousetrap(ev);
		if (ask_match && ask_match > 0) {
			document.querySelector("input.auctionbid[name=\"auction_ask\"]").value = ask_match;
		}
		if (bid_match && bid_match > 0) {
			document.querySelector("input.auctionbid[name=\"auction_bid\"]").value = bid_match;
		}
	});

	inputs.forEach(function (el) {
		// to be able to use keybinds while inputting numbers
		el.classList.add("mousetrap");
		// to submit on enter
		el.addEventListener('keypress', function (e) {
			if (e.which == 13) {
				this.parentNode.nextElementSibling.firstChild.click();
			}
		})
	});
})();
