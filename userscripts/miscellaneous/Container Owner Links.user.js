// ==UserScript==
// @name         Container Owner Links
// @version      0.1
// @namespace    dithpri.RCES
// @description  Adds container links next to card owners for sending to puppetmasters. Clicking will copy to clipboard, or you can right click and copy the link.
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/miscellaneous/Container%20Owner%20Links.user.js
// @noframes
// @match        https://www.nationstates.net/page=deck/card=*/owners=1
// @grant        GM.setClipboard
// ==/UserScript==

/*
 * Copyright (c) 2022 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

const linkText = "💸";

(async function () {
	"use strict";
	const cardLink = document.querySelector(".deckcard-season-list-card-selected .nref.cardnameblock").href;

	document.querySelectorAll(".clickabletimes tr > td:nth-child(2) > p > a.nlink").forEach((el) => {
		const owningNation = el.href.replace(/(.*\/)*nation=([a-z0-9_]+).*/, "$2");
		let saleLink = document.createElement("a");
		saleLink.innerText = linkText;
		saleLink.href = `${cardLink}/container=${owningNation}`;
		saleLink.addEventListener("click", (ev) => {
			ev.stopPropagation();
			ev.preventDefault();
			GM.setClipboard(saleLink);
		});
		el.insertAdjacentElement("beforebegin", saleLink);
	});
})();
