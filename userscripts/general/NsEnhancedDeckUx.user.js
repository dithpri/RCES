// ==UserScript==
// @name         NsEnhancedDeckUx
// @version      0.2
// @namespace    dithpri.RCES
// @description  An enhanced deck list experience, with parametric junking, non-matching bid highlighting, and more!
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/general/NsEnhancedDeckUx.user.js
// @noframes
// @match        https://www.nationstates.net/*page=deck*
// @match        https://www.nationstates.net/*page=deck*value_deck=1*
// @require      https://github.com/m93a/filtrex/raw/54e69a7fde0ab23a4b0cffb1179d6d1963c01239/dist/browser/filtrex.min.js#sha256=11241f84db98e219470b276641f58451485dabd95a1d61c706054522d919eaad
// @grant        GM.setValue
// @grant        GM.getValue
// ==/UserScript==

/*
 * Copyright (c) 2019-2023 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

const CUSTOM_COLUMNS = [
	{
		name: "Match",
		transformFn: (row) => {
			if (row.data.get("ask") <= row.data.get("bid")) {
				return ((row.data.get("ask") + row.data.get("bid")) / 2).toFixed(2);
			} else {
				return "—";
			}
		},
	},
	{
		name: "Rarity",
		transformFn: (row) => row.data.get("rarity"),
	},
	{
		name: "Season",
		transformFn: (row) => row.data.get("season"),
	},
];

const GM_addStyle = function (style) {
	"use strict";
	var node = document.createElement("style");
	node.innerHTML = style;
	document.getElementsByTagName("head")[0].appendChild(node);
};

function getJunkValue(rarity) {
	switch (rarity.toLowerCase()) {
		case "common":
			return 0.01;
		case "uncommon":
			return 0.05;
		case "rare":
			return 0.1;
		case "ultra-rare":
			return 0.2;
		case "epic":
			return 0.5;
		case "legendary":
			return 1.0;
	}
}

function getRarityOrder(rarity) {
	switch (rarity.toLowerCase()) {
		case "common":
			return -5;
		case "uncommon":
			return -4;
		case "rare":
			return -3;
		case "ultra-rare":
			return -2;
		case "epic":
			return -1;
		case "legendary":
			return 0;
		default:
			return 0;
	}
}

function _sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const splitOnce = (str, sep) => {
	let idx = str.indexOf("=");
	if (idx == -1) {
		return [str, undefined];
	}
	return [str.slice(0, idx), str.slice(idx + 1)];
};

function getNsParams() {
	return new Map(
		window.location.pathname
			.split("/")
			.filter((x) => x != "")
			.map((x) => splitOnce(x, "="))
	);
}

const canonicalize = (x) => x.toLowerCase().replaceAll(" ", "_");

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const titleCase = (str) =>
	str
		.split("-")
		.map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
		.join("-");

const asHtmlDatasetKey = (x) =>
	x
		.split(/[-_]/)
		.map((x) => capitalize(x))
		.join("");

class Row {
	constructor(row, columns) {
		this.row = row;
		this.columns = columns;
		this._data = new Map();
		this.fixValueDeckPage();
		this.scrapeHtmlData();
		this.initRow();
		this.syncDataToHtml();
		this.checkAuctionTime();
	}

	get dataset() {
		return this.row.dataset;
	}

	get data() {
		return this._data;
	}

	get processed() {
		return this._processed;
	}

	set processed(val) {
		this._processed = val;
		if (val) {
			this.row.classList.add("rces-processed");
			this.row.querySelector(".rces-column-action p").textContent = "";
		} else {
			this.row.classList.remove("rces-processed");
		}
	}

	get failed() {
		return this._failed;
	}

	set failed(val) {
		this._failed = val;
		if (val) {
			this.row.classList.add("rces-failed");
			this.row.querySelector(".rces-column-action p").className = "";
		} else {
			this.row.classList.remove("rces-failed");
		}
	}

	get link() {
		return this.row
			.querySelector(`td:nth-child(${this.columns.headerNumber("card")})`)
			.querySelector("a.nref.cardnameblock").href;
	}

	fixValueDeckPage() {
		// Fix inconsistency on value_deck page: td doesn't have p
		const cardTd = this.row.querySelector(`td:nth-child(${this.columns.headerNumber("card")})`);
		if (!cardTd.querySelector("p:first-child")) {
			const wrapper = document.createElement("p");
			wrapper.append(...cardTd.childNodes);
			cardTd.append(wrapper);
		}
	}

	scrapeHtmlData() {
		const cardTd = this.row.querySelector(`td:nth-child(${this.columns.headerNumber("card")})`);
		const cardLink = cardTd.querySelector("a.nref.cardnameblock");
		const href = cardLink.href;

		this.data.set("season", Number(href.replace(/.*season=([0-9]+).*/, "$1")));
		this.data.set("id", Number(href.replace(/.*card=([0-9]+).*/, "$1")));
		this.data.set("stylized_name", cardLink.querySelector(".nnameblock").innerText);
		this.data.set("name", this.data.get("stylized_name").replace(/ /g, "_").toLowerCase());
		this.data.set("rarity", cardLink.querySelector(".minicard-category").innerText.toLowerCase());
		this.data.set("junk_value", getJunkValue(this.data.get("rarity")));
		this.data.set(
			"flag_link",
			cardLink.querySelector(".minicard-flag").style.backgroundImage.replace(/^url\(["'](.*)["']\)$/, "$1")
		);
		this.data.set(
			"exnation",
			/exnation.png("\))?$/.test(cardLink.querySelector(".minicard-flag").style.backgroundImage)
		);

		this.columns.forEach((val, idx) => {
			if (val.vanilla) {
				let valueFn = val.valueFn ?? ((x) => x.innerText);
				this.data.set(val.name, valueFn(this.row.querySelector(`td:nth-child(${idx}) p`)));
			}
		});
	}

	syncDataToHtml() {
		this.data.forEach((value, key) => {
			this.row.dataset[asHtmlDatasetKey(`rces-${key}`)] = value;
		});
	}

	async initRow() {
		while (this.row.cells.length < this.columns.count) {
			this.row.insertCell().append(document.createElement("p"));
		}
		this.columns.forEach((val, idx) => {
			if (!val.vanilla) {
				this.row.querySelector(`td:nth-child(${idx}) p`).innerText = val.transformFn(this);
			}
			this.row.querySelector(`td:nth-child(${idx})`).classList.add(`rces-column-${val.name}`);
		});
	}

	async checkAuctionTime() {
		const valueId = `RT-${this.data.get("id")}-${this.data.get("season")}`;
		const actualResolveTime = this.data.get("auction");
		const storedResolveTime = await GM.getValue(valueId, 0);
		const now = Math.round(Date.now() / 1000);
		if (storedResolveTime != actualResolveTime) {
			if (storedResolveTime != 0 && storedResolveTime > now - 6 * 60 * 60) {
				this.row.classList.add("rces-time-changed");
				this.row.addEventListener("click", async () => {
					await GM.setValue(valueId, actualResolveTime);
					this.row.classList.remove("rces-time-changed");
				});
			} else {
				await GM.setValue(valueId, actualResolveTime);
			}
		}
	}
}

class Columns {
	constructor(tableHead) {
		this.tableHead = tableHead;
		this.headerNumbers = new Array();
		this.tableHead.querySelectorAll("td").forEach((val, idx) => {
			const name = canonicalize(val.innerText.trim());
			this.headerNumbers[idx + 1] = {
				name: name,
				vanilla: true,
			};
			if (["ask", "bid", "value", "copies"].includes(name)) {
				this.headerNumbers[idx + 1].valueFn = (x) => Number(x.innerText);
			} else if (name == "card") {
				this.headerNumbers[idx + 1].valueFn = (x) => x.querySelector(".nnameblock").innerText;
			} else if (name == "auction") {
				this.headerNumbers[idx + 1].valueFn = (x) => x?.querySelector("time")?.dataset.epoch ?? NaN;
			}
		});
	}

	addColumn(name, transformFn) {
		const tdElement = document.createElement("td");
		const pElement = document.createElement("p");
		tdElement.append(pElement);
		pElement.textContent = name;
		tdElement.id = `rces-header-${canonicalize(name)}`;
		this.tableHead.append(tdElement);
		this.headerNumbers[this.headerNumbers.length] = {
			name: canonicalize(name),
			vanilla: false,
			transformFn: transformFn,
		};
	}

	headerNumber(name) {
		return this.headerNumbers.findIndex((x) => x && x.name == "card");
	}

	get count() {
		return this.headerNumbers.length - 1;
	}

	forEach(fn) {
		this.headerNumbers.forEach(function () {
			return fn.apply(null, arguments);
		});
	}
}

class App {
	constructor(table, privateDeck = false) {
		this._isExecutingAction = true;
		this.privateDeck = privateDeck;
		this.table = table;
		this.expressions = {
			gift: () => false,
			open: () => false,
			junk: () => false,
		};
		this.filters = {};
		this.columns = new Columns(this.table.querySelector("tr:first-child"));
		CUSTOM_COLUMNS.forEach((x) => this.columns.addColumn(x.name, x.transformFn));
		if (this.privateDeck) {
			this.columns.addColumn("Action", (x) => "");
		}

		this.initRows();
		this.insertCss();
		if (this.privateDeck) {
			this.initPrivateDeck();
		}
	}

	async initPrivateDeck() {
		this.insertHtml();
		await this.initFilters();
		await this.filterRows();
		this.isExecutingAction = false;
	}

	get isExecutingAction() {
		return this._isExecutingAction;
	}

	set isExecutingAction(val) {
		this._isExecutingAction = val;
		if (val) {
			this.defaultActionButton.disabled = true;
		} else {
			this.defaultActionButton.disabled = false;
		}
	}

	async processRow(idx, userclickms) {
		if (!userclickms) {
			throw "No userclickms!";
			return;
		}
		if (this.isExecutingAction) {
			throw "Cannot process cards simultaneously";
			return;
		}
		this.isExecutingAction = true;
		try {
			const row = this.rows[idx];
			row.processed = true;
			if (row.action == "open") {
				window.open(row.link);
			} else if (row.action == "gift") {
				window.open(row.link + "/gift=1");
			} else if (row.action == "junk") {
				const cardid = row.data.get("id");
				const season = row.data.get("season");
				const url = `/page=ajax3/a=junkcard/card=${cardid}/season=${season}/script=${GM.info.script.name}(${GM.info.script.namespace}:${GM.info.script.version})/userclickms=${userclickms}`;
				const response = (
					await (
						await fetch(url, {
							method: "POST",
							data: {},
						})
					).text()
				).trim();
				if (response.trim() == "0") {
					row.failed = true;
				}
			}
		} finally {
			this.isExecutingAction = false;
		}
	}

	processNextRow(userclickms, actionRestrict) {
		if (!userclickms) {
			throw "No userclickms!";
			return;
		}
		let restrict = () => true;
		if (actionRestrict) {
			restrict = actionRestrict;
		}
		const idx = this.rows.findIndex((x) => x.ready && !x.processed && restrict(x));
		if (idx != -1) {
			this.processRow(idx, userclickms);
		}
	}

	async initFilters() {
		["gift", "open", "junk"].forEach(async (filter) => {
			const el = document.getElementById(`rces-filter-${filter}`);
			el.value = await GM.getValue(`filter-${filter}`, "1==0");
			el.disabled = false;
			this.filters[filter] = el;
			this.compileExpression(filter);
		});
	}

	async updateExpression(filter_name) {
		let success = false;
		this.filters[filter_name].disabled = true;
		if (this.compileExpression(filter_name)) {
			success = true;
			await GM.setValue(`filter-${filter_name}`, this.filters[filter_name].value);
		}
		this.filters[filter_name].disabled = false;
		return success;
	}

	setFilterError(filter_name, error) {
		this.filters[filter_name].classList.add("rces-errored");
		console.error(error);
		document.getElementById("rces-EnhancedDeckUx").classList.remove("rces-hidden");
	}

	compileExpression(filter_name) {
		let compiled = () => false;
		this.filters[filter_name].classList.remove("rces-errored");
		try {
			compiled = filtrex.compileExpression(this.filters[filter_name].value);
			return true;
		} catch (e) {
			this.setFilterError(filter_name, e);
			return false;
		} finally {
			this.expressions[filter_name] = compiled;
		}
	}

	async filterRows() {
		let errored = false;
		this.rows.forEach((row) => {
			row.ready = false;
			row.action = undefined;
			const cell = row.row.querySelector(".rces-column-action p");
			cell.className = "";
			cell.classList.add("rces-action");
		});

		this.rows.forEach(async (row, idx) => {
			if (row.failed) {
				return;
			}
			const cell = row.row.querySelector(".rces-column-action p");
			for (const [name, expression] of Object.entries(this.expressions)) {
				const result = expression(Object.fromEntries(row.data));
				if (typeof result !== typeof true) {
					console.warn(`Expected `, typeof true, ` got `, typeof result);
					this.setFilterError(name, result);
					errored = true;
				} else {
					if (result) {
						row.action = name;
						const button = document.createElement("button");
						cell.insertAdjacentElement("afterbegin", button);
						button.classList.add(`rces-action-${name}`, "button");
						if (name == "gift") {
							button.classList.add("icon-gift");
						} else if (name == "open") {
							button.classList.add("icon-link");
						} else if (name == "junk") {
							button.classList.add("icon-mushroom-cloud", "danger");
						} else {
							console.warn(name);
						}
						button.addEventListener("click", (ev) => {
							if (!event.isTrusted) {
								return;
							}
							this.processRow(idx, Date.now());
						});
						break;
					}
				}
			}
			if (!row.action) {
				row.processed = true;
			}
			row.ready = true;
		});
		if (errored) {
			alert("Errors encoutered, check console");
		}
	}

	initRows() {
		this.rows = [...this.table.querySelectorAll("tr:not(:first-child)")].map((row) => new Row(row, this.columns));
	}

	insertHtml() {
		const deckFiltersEl = document.querySelector(".deckcard-filters");
		deckFiltersEl.insertAdjacentHTML(
			"beforebegin",
			`
<div id="rces-EnhancedDeckUxWrapper">
	<button class="button icon edit" id="rces-EnhancedDeckUx-collapse" onclick="document.getElementById('rces-EnhancedDeckUx').classList.toggle('rces-hidden')">Settings</button>
	<div class="rces-hidden" id="rces-EnhancedDeckUx">
		<label for="rces-filter-gift">Gift filter</label>
		<br>
		<textarea class="rces-filter" id="rces-filter-gift" disabled></textarea>
		<hr>
		<label for="rces-filter-open">Open filter</label>
		<br>
		<textarea class="rces-filter" id="rces-filter-open" disabled></textarea>
		<hr>
		<label for="rces-filter-junk">Junk filter</label>
		<br>
		<textarea class="rces-filter" id="rces-filter-junk" disabled></textarea>
		<hr>
		Available properties:
		<pre id="rces-infobox">
		</pre>
	</div>
	<button class="button icon arrowright" id="rces-default-action">Process next card</button>
</div>
`
		);
		document.getElementById("rces-infobox").textContent = Object.entries(
			this.rows.reduce((acc, row) => ({...Object.fromEntries(row.data), ...acc}), {})
		)
			.map((entry) => [entry[0], typeof entry[1]].join(":"))
			.join("\n");
		document.querySelectorAll(".rces-filter").forEach((el) => {
			el.addEventListener("change", () => {
				if (this.updateExpression(el.id.replace("rces-filter-", ""))) {
					this.filterRows();
				}
			});
		});
		this.defaultActionButton = document.getElementById("rces-default-action");
		this.defaultActionButton.addEventListener("click", (ev) => {
			if (!event.isTrusted) {
				return;
			}
			this.processNextRow(Date.now());
		});
		document.addEventListener("keyup", (ev) => {
			if (!event.isTrusted || event.repeat) {
				return;
			}
			if (event.key == "Enter") {
				this.processNextRow(Date.now());
			} else if (event.key == "g") {
				this.processNextRow(Date.now(), (x) => x.action == "gift");
			} else if (event.key == "o") {
				this.processNextRow(Date.now(), (x) => x.action == "open");
			} else if (event.key == "j") {
				this.processNextRow(Date.now(), (x) => x.action == "junk");
			}
		});
	}

	insertCss() {
		GM_addStyle(`
.clickabletimes {
	border-collapse: collapse;
}

.rces-filter {
	resize: none;
	width: 100%;
}

.rces-hidden {
	display: none;
}

.rces-processed {
	opacity: 0.8;
}

.rces-failed .rces-column-action {
	background-color: red;
}

.rces-errored {
	background-color: orange;
	border: 1px solid red;
}

.rces-time-changed td.rces-column-auction {
	background-color: red;
}

td.rces-column-rarity,
td.rces-column-season {
	color: white;
	font-weight: bold;
	font-style: italic;
	font-variant: petite-caps;
	text-align: left;
}
`);
		const seasons = this.rows.reduce((acc, row) => {
			acc.set(
				row.data.get("season"),
				document.defaultView.getComputedStyle(row.row.querySelector(".cardnameblock .minicard-season-number"))
					.background
			);
			return acc;
		}, new Map());
		const rarities = this.rows.reduce((acc, row) => {
			acc.set(
				row.data.get("rarity"),
				document.defaultView.getComputedStyle(row.row.querySelector(".cardnameblock .minicard-category"))
					.background
			);
			return acc;
		}, new Map());
		seasons.forEach((v, k) => GM_addStyle(`tr[data--rces-season="${k}"] .rces-column-season{background: ${v}}`));
		rarities.forEach((v, k) => GM_addStyle(`tr[data--rces-rarity="${k}"] .rces-column-rarity{background: ${v}}`));
	}
}

(function () {
	"use strict";

	const path_params = getNsParams();
	const private_deck =
		path_params.get("page") == "deck" && path_params.has("value_deck") && !path_params.has("show_market");
	const app = new App(document.querySelector("table.clickabletimes.wide.nscodetable"), private_deck);
})();
