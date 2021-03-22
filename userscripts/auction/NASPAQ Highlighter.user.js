// ==UserScript==
// @name         NASPAQ Highlighter
// @version      0.1
// @namespace    dithpri.RCES
// @description  Adds NASPAQ's icon besides members during auctions
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/auction/NASPAQ%20Highlighter.user.js
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

const sheet_url =
	"https://docs.google.com/spreadsheets/d/1lixnsslj-KhWd5-1f_ijcRcaPRi0aUqT-TqOM7cTpr0/export?format=tsv&id=1lixnsslj-KhWd5-1f_ijcRcaPRi0aUqT-TqOM7cTpr0&gid=0";

(async function () {
	"use strict";

	const update_auctiontable = async function () {
		const members_array = (await GM.getValue("naspaq", "")).split("\n");
		document
			.querySelectorAll(
				"#cardauctiontable > tbody > tr > td > p > a.nlink"
			)
			.forEach(function (el, i) {
				const canonical_nname = el
					.getAttribute("href")
					.replace(/^nation=/, "");
				if (members_array.includes(canonical_nname)) {
					el.parentNode.parentNode.classList.add("rces-cl-naspaq");
				} else {
					el.parentNode.parentNode.classList.remove("rces-cl-naspaq");
				}
			});
		document
			.querySelectorAll("a.nlink:not(.rces-cl-naspaq-parsed)")
			.forEach(function (el, i) {
				const canonical_nname = el
					.getAttribute("href")
					.replace(/^nation=/, "");
				if (members_array.includes(canonical_nname)) {
					const new_el = document.createElement("span");
					new_el.classList.add("rces-cl-naspaq-inline");
					el.parentNode.insertBefore(new_el, el);
					el.classList.add("rces-cl-naspaq-parsed");
				}
			});
	};

	if (document.getElementById("auctiontablebox")) {
		// If we haven't updated in the last 12h
		if (
			(await GM.getValue("naspaq-lastupdate", 0)) + 12 * 60 * 60 * 1000 <
			new Date().getTime()
		) {
			GM.xmlHttpRequest({
				method: "GET",
				url: sheet_url,
				onload: async function (data) {
					console.info("updated");
					await GM.setValue(
						"naspaq",
						data.responseText
							.split("\n")
							.map((x) =>
								x
									.split("\t")[4]
									.trim()
									.toLowerCase()
									.replace(/ /g, "_")
							)
							.slice(1)
							.join("\n")
					);
					GM.setValue("naspaq-lastupdate", new Date().getTime());
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

		observer.observe(
			document.getElementById("auctiontablebox"),
			observerOptions
		);

		GM_addStyle(`
.rces-cl-naspaq {
background-repeat: no-repeat;
}
tr > td.rces-cl-naspaq:nth-child(1) {
background-image: linear-gradient(90deg, rgba(255,255,255,0), rgb(255,255,255) 50px, rgba(255,255,255,0) 100px), url('${icon_base64}');
background-position: left;
}
tr > td.rces-cl-naspaq:nth-child(5) {
background-image: linear-gradient(270deg, rgba(255,255,255,0), rgb(255,255,255) 50px, rgba(255, 255, 255, 0) 100px), url('${icon_base64}');
background-position: right;
}
.rces-cl-naspaq-inline {
background-repeat: no-repeat;
background-image: url('${icon_base64}');
background-size: contain;
padding-left: 1.5em;
}
`);
	}
})();
