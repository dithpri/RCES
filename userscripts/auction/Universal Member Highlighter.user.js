// ==UserScript==
// @name         Universal Member Highlighter
// @version      0.2
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
	await showConfigMenu();
	try {
		let newOrg = JSON.parse(str);
		confTable_addOrgRow(newOrg);
		await GM.setValue(
			`data-${newOrg.sheetUrl}`,
			await getSheetData(newOrg)
		);
	} catch (error) {
		console.log(error);
		alert("Ooops! Something went wrong!\nCheck the console for errors.");
	}
}

function confTable_addOrgRow(conf) {
	let row = document
		.getElementById("rces-umh-config-table")
		.tBodies[0].insertRow();
	let newCell = undefined;

	newCell = row.insertCell();
	newCell.classList.add("rces-umh-config-org-image");
	newCell.innerHTML = `<img src="${conf.image}" />`;

	newCell = row.insertCell();
	newCell.classList.add("rces-umh-config-org-name");
	newCell.innerHTML = `<input type="text" value="${conf.name}" />`;

	newCell = row.insertCell();
	newCell.classList.add("rces-umh-config-org-sheetUrl");
	newCell.innerHTML = `<input type="text" value="${conf.sheetUrl}" />`;

	newCell = row.insertCell();
	newCell.classList.add("rces-umh-config-org-headerRows");
	newCell.innerHTML = `<input type="number" value="${conf.headerRows}" />`;

	newCell = row.insertCell();
	newCell.classList.add("rces-umh-config-org-nationColumn");
	newCell.innerHTML = `<input type="number" value="${conf.nationColumn}" />`;

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
		};
		orgConf.hash = stringHash(orgConf.sheetUrl);
		acc.push(orgConf);
		return acc;
	}, []);
	saveConfig(newConf);
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
		<div class="info" style="margin: 0;">Last sheet update: ${new Date(
			await GM.getValue("lastupdate")
		).toLocaleString()}</div>
    <br />
		<table id="rces-umh-config-table">
			<thead>
				<tr>
					<td>Image</td>
					<td>Name</td>
					<td>URL</td>
					<td>Header rows</td>
					<td>Nation column</td>
					<td></td>
				</tr>
			</thead>
			<tbody>
			</tbody>
		</table>
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
#rces-umh-config-modal-content{
	background: ${bg};
	color: ${col};
	text-align: center;
	padding: 20px;
	border-radius: 5px;
	margin: auto;
	width: 80%;
}
#rces-umh-config-modal-close{
  float: right;
  padding: 0;
  height: 1em;
  width: 1em;
  font-size: 200%;
}`);
}

async function showConfigMenu() {
	const configEl = document.getElementById("rces-umh-config-modal");
	if (configEl) {
		configEl.hidden = false;
	} else {
		createConfigMenu();
	}
}

async function updateSheets(force = false) {
	// If we haven't updated in the last 12h
	if (
		force ||
		(await GM.getValue("lastupdate", 0)) + 12 * 60 * 60 * 1000 <
			new Date().getTime()
	) {
		GM.setValue("lastupdate", 0);
		const orgs = await getConfig();
		for (const org of orgs) {
			GM.setValue(`data-${org.sheetUrl}`, await getSheetData(org));
		}
		GM.setValue("lastupdate", new Date().getTime());
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
					new_el.classList.add(`rces-umh-${org.hash}-inline`);
					el.parentNode.insertBefore(new_el, el.nextSibling);
					el.classList.add(`rces-umh-${org.hash}-parsed`);
				}
			});
	}
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
	}
})();
