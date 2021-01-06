// ==UserScript==
// @name         Main Auction Displayer
// @version      0.15
// @namespace    dithpri.RCES
// @description  Displays puppets' main nation above puppet name in an auction
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/auction/Main%20Auction%20Displayer.user.js
// @noframes
// @match        https://www.nationstates.net/*/page=deck/*
// @match        https://www.nationstates.net/page=deck/*
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.registerMenuCommand
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
 *     to automatically fetch and update the puppet list.
 *
 * GM.setValue, GM.getValue:
 *     to save and load the puppet list locally.
 *
 * GM.registerMenuCommand:
 *     to offer a force update sheets button in the UserScripts menu.
 */

const sheets = [
	{
		// 9003's spreadsheet
		url:
			"https://docs.google.com/spreadsheets/d/1MZ-4GLWAZDgB1TDvwtssEcVKHKunOKi3l90Jof1pBB4/export?format=tsv&id=1MZ-4GLWAZDgB1TDvwtssEcVKHKunOKi3l90Jof1pBB4&gid=733627866",
		puppetColumn: 0,
		mainColumn: 1,
		headerRows: 1,
	},
	{
		// XKI card co-op
		url:
			"https://docs.google.com/spreadsheets/d/e/2PACX-1vSem15AVLXgdjxWBZOnWRFnF6NwkY0gVKPYI8aWuHJzlbyILBL3o1F5GK1hSK3iiBlXLIZBI5jdpkVr/pub?gid=916202163&single=true&output=tsv",
		puppetColumn: 0,
		mainColumn: 1,
		headerRows: 0,
	},
];

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

function canonicalize(name) {
	return name.trim().toLowerCase().replace(/ /g, "_");
}

async function getFromSheet(
	sheetUrl,
	puppetColumn = 0,
	mainColumn = 1,
	headerRows = 1
) /* -> object (map) */ {
	const data = await GM_promiseXmlHttpRequest({
		method: "GET",
		url: sheetUrl,
	});
	return data.responseText
		.split("\n")
		.map((x) => {
			let y = x.split("\t");
			if (puppetColumn < mainColumn) {
				y = y.slice(puppetColumn, mainColumn + 1);
			} else {
				// switch column order if the puppetmaster column is before the puppet
				y.slice(mainColumn, puppetColumn + 1);
				y = [y[1], y[0]];
			}
			return y;
		})
		.slice(headerRows)
		.filter((x) => canonicalize(x[0]) != canonicalize(x[1]))
		.reduce(function (map, obj) {
			map[canonicalize(obj[0].trim())] = ((x) =>
				// De-canonicalize owner names
				// This could potentially be done when displaying, but we
				// prefer doing this when downloading the sheet.
				x.charAt(0).toUpperCase() + x.slice(1))(
				obj[1].trim().replaceAll("_", " ")
			);
			return map;
		}, {});
}

async function updatePuppets(isAuctionPage) {
	const puppets_map = JSON.parse(
		await GM.getValue("rces-main-nations", "{}")
	);
	if (isAuctionPage) {
		document
			.querySelectorAll(
				"#cardauctiontable > tbody > tr > td > p > a.nlink, .deckcard-title > a.nlink:not(.rces-was-parsed)"
			)
			.forEach(function (el, i) {
				const canonical_nname = el
					.getAttribute("href")
					.replace(/^nation=/, "");
				el.classList.add("rces-was-parsed");
				if (
					Object.prototype.hasOwnProperty.call(
						puppets_map,
						canonical_nname
					)
				) {
					const puppetmaster = puppets_map[canonical_nname];
					el.insertAdjacentHTML(
						"beforebegin",
						`<a href="nation=${canonicalize(
							puppetmaster
						)}" class="nlink rces-was-parsed">(<span class="nnameblock">${puppetmaster}</span>)</a><br />`
					);
				}
			});
	}
	document
		.querySelectorAll("a.nlink:not(.rces-was-parsed)")
		.forEach(function (el, i) {
			const canonical_nname = el
				.getAttribute("href")
				.replace(/^nation=/, "");
			if (
				Object.prototype.hasOwnProperty.call(
					puppets_map,
					canonical_nname
				)
			) {
				const puppetmaster = puppets_map[canonical_nname];
				el.classList.add("rces-was-parsed");
				el.insertAdjacentHTML(
					"afterend",
					`&nbsp;<a href="nation=${canonicalize(
						puppetmaster
					)}" class="nlink rces-was-parsed">(<span class="nnameblock">${puppetmaster}</span>)</a>`
				);
			}
		});
}

async function refreshAllSheets() {
	await GM.setValue(
		"rces-main-nations",
		JSON.stringify(
			Object.assign(
				{},
				...(await Promise.all(
					sheets.map((sheet) =>
						getFromSheet(
							sheet.url,
							sheet.puppetColumn,
							sheet.mainColumn,
							sheet.headerRows
						)
					)
				))
			)
		)
	);
	GM.setValue("rces-main-nations-lastupdate", new Date().getTime());
}

(async function () {
	"use strict";
	let lastUpdateMs = await GM.getValue("rces-main-nations-lastupdate", 0);
	if (GM.registerMenuCommand != undefined) {
		/*
		 * GreaseMonkey requires a polyfill.
		 * Not using it, because it clutters the user's page context menu instead of displaying the option in the extension's menu.
		 */
		await GM.registerMenuCommand(
			`Force refresh sheets (last update: ${new Date(
				lastUpdateMs
			).toLocaleString()})`,
			refreshAllSheets,
			null
		);
	}
	// Continue with the old script functionality.
	// If we haven't updated in the last 24h
	if (lastUpdateMs + 24 * 60 * 60 * 1000 < new Date().getTime()) {
		refreshAllSheets();
	}

	if (document.getElementById("auctiontablebox")) {
		updatePuppets(true);
		let observer = new MutationObserver(function (mutationList) {
			updatePuppets(true);
		});

		const observerOptions = {
			childList: true,
		};

		observer.observe(
			document.getElementById("auctiontablebox"),
			observerOptions
		);
	} else {
		updatePuppets(false);
	}
})();
