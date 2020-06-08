// ==UserScript==
// @name         Guildies Auction Highlighter UwU
// @version      0.8
// @namespace    dithpri.RCES
// @description  Adds TNP's Card Guild logo beside members' card collecting nations during an auction
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/auction/Guildies%20Auction%20Highlighter%20UwU.user.js
// @noframes
// @match        https://www.nationstates.net/*page=deck*/*card=*
// @match        https://www.nationstates.net/*card=*/*page=deck*
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @connect      docs.google.com
// ==/UserScript==

/*
 * Copyright (c) 2020 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

/* Permissions:
 *
 * GM.xmlHttpRequest, `connect docs.google.com`:
 *     to automatically fetch and update Guild members' card collecting nations.
 *
 * GM.setValue, GM.getValue:
 *     to save and load Guild members' card collecting nations locally.
 */


function GM_addStyle(style) {
	'use strict';
	var node = document.createElement('style');
	node.innerHTML = style;
	document.getElementsByTagName('head')[0].appendChild(node);
};

// A breaking spreadsheet change was introduced. Force updating if we last
// updated the guild list before this time.
const forceUpdateIfBefore = 1591582764000;

(async function () {
	'use strict';

	const update_auctiontable = async function () {
		const guild_members_array = (await GM.getValue("tnp-cards-guild", "")).split("\n");
		document.querySelectorAll("#cardauctiontable > tbody > tr > td > p > a.nlink").forEach(function (el, i) {
			const canonical_nname = el.getAttribute("href").replace(/^nation=/, "")
			if (guild_members_array.includes(canonical_nname)) {
				el.parentNode.parentNode.classList.add("rces-cl-tnp-cardguild");
			} else {
				el.parentNode.parentNode.classList.remove("rces-cl-tnp-cardguild");
			}
		});
	};

	if (document.getElementById("auctiontablebox")) {
		// If we haven't updated in the last 12h
		const lastUpdate = await GM.getValue("tnp-cards-guild-lastupdate", 0);
		if (lastUpdate < forceUpdateIfBefore || lastUpdate + 12 * 60 * 60 * 1000 < (new Date().getTime())) {
			GM.xmlHttpRequest({
				method: "GET",
				url: "https://docs.google.com/spreadsheets/d/1q-aLN6fhUm0OC426lv_G4f32PWA_u5nRlJ4YCj9NDlQ/export?format=tsv&id=1q-aLN6fhUm0OC426lv_G4f32PWA_u5nRlJ4YCj9NDlQ&gid=1147833059",
				onload: async function (data) {
					console.info("updated");
					await GM.setValue("tnp-cards-guild",
						data.responseText
							.split("\n")
							.map((x) => x.split("\t")[4].toLowerCase().replace(/ /g, "_"))
							.slice(1)
							.concat("the_northern_light")
							.join("\n"));
					GM.setValue("tnp-cards-guild-lastupdate", new Date().getTime());
					update_auctiontable();
				}
			});
		}


		update_auctiontable();

		let observer = new MutationObserver(function (mutationList) {
			update_auctiontable();
		});

		const observerOptions = {
			childList: true
		};

		observer.observe(document.getElementById("auctiontablebox"), observerOptions);

		GM_addStyle(`
.rces-cl-tnp-cardguild {
background-repeat: no-repeat;
}
tr > td.rces-cl-tnp-cardguild:nth-child(1) {
background-image: linear-gradient(90deg, rgba(255,255,255,0), rgb(255,255,255) 50px, rgba(255,255,255,0) 100px), url(data:image/png;base64,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);
background-position: left;
}
tr > td.rces-cl-tnp-cardguild:nth-child(5) {
background-image: linear-gradient(270deg, rgba(255,255,255,0), rgb(255,255,255) 50px, rgba(255, 255, 255, 0) 100px), url(data:image/png;base64,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);
background-position: right;
}
`);
	}
})();
