// ==UserScript==
// @name         Garderner Highlighter
// @version      0.2
// @namespace    dithpri.RCES
// @description  Adds The Card Gardening Society's icon besides members during auctions
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/auction/Gardener%20Highlighter.user.js
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
 *     to automatically fetch and update members' nations.
 *
 * GM.setValue, GM.getValue:
 *     to save and load members' nations locally.
 */

function GM_addStyle(style) {
	"use strict";
	var node = document.createElement("style");
	node.innerHTML = style;
	document.getElementsByTagName("head")[0].appendChild(node);
}

const icon_base64 =
	"data:image/png;base64,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";

(async function () {
	"use strict";

	const update_auctiontable = async function () {
		const members_array = (await GM.getValue("cardgardens", "")).split(
			"\n"
		);
		document
			.querySelectorAll(
				"#cardauctiontable > tbody > tr > td > p > a.nlink"
			)
			.forEach(function (el, i) {
				const canonical_nname = el
					.getAttribute("href")
					.replace(/^nation=/, "");
				if (members_array.includes(canonical_nname)) {
					el.parentNode.parentNode.classList.add(
						"rces-cl-cardgardens"
					);
				} else {
					el.parentNode.parentNode.classList.remove(
						"rces-cl-cardgardens"
					);
				}
			});
	};

	if (document.getElementById("auctiontablebox")) {
		// If we haven't updated in the last 12h
		if (
			(await GM.getValue("cardgardens-lastupdate", 0)) +
				12 * 60 * 60 * 1000 <
			new Date().getTime()
		) {
			GM.xmlHttpRequest({
				method: "GET",
				url:
					"https://docs.google.com/spreadsheets/d/1THMFwrDdQEsoK0-W4kVQBFIq_48-Lr8YHyX1jV1HHqk/export?format=tsv&id=1THMFwrDdQEsoK0-W4kVQBFIq_48-Lr8YHyX1jV1HHqk&gid=540664597",
				onload: async function (data) {
					console.info("updated");
					await GM.setValue(
						"cardgardens",
						data.responseText
							.split("\n")
							.map((x) =>
								x
									.split("\t")[1]
									.trim()
									.toLowerCase()
									.replace(/ /g, "_")
							)
							.slice(1)
							.join("\n")
					);
					GM.setValue("cardgardens-lastupdate", new Date().getTime());
					update_auctiontable();
				},
			});
		}

		update_auctiontable();

		let observer = new MutationObserver(function (mutationList) {
			update_auctiontable();
		});

		const observerOptions = {
			childList: true,
		};

		observer.observe(
			document.getElementById("auctiontablebox"),
			observerOptions
		);

		GM_addStyle(`
.rces-cl-cardgardens {
background-repeat: no-repeat;
}
tr > td.rces-cl-cardgardens:nth-child(1) {
background-image: linear-gradient(90deg, rgba(255,255,255,0), rgb(255,255,255) 50px, rgba(255,255,255,0) 100px), url('${icon_base64}');
background-position: left;
}
tr > td.rces-cl-cardgardens:nth-child(5) {
background-image: linear-gradient(270deg, rgba(255,255,255,0), rgb(255,255,255) 50px, rgba(255, 255, 255, 0) 100px), url('${icon_base64}');
background-position: right;
}
`);
	}
})();
