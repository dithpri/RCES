// ==UserScript==
// @name         Universal Member Highlighter
// @version      0.4.1
// @namespace    dithpri.RCES
// @description  Adds a card organization's icon besides members during auctions, with customizable configs
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/auction/Universal%20Member%20Highlighter.user.js
// @noframes
// @match        https://www.nationstates.net/*page=deck*/*card=*
// @match        https://www.nationstates.net/*card=*/*page=deck*
// @match        https://www.nationstates.net/page=settings
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.registerMenuCommand
// @grant        GM.setClipboard
// @connect      docs.google.com
// @connect      googleusercontent.com
// ==/UserScript==

/*
 * Copyright (c) 2020-2021 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

/* Permissions:
 *
 * GM.xmlHttpRequest, `connect docs.google.com`, `connect googleusercontent.com`:
 *     to automatically fetch and update members' nations from google sheets.
 *
 * GM.setValue, GM.getValue:
 *     to save and load members' nations locally and storing preferences.
 *
 * GM.registerMenuCommand:
 *     to add items to the extension menu
 *
 * GM.setClipboard:
 *     to export a whole config.
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
	let ret = data.responseText
		.split("\n")
		.slice(org.headerRows)
		.map((x) =>
			x
				.split("\t")
				[org.nationColumn].trim()
				.toLowerCase()
				.replace(/ /g, "_")
		);
	if (org.regexPattern && org.regexPattern != "") {
		const regexPattern = RegExp(org.regexPattern);
		ret = ret.map((x) =>
			x.match(regexPattern)[0].replace(regexPattern, "$1")
		);
	}
	return ret.join("\n");
}

function extractCssColorString(str) {
	const rgba = str
		.trim()
		.replace(/^rgba?\((.*)\)$/, "$1")
		.split(",")
		.map((x) => x.trim());
	return {
		r: rgba[0] || "0",
		g: rgba[1] || "0",
		b: rgba[2] || "0",
		a: rgba[3] || "0",
	};
}

function addOrgStyle(org) {
	const fadeColor = extractCssColorString(
		document.defaultView.getComputedStyle(document.body).backgroundColor ||
			"rgba(255, 255, 255, 0)"
	);
	GM_addStyle(`
	.rces-umh-${org.hash} {
	background-repeat: no-repeat;
	}
	tr > td.rces-umh-${org.hash}:nth-child(1) {
		background-image:
			linear-gradient(90deg,
				rgba(${fadeColor.r},${fadeColor.g},${fadeColor.b},0),
				rgb(${fadeColor.r},${fadeColor.g},${fadeColor.b}) 50px,
				rgba(${fadeColor.r},${fadeColor.g},${fadeColor.b},0) 100px),
			url('${org.image}');
	background-position: left;
	}
	tr > td.rces-umh-${org.hash}:nth-child(5) {
			background-image:
				linear-gradient(270deg,
					rgba(${fadeColor.r},${fadeColor.g},${fadeColor.b},0),
					rgb(${fadeColor.r},${fadeColor.g},${fadeColor.b}) 50px,
					rgba(${fadeColor.r},${fadeColor.g},${fadeColor.b}, 0) 100px),
				url('${org.image}');
	background-position: right;
	}
	.rces-umh-${org.hash}-inline::after {
		background-image: url('${org.image}');
	}
	.rces-umh-${org.hash}-inline:hover::before {
		content: "${CSS.escape(org.name)}";
	}
	`);
}

async function addOrgSheetConfig(str) {
	await showConfigMenu();
	try {
		let newOrg = JSON.parse(str);
		confTable_addOrgRow(newOrg);
	} catch (error) {
		console.log(error);
		alert("Ooops! Something went wrong!\nCheck the console for errors.");
	}
}

async function confTable_addOrgRow(org) {
	let row = document
		.getElementById("rces-umh-config-table")
		.tBodies[0].insertRow();
	let newCell = undefined;

	newCell = row.insertCell();
	newCell.classList.add("rces-umh-config-org-image");
	newCell.innerHTML = `<img src="${org.image}" />`;

	newCell = row.insertCell();
	newCell.classList.add("rces-umh-config-org-name");
	newCell.innerHTML = `<input type="text" value="${org.name}" />`;

	newCell = row.insertCell();
	newCell.classList.add("rces-umh-config-org-sheetUrl");
	newCell.innerHTML = `<input type="text" value="${org.sheetUrl}" />`;

	newCell = row.insertCell();
	newCell.classList.add("rces-umh-config-org-headerRows");
	newCell.innerHTML = `<input type="number" value="${
		org.headerRows || 0
	}" />`;

	newCell = row.insertCell();
	newCell.classList.add("rces-umh-config-org-nationColumn");
	newCell.innerHTML = `<input type="number" value="${
		org.nationColumn || 0
	}" />`;

	newCell = row.insertCell();
	newCell.classList.add("rces-umh-config-org-regexPattern");
	newCell.innerHTML = `<input type="text" value="${
		org.regexPattern || ""
	}" placeholder="(none)"/>`;

	newCell = row.insertCell();
	newCell.classList.add("rces-umh-config-org-lastupdate");
	newCell.innerText = `${new Date(
		await GM.getValue(`lastupdate-${org.sheetUrl}`, 0)
	).toLocaleString()}`;

	newCell = row.insertCell();
	newCell.innerHTML = `<a href ="#" class="rces-umh-config-removerow button danger">Remove</a>`;
	newCell
		.querySelector(".rces-umh-config-removerow")
		.addEventListener("click", function (ev) {
			ev.preventDefault();
			ev.stopPropagation();
			row.remove();
		});
}

async function saveConfig(conf) {
	try {
		let saveconf = conf;
		if (typeof conf != "string") {
			saveconf = JSON.stringify(conf);
		}
		return await GM.setValue("config", saveconf);
	} catch (error) {
		console.log(error);
		alert("Ooops! Something went wrong!\nCheck the console for errors.");
	}
}

async function getConfig() {
	return JSON.parse(await GM.getValue("config", "[]"));
}

async function confModal_reload() {
	document.getElementById("rces-umh-config-table").tBodies[0].innerHTML = "";
	for (const orgConf of await getConfig()) {
		confTable_addOrgRow(orgConf);
	}
	const iconSize = await GM.getValue(`preferences-iconSize`, 120);
	document.getElementById("rces-umh-config-iconSize").value = iconSize;
}

function confModal_add() {
	addOrgSheetConfig(prompt("Please enter the sheet config: ", ""));
	// document.getElementById("rces-umh-config-reload").click();
}

function confModal_save() {
	let newConf = [
		...document.getElementById("rces-umh-config-table").tBodies[0].rows,
	].reduce((acc, val) => {
		let orgConf = {
			image: val.querySelector(".rces-umh-config-org-image img").src,
			name: val.querySelector(".rces-umh-config-org-name input").value,
			sheetUrl: val.querySelector(".rces-umh-config-org-sheetUrl input")
				.value,
			headerRows: Number(
				val.querySelector(".rces-umh-config-org-headerRows input").value
			),
			nationColumn: Number(
				val.querySelector(".rces-umh-config-org-nationColumn input")
					.value
			),
			regexPattern: val.querySelector(
				".rces-umh-config-org-regexPattern input"
			).value,
		};
		orgConf.hash = stringHash(orgConf.sheetUrl);
		acc.push(orgConf);
		return acc;
	}, []);
	saveConfig(newConf);
	GM.setValue(
		`preferences-iconSize`,
		document.getElementById("rces-umh-config-iconSize").value
	);
}

async function createConfigMenu() {
	const bg =
		document.defaultView.getComputedStyle(document.body).backgroundColor ||
		"#FFF";
	const col =
		document.defaultView.getComputedStyle(document.body).color || "#000";

	document.body.insertAdjacentHTML(
		"beforeend",
		`<div id="rces-umh-config-modal">
	<div id="rces-umh-config-modal-content">
		<a class="button danger" id="rces-umh-config-modal-close">×</a>
		<h2>UMH Config</h2>
		<table id="rces-umh-config-table">
			<thead>
				<tr>
					<td>Image</td>
					<td>Name</td>
					<td>URL</td>
					<td>Header rows</td>
					<td>Nation column</td>
					<td>Regex extract pattern</td>
					<td>Last update</td>
					<td></td>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
		<br />
		<label for="rces-umh-config-iconSize">Inline icon size</label>
		<br />
		Tiny
		<input type="range" min="50" max="200" id="rces-umh-config-iconSize"/>
		Big
		<br />
		<button id="rces-umh-config-reload">Reload</button>
		<button id="rces-umh-config-add">Add</button>
		<button id="rces-umh-config-save">Save</button>
	</div>
</div>
`
	);
	const reloadButton = document.getElementById("rces-umh-config-reload");
	reloadButton.addEventListener("click", confModal_reload);
	reloadButton.click();
	document
		.getElementById("rces-umh-config-add")
		.addEventListener("click", confModal_add);
	document
		.getElementById("rces-umh-config-save")
		.addEventListener("click", confModal_save);
	document
		.getElementById("rces-umh-config-modal-close")
		.addEventListener("click", function (ev) {
			document.getElementById("rces-umh-config-modal").hidden = true;
		});
	GM_addStyle(`
#rces-umh-config-modal {
	background: rgba(50%, 50%, 50%, 50%);
	width: 100%;
	height: 100%;
	position: fixed;
	z-index: 99;
	top: 0;
	left: 0;
	overflow: auto;
	margin: auto;
	padding-top: 5em;
	text-align: center;
}

#rces-umh-config-modal-content {
	background: ${bg};
	color: ${col};
	text-align: center;
	padding: 20px;
	border-radius: 5px;
	margin: auto;
	width: 95%;
}

#rces-umh-config-iconSize {
	vertical-align: middle;
}

#rces-umh-config-modal-close {
	float: right;
	padding: 0;
	height: 1em;
	width: 1em;
	font-size: 200%;
}

#rces-umh-config-table {
	border: 1px solid ${col};
	border-collapse: collapse;
	width: 100%;
}

#rces-umh-config-table td {
	border-bottom: 1px solid ${col};
}

#rces-umh-config-table input {
	width: 100%;
	box-sizing: border-box;
}

#rces-umh-config-table input[type="number"]{
	width: 4em;
	box-sizing: content-box;
}

.rces-umh-config-org-image img {
	filter: drop-shadow(0px 0px 1px);
}

.rces-umh-config-org-sheetUrl {
	width: 30%;
}

.rces-umh-config-org-name {
	width: 12em;
}
`);
}

async function showConfigMenu() {
	const configEl = document.getElementById("rces-umh-config-modal");
	if (configEl) {
		configEl.hidden = false;
	} else {
		createConfigMenu();
	}
}

async function updateSingleSheet(org) {
	await GM.setValue(`data-${org.sheetUrl}`, await getSheetData(org));
	await GM.setValue(`lastupdate-${org.sheetUrl}`, new Date().getTime());
}

async function updateSheets(force = false) {
	const orgs = await getConfig();
	for (const org of orgs) {
		const lastupdate = await GM.getValue(`lastupdate-${org.sheetUrl}`, 0);
		// If we haven't updated in the last 12h
		if (force || lastupdate + 12 * 60 * 60 * 1000 < new Date().getTime()) {
			await GM.setValue(`lastupdate-${org.sheetUrl}`, 0);
			updateSingleSheet(org);
		}
	}
}

async function update_auctiontable() {
	const orgs = await getConfig();
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
					new_el.classList.add(
						`rces-umh-${org.hash}-inline`,
						"rces-umh-inline-common"
					);
					el.parentNode.insertBefore(new_el, el.nextSibling);
					el.classList.add(`rces-umh-${org.hash}-parsed`);
				}
			});
	}
}

function clampValue(val, min, max) {
	return Math.min(Math.max(val, min), max) || min;
}

(async function () {
	"use strict";
	if (GM.registerMenuCommand != undefined) {
		/*
		 * GreaseMonkey requires a polyfill.
		 * Not using it, because it clutters the user's page context menu instead of displaying the option in the extension's menu.
		 * GM is dead anyway.
		 */
		await GM.registerMenuCommand("Configure", showConfigMenu, null);
		await GM.registerMenuCommand(
			"Force update sheets",
			() => updateSheets(true),
			null
		);
		await GM.registerMenuCommand(
			"Export current config to clipboard",
			async () => {
				await GM.setClipboard(
					JSON.stringify(await getConfig()),
					"text"
				);
			},
			null
		);
		GM.registerMenuCommand("Import exported config", async () => {
			await saveConfig(prompt("Paste the exported config: ", ""));
			updateSheets(true);
		});
	}

	updateSheets();

	if (window.location.pathname === "/page=settings") {
		let insertInElement =
			document.getElementById("content") ||
			document.getElementById("main");
		insertInElement.insertAdjacentHTML(
			"afterbegin",
			`<a href="#" id="umh-conf-settings-open" class="button icon-cog-alt">Universal Member Highlighter settings</a>`
		);
		document
			.getElementById("umh-conf-settings-open")
			.addEventListener("click", function (ev) {
				ev.preventDefault();
				showConfigMenu();
			});
	}

	if (document.getElementById("auctiontablebox")) {
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

		const orgs = await getConfig();
		for (const org of orgs) {
			addOrgStyle(org);
		}
		const iconSize =
			clampValue(
				await GM.getValue(`preferences-iconSize`, 120),
				50,
				200
			) / 100;
		GM_addStyle(`.rces-umh-inline-common {
			display: inline-block;
			margin-left: 4px;
}

.rces-umh-inline-common::after {
	content: '';
	background-size: contain;
	filter: drop-shadow(0px 0px 1px);
	vertical-align: middle;
	background-repeat: no-repeat;
	height: ${iconSize}rem;
	width: ${iconSize}rem;
	display: inline-block;
}

.rces-umh-inline-common::before {
	position: absolute;
	background: rgba(0,0,0, 50%);
	font-weight: 600;
	color: white;
	transform: translate(-50%, -110%);
	padding: 0.2em;
	border-radius: 0.2em;
}
`);
	}
})();
