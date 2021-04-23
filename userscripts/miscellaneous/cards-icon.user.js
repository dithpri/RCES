// ==UserScript==
// @name         Cards Icon
// @version      0.2
// @namespace    dithpri.RCES
// @description  Adds links to the deck page and market page as either an icon or menu entry (depending on NS theme)
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/miscellaneous/cards-icon.user.js
// @noframes
// @match        https://www.nationstates.net/*
// @grant        none
// ==/UserScript==

/*
 * Copyright (c) 2020-2021 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

(function () {
	"use strict";

	const buttonsConf = [
		{
			title: "DECK",
			destination: "page=deck",
			icon_class: "icon-cards",
		},
		{
			title: "MARKET",
			destination: "page=deck/show_market=auctions",
			icon_class: "icon-chart-line",
		},
	];

	for (const conf of buttonsConf) {
		// Antiquity & Century
		if (document.querySelector("#panel > ul.menu")) {
			const cardsLink = document.createElement("li");
			// <i> is too large on century due to NS css, use <span>
			cardsLink.innerHTML = `<a href="${conf.destination}"><span class="${conf.icon_class}"> </span>${conf.title}</a>`;

			// Antiquity
			if (document.getElementById("sidebar")) {
				document
					.querySelector("#panel > ul.menu > li > ul.submenu")
					.lastElementChild.before(cardsLink);
				// Century
			} else {
				document
					.querySelector("#panel > ul.menu > li > ul.submenu")
					.lastElementChild.after(cardsLink);
			}
			// Other themes
		} else {
			const cardsButton = document.createElement("div");
			cardsButton.classList.add("bel");
			cardsButton.innerHTML = `<div class="belcontent"><a href="${conf.destination}" class="bellink"><i class="${conf.icon_class}"></i>${conf.title}</a></div>`;
			document
				.getElementById("banner")
				.lastElementChild.before(cardsButton);
		}
	}
})();
