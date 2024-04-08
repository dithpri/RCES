// ==UserScript==
// @name         Gardener Highlighter
// @version      0.7.3
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
// @connect      googleusercontent.com
// ==/UserScript==

/*
 * Copyright (c) 2020 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

/* Permissions:
 *
 * GM.xmlHttpRequest, `connect docs.google.com`, `connect googleusercontent.com`:
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
		const members_array = (await GM.getValue("cardgardens", "")).split("\n");
		document.querySelectorAll("#cardauctiontable > tbody > tr > td > p > a.nlink").forEach(function (el, i) {
			const canonical_nname = el.getAttribute("href").replace(/^nation=/, "");
			if (members_array.includes(canonical_nname)) {
				el.parentNode.parentNode.classList.add("rces-cl-cardgardens");
			} else {
				el.parentNode.parentNode.classList.remove("rces-cl-cardgardens");
			}
		});
		document.querySelectorAll("a.nlink:not(.rces-cl-cardgardens-parsed)").forEach(function (el, i) {
			const canonical_nname = el.getAttribute("href").replace(/^nation=/, "");
			if (members_array.includes(canonical_nname)) {
				const new_el = document.createElement("span");
				new_el.classList.add("rces-cl-cardgardens-inline");
				el.parentNode.insertBefore(new_el, el);
				el.classList.add("rces-cl-cardgardens-parsed");
			}
		});
	};

	if (document.getElementById("auctiontablebox")) {
		// If we haven't updated in the last 12h
		if ((await GM.getValue("cardgardens-lastupdate", 0)) + 12 * 60 * 60 * 1000 < new Date().getTime()) {
			GM.xmlHttpRequest({
				method: "GET",
				url: "https://docs.google.com/spreadsheets/d/1mqQRESG_HrMF6aToHqUF40eHNkLE6XbusoeZHFUMTKQ/export?format=tsv&id=1mqQRESG_HrMF6aToHqUF40eHNkLE6XbusoeZHFUMTKQ&gid=641340461",
				onload: async function (data) {
					console.info("updated");
					await GM.setValue(
						"cardgardens",
						data.responseText
							.split("\n")
							.map((x) => x.split("\t")[1].trim().toLowerCase().replace(/ /g, "_"))
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
			subtree: true,
			childList: true,
		};

		observer.observe(document.getElementById("auctiontablebox"), observerOptions);

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
.rces-cl-cardgardens-inline {
background-repeat: no-repeat;
background-image: url('${icon_base64}');
background-size: contain;
padding-left: 1.5em;
}
`);
	}
})();
