// ==UserScript==
// @name         Auction Keybindings
// @version      0.2
// @namespace    dithpri.RCES
// @description  mousetrap keybinds for card page
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/miscellaneous/auction-keybindings.user.js
// @noframes
// @match        https://www.nationstates.net/*page=deck/card=*
// @require      https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js?a4098
// ==/UserScript==

/*
 * Copyright (c) 2020-2021 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

/*
 * Keybinds:
 * [s], [a]:
 *      sell, ask
 * [b]:
 *      buy/bid
 * [g]:
 *      gift
 * [m]atch:
 *      Set price to match highest bid/lowest ask
 * [v]:
 *      Set price to match MV
 * [r]:
 *      Remove ask/bid
 *      Will remove the ask/bid being edited, or the lowest/highest (possible) ask/bid
 *      (use the [s]/[b] keybind first to choose)
 * [c]:
 *      Change ask/bid
 */

(function () {
	"use strict";

	Mousetrap.prototype.stopCallback = (_x, _y, _z) => {
		return false;
	};

	function noinput_mousetrap(event) {
		if (
			event.target.classList.contains("mousetrap") ||
			event.target.id == "new_price_value"
		) {
			event.preventDefault();
			event.stopPropagation();
		}
	}

	const ask_match = document.querySelector(
		"#highest_matchable_ask_price > .cardprice_sell"
	)?.textContent;
	const bid_match = document.querySelector(
		"#lowest_matchable_bid_price > .cardprice_buy"
	)?.textContent;
	const market_value =
		Number(
			[
				...document.querySelectorAll(
					"table.deckcard-card-stats tr > td:nth-child(1)"
				),
			].filter((x) => x.textContent == "Market Value (estimated)")[0]
				.nextElementSibling.innerText
		) || null;
	console.log(market_value);

	// sell, ask
	Mousetrap.bind(["s", "a", "S", "A"], function (ev) {
		noinput_mousetrap(ev);
		document.querySelector('th[data-mode="sell"]').click();
		const askbox = document.querySelector(
			'input.auctionbid[name="auction_ask"]'
		);
		askbox.focus();
		askbox.select();
	});

	// buy, bid
	Mousetrap.bind(["b", "B"], function (ev) {
		noinput_mousetrap(ev);
		document.querySelector('th[data-mode="buy"]').click();
		const bidbox = document.querySelector(
			'input.auctionbid[name="auction_bid"]'
		);
		bidbox.focus();
		bidbox.select();
	});

	// gift
	Mousetrap.bind(["g", "G"], function (ev) {
		noinput_mousetrap(ev);
		document
			.querySelectorAll("div.deckcard-info-cardbuttons > a.button")
			.forEach(function (el) {
				if (el.textContent == "Gift") {
					el.click();
				}
			});
	});

	// match
	Mousetrap.bind(["m", "M"], function (ev) {
		noinput_mousetrap(ev);
		if (ev.target.id == "new_price_value") {
			if (
				ev.target.closest("tr.cardauctionunmatchedrow-ask") &&
				ask_match &&
				ask_match > 0
			) {
				ev.target.value = ask_match;
			}
			if (
				ev.target.closest("tr.cardauctionunmatchedrow-bid") &&
				bid_match &&
				bid_match > 0
			) {
				ev.target.value = bid_match;
			}
		} else {
			if (ev.target.name == "auction_ask" && ask_match && ask_match > 0) {
				ev.target.value = ask_match;
			}
			if (ev.target.name == "auction_bid" && bid_match && bid_match > 0) {
				ev.target.value = bid_match;
			}
		}
	});

	// set price to mv
	Mousetrap.bind(["v", "V"], function (ev) {
		noinput_mousetrap(ev);
		if (ev.target.tagName.toUpperCase() === "INPUT" && market_value) {
			ev.target.value = market_value;
		}
	});

	// change
	Mousetrap.bind(["c", "C"], function (ev) {
		noinput_mousetrap(ev);
		if (ev.target.name == "auction_ask") {
			const unmatched_asks = document.querySelectorAll(
				"tr.cardauctionunmatchedrow-ask > td.auction-self-unmatched.auction-self-price > p"
			);
			unmatched_asks[unmatched_asks.length - 1].click();
		}
		if (ev.target.name == "auction_bid") {
			const unmatched_bids = document.querySelectorAll(
				"tr.cardauctionunmatchedrow-bid > td.auction-self-unmatched.auction-self-price > p"
			);
			unmatched_bids[unmatched_bids.length - 1].click();
		}
		document.getElementById("new_price_value").focus();
	});

	// remove
	Mousetrap.bind(["r", "R"], function (ev) {
		noinput_mousetrap(ev);
		if (ev.target.id !== "new_price_value") {
			if (ev.target.name == "auction_ask") {
				const unmatched_asks = document.querySelectorAll(
					"tr.cardauctionunmatchedrow-ask > td.auction-self-unmatched.auction-self-price > p"
				);
				unmatched_asks[unmatched_asks.length - 1].click();
			}
			if (ev.target.name == "auction_bid") {
				const unmatched_bids = document.querySelectorAll(
					"tr.cardauctionunmatchedrow-bid > td.auction-self-unmatched.auction-self-price > p"
				);
				unmatched_bids[unmatched_bids.length - 1].click();
			}
		}
		document.getElementById("remove_price_button").click();
	});

	const inputs = document.querySelectorAll(
		'input.auctionbid[name="auction_ask"], input.auctionbid[name="auction_bid"]'
	);
	inputs.forEach(function (el) {
		// to be able to use keybinds while inputting numbers
		el.classList.add("mousetrap");
		// to submit on enter
		el.addEventListener("keypress", function (e) {
			if (e.which == 13) {
				this.parentNode.nextElementSibling.firstChild.click();
			}
		});
	});
})();
