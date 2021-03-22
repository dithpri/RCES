// ==UserScript==
// @name         Universal Member Highlighter
// @version      0.1
// @namespace    dithpri.RCES
// @description  Adds a card organization's icon besides members during auctions, with customizable configs
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/universal-highlighter/userscripts/auction/Universal%20Member%20Highlighter.user.js
// @noframes
// @match        https://www.nationstates.net/*page=deck*/*card=*
// @match        https://www.nationstates.net/*card=*/*page=deck*
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.registerMenuCommand
// @grant        GM.setClipboard
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

// =========
// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
function stringHash(str) {
	var hash = 0,
		i,
		chr;
	if (str.length === 0) return hash;
	for (i = 0; i < str.length; i++) {
		chr = str.charCodeAt(i);
		hash = (hash << 5) - hash + chr;
		hash |= 0;
	}
	return hash;
}
// =========

function GM_promiseXmlHttpRequest(opts) {
	return new Promise((resolve, reject) => {
		let details = opts;
		details.onload = (response) => {
			if (response.status >= 200 && response.status < 300) {
				resolve(response);
			} else {
				reject(response);
			}
		};
		details.onerror = (response) => {
			reject(response);
		};
		GM.xmlHttpRequest(details);
	});
}

async function getSheetData(org) {
	const data = await GM_promiseXmlHttpRequest({
		method: "GET",
		url: org.sheetUrl,
	});
	return data.responseText
		.split("\n")
		.map((x) =>
			x
				.split("\t")
				[org.nationColumn].trim()
				.toLowerCase()
				.replace(/ /g, "_")
		)
		.slice(org.headerRows)
		.join("\n");
}

function addOrgStyle(org) {
	GM_addStyle(`
	.rces-umh-${org.hash} {
	background-repeat: no-repeat;
	}
	tr > td.rces-umh-${org.hash}:nth-child(1) {
	background-image: linear-gradient(90deg, rgba(255,255,255,0), rgb(255,255,255) 50px, rgba(255,255,255,0) 100px), url('${
		org.image
	}');
	background-position: left;
	}
	tr > td.rces-umh-${org.hash}:nth-child(5) {
	background-image: linear-gradient(270deg, rgba(255,255,255,0), rgb(255,255,255) 50px, rgba(255, 255, 255, 0) 100px), url('${
		org.image
	}');
	background-position: right;
	}
	.rces-umh-${org.hash}-inline {
	background-repeat: no-repeat;
	background-image: url('${org.image}');
	background-size: contain;
	padding-left: 1.5em;
	}
	.rces-umh-${org.hash}-inline:hover::before {
	content: "${CSS.escape(org.name)}";
	position: absolute;
	/*background: #e0e0e0;
	color: #219550;*/
	transform: translate(-50%, -110%);
	padding: 0.2em;
	border-radius: 0.2em;
	}
	`);
}

async function addOrgSheetConfig(str) {
	let config = JSON.parse(await GM.getValue("config", "[]"));
	let newOrg = JSON.parse(str);
	newOrg.hash = stringHash(newOrg.image + newOrg.sheetUrl);
	config.push(newOrg);

	// >_>
	const newconf = Array.from(
		new Set(config.map((x) => JSON.stringify(x)))
	).map((x) => JSON.parse(x));

	await GM.setValue("config", JSON.stringify(newconf));
	await GM.setValue(`data-${newOrg.sheetUrl}`, await getSheetData(newOrg));
}

async function getConfig() {
	return JSON.parse(await GM.getValue("config", "[]"));
}

(async function () {
	"use strict";
	if (GM.registerMenuCommand != undefined) {
		/*
		 * GreaseMonkey requires a polyfill.
		 * Not using it, because it clutters the user's page context menu instead of displaying the option in the extension's menu.
		 */
		await GM.registerMenuCommand(
			"Add organization config",
			() => {
				addOrgSheetConfig(
					prompt("Please enter the sheet config: ", "")
				);
			},
			null
		);
		/*
		await GM.registerMenuCommand(
			"Export current config to clipboard",
			async () => {
				await GM.setClipboard(await getConfig(), "text");
			},
			null
		);
		*/
	}
	const orgs = await getConfig();

	const update_auctiontable = async function () {
		for (const org of orgs) {
			const members_array = (
				await GM.getValue(`data-${org.sheetUrl}`, " ")
			).split("\n");
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
							`rces-umh-${org.hash}`
						);
					} else {
						el.parentNode.parentNode.classList.remove(
							`rces-umh-${org.hash}`
						);
					}
				});
			document
				.querySelectorAll(`a.nlink:not(.rces-umh-${org.hash}-parsed)`)
				.forEach(function (el, i) {
					const canonical_nname = el
						.getAttribute("href")
						.replace(/^nation=/, "");
					if (members_array.includes(canonical_nname)) {
						const new_el = document.createElement("span");
						new_el.classList.add(`rces-umh-${org.hash}-inline`);
						el.parentNode.insertBefore(new_el, el.nextSibling);
						el.classList.add(`rces-umh-${org.hash}-parsed`);
					}
				});
		}
	};

	if (document.getElementById("auctiontablebox")) {
		// If we haven't updated in the last 12h
		if (
			(await GM.getValue("lastupdate", 0)) + 12 * 60 * 60 * 1000 <
			new Date().getTime()
		) {
			for (const org of orgs) {
				GM.setValue(`data-${org.sheetUrl}`, await getSheetData(org));
			}
			GM.setValue("lastupdate", new Date().getTime());
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

		for (const org of orgs) {
			addOrgStyle(org);
		}
	}
})();
