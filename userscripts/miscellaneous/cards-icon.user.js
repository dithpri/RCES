// ==UserScript==
// @name         Cards Icon
// @version      0.1
// @namespace    dithpri.RCES
// @description  Adds link to the deck page as either an icon or menu entry (depending on NS theme)
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/miscellaneous/cards-icon.user.js
// @noframes
// @match        https://www.nationstates.net/*
// @grant        none
// ==/UserScript==

/*
 * Copyright (c) 2020 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

(function () {
	"use strict";

	if (document.querySelector("#panel > ul.menu")) {
		// Antiquity & Century
		const cardsLink = document.createElement("li");
		cardsLink.innerHTML = `<a href="page=deck">DECK</a>`;

		if (document.getElementById("sidebar")) {
			// Antiquity
			document
				.querySelector("#panel > ul.menu > li > ul.submenu")
				.lastElementChild.before(cardsLink);
		} else {
			// Century
			document
				.querySelector("#panel > ul.menu > li > ul.submenu")
				.lastElementChild.after(cardsLink);
		}
	} else {
		// Other themes
		const cardsButton = document.createElement("div");
		cardsButton.classList.add("bel");
		cardsButton.innerHTML = `<div class="belcontent"><a href="page=deck" class="bellink"><i class="icon-cards"></i>DECK</a></div>`;
		document.getElementById("banner").lastElementChild.before(cardsButton);
	}
})();
