// ==UserScript==
// @name         Boneyard Card Links
// @namespace    dithpri.RCES
// @version      0.1
// @description  Adds a link to the nations card in the boneyard
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/miscellaneous/Boneyard%20Card%20Links.user.js
// @match        https://www.nationstates.net/page=boneyard*
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	[...document.querySelectorAll("span.smalltext")]
		.filter((span) => span.textContent == "Id:")
		.forEach((idspan) => {
			let id = idspan.nextSibling.textContent.trim();
			if (Number(id)) {
				let card_link = document.createElement("a");
				card_link.href = `https://www.nationstates.net/page=deck/card=${id}`;
				card_link.textContent = "View card";
				card_link.classList.add("button");
				idspan.parentElement.insertAdjacentElement("beforeend", document.createElement("br"));
				idspan.parentElement.insertAdjacentElement("beforeend", card_link);
			}
		});
})();
