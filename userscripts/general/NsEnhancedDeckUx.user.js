// ==UserScript==
// @name         NsEnhancedDeckUx
// @version      0.1
// @namespace    dithpri.RCES
// @description  An enhanced deck list experience, with parametric junking, non-matching bid highlighting, and more!
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/general/NsEnhancedDeckUx.user.js
// @noframes
// @match        https://www.nationstates.net/*page=deck*
// @match        https://www.nationstates.net/*page=deck*value_deck=1*
// @require      https://github.com/joewalnes/filtrex/raw/master/filtrex.js
// @grant        GM.setValue
// @grant        GM.getValue
// ==/UserScript==

/*
 * Copyright (c) 2019-2020 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

const defaultFilterExpression =
	"value < 1 and rarity < legendary and bid <= junk_value and not ex_nation";

function titleCase(str) {
	return str
		.split("-")
		.map(
			(item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
		)
		.join("-");
}

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

class App {
	constructor(table, privateDeck = false) {
		this.privateDeck = privateDeck;
		this.table = table;
		this.initHead();
		this.initRows();
		this.initJunk();
	}

	initHead() {
		this.tableHead = this.table.querySelector("tr:first-child");
		const additionalColumns = ["Midpoint", "Rarity", "Season"];
		if (this.privateDeck) {
			additionalColumns.push("Junk");
		}
		for (const x of additionalColumns.values()) {
			const tdElement = document.createElement("td");
			const pElement = document.createElement("p");
			tdElement.append(pElement);
			pElement.textContent = x;
			tdElement.id = `rces-header-${x
				.toLowerCase()
				.replaceAll(" ", "_")}`;
			this.tableHead.append(tdElement);
		}
		this.headerNumbers = new Map();
		this.tableHead.querySelectorAll("td").forEach((val, idx) => {
			this.headerNumbers.set(val.innerText.trim().toLowerCase(), idx + 1);
		});
	}

	initRows() {
		this.rows = this.table.querySelectorAll("tr:not(:first-child)");
		this.rows.forEach((row) => this.initRow(row));
	}

	async initRow(row) {
		while (row.cells.length < this.headerNumbers.size) {
			row.insertCell().append(document.createElement("p"));
		}
		const cardTd = row.querySelector(
			`td:nth-child(${this.headerNumbers.get("card")})`
		);
		// Fix inconsistency on value_deck page: td doesn't have p
		if (!cardTd.querySelector("p:first-child")) {
			const wrapper = document.createElement("p");
			wrapper.append(...cardTd.childNodes);
			cardTd.append(wrapper);
		}
		const cardP = cardTd.querySelector("p:first-child");
		const href = cardP.querySelector("a").href;

		const season = href.replace(/.*season=([0-9]+).*/, "$1");
		const card_id = href.replace(/.*card=([0-9]+).*/, "$1");

		const attrib = new Map();
		attrib.set("rcesSeason", season);
		attrib.set("rcesCardId", card_id);
		attrib.set("rcesName", cardP.querySelector(".nnameblock").innerText);
		attrib.set(
			"rcesCanonicalName",
			attrib.get("rcesName").replace(/ /g, "_").toLowerCase()
		);
		attrib.set(
			"rcesRarity",
			cardP.querySelector(".minicard-category").innerText.toLowerCase()
		);
		attrib.set("rcesJunkValue", getJunkValue(attrib.get("rcesRarity")));
		attrib.set(
			"rcesMarketValue",
			Number(
				row.querySelector(
					`td:nth-child(${this.headerNumbers.get("value")})`
				).innerText
			) || 0
		);
		const ask_column = this.headerNumbers.get("ask");
		if (ask_column) {
			attrib.set(
				"rcesAsk",
				Number(
					row.querySelector(`td:nth-child(${ask_column})`).innerText
				) || 0
			);
		}
		const bid_column = this.headerNumbers.get("bid");
		if (bid_column) {
			attrib.set(
				"rcesBid",
				Number(
					row.querySelector(`td:nth-child(${bid_column})`).innerText
				) || 0
			);
		}
		const copies_column = this.headerNumbers.get("copies");
		if (copies_column) {
			attrib.set(
				"rcesCopies",
				Number(
					row.querySelector(`td:nth-child(${copies_column})`)
						.innerText
				) || 0
			);
		}
		this.headerNumbers.forEach((value, key) => {
			row.querySelector(
				`td:nth-child(${this.headerNumbers.get(key)})`
			).classList.add(
				`rces-column-${key.toLowerCase().replaceAll(" ", "_")}`
			);
		});
		if (
			cardP
				.querySelector(".minicard-flag")
				.style.backgroundImage.match(/\.gif("\))?$/)
		) {
			attrib.set("rcesGifFlag", 1);
			const appendEl = document.createElement("span");
			appendEl.classList.add("deckcard-token");
			appendEl.innerText = "GIF";
			cardP.append(appendEl);
		} else {
			attrib.set("rcesGifFlag", 0);
		}

		if (
			cardP
				.querySelector(".minicard-flag")
				.style.backgroundImage.match(/exnation.png("\))?$/)
		) {
			attrib.set("rcesExnationFlag", 1);
			const appendEl = document.createElement("span");
			appendEl.classList.add("deckcard-token");
			appendEl.innerText = "EX-NATION";
			cardP.append(appendEl);
		} else {
			attrib.set("rcesExnationFlag", 0);
		}

		const ask = attrib.get("rcesAsk") || 0;
		const bid = attrib.get("rcesBid") || 0;
		if (ask && bid && ask != bid && ask < bid) {
			row.classList.add("rces-dirty-match");
		}
		attrib.forEach((value, key) => {
			row.dataset[key] = value;
		});

		const auction_column = this.headerNumbers.get("auction");
		if (auction_column) {
			const rowResolveTimeElement = row.querySelector(
				`td:nth-child(${this.headerNumbers.get("auction")}) > p > time`
			);
			if (rowResolveTimeElement) {
				const rowResolveTime = rowResolveTimeElement.dataset.epoch;
				const now = Math.round(Date.now() / 1000);
				if (rowResolveTime >= now) {
					const valueId = `auction-${card_id}-${season}`;
					const storedResolveTime = await GM.getValue(valueId, `0`);
					let changed = false;
					if (storedResolveTime != rowResolveTime) {
						if (!(storedResolveTime <= now - 6 * 60 * 60)) {
							row.classList.add("rces-time-changed");
						}
						row.addEventListener("click", async function () {
							row.classList.remove("rces-time-changed");
							await GM.setValue(valueId, `${rowResolveTime}`);
						});
						changed = true;
					}
				}
			}
		}

		row.querySelector(".rces-column-rarity > p").appendChild(
			(() => {
				const el = row.querySelector(
					'.rces-column-card .deckcard-token[class*=" deckcard-category-"]'
				);
				el.remove();
				return document.createTextNode(titleCase(el.innerText));
			})()
		);
		row.querySelector(".rces-column-season > p").appendChild(
			document.createTextNode(`${season}`)
		);
	}

	async initJunk() {
		if (!this.privateDeck) {
			return false;
		}
		this.isJunking = false;

		this.junkDiv = document.createElement("div");
		this.junkDiv.id = "rces-junkdiv";

		this.junkButton = document.createElement("button");
		this.junkButton.textContent = "Junk next card";
		this.junkButton.classList.add("button", "icon", "trash", "danger");

		this.filterButton = document.createElement("button");
		this.filterButton.textContent = "Filter cards";
		this.filterButton.classList.add("button", "icon", "fork");

		this.junkFilterTextarea = document.createElement("textarea");
		this.junkFilterTextarea.id = "rces-junk-filter";
		this.junkFilterTextarea.value = await GM.getValue(
			"rces-junk-filter-expression",
			defaultFilterExpression
		);
		this.junkFilterTextareaUpdated = true;

		const buttonGroupElement = document.createElement("div");
		buttonGroupElement.classList.add("button-group");
		buttonGroupElement.append(this.filterButton, this.junkButton);

		{
			var timer = undefined;
			const timeout = 250;
			this.junkFilterTextarea.addEventListener("keypress", () => {
				window.clearTimeout(timer);
				this.junkFilterTextareaUpdated = true;
			});
			this.junkFilterTextarea.addEventListener("keyup", () => {
				window.clearTimeout(timer); // prevent errant multiple timeouts from being generated
				timer = window.setTimeout(async () => {
					this.compileExpression();
				}, timeout);
			});
		}

		this.junkButton.addEventListener("click", () =>
			this.junkNextCard(Date.now())
		);
		this.filterButton.addEventListener("click", () => {
			this.junkFilterTextareaUpdated = true;
			this.filterRows();
		});

		document.addEventListener("keyup", (ev) => {
			if (event.isComposing || event.keyCode === 229) {
				return;
			}
			const junkKey = ev.key == "Enter" || ev.key.toLowerCase() == "j";
			if (
				junkKey &&
				!(
					ev.target.tagName == "TEXTAREA" ||
					ev.target.tagName == "INPUT"
				)
			) {
				ev.stopPropagation();
				this.junkButton.click();
			}
		});

		this.junkDiv.append(
			this.junkFilterTextarea,
			document.createElement("br"),
			buttonGroupElement
		);
		const deckFiltersDiv = document.querySelector(".deckcard-filters");
		deckFiltersDiv.parentNode.insertBefore(this.junkDiv, deckFiltersDiv);

		this.rows.forEach((row) => {
			const rowJunkButton = document.createElement("button");
			rowJunkButton.classList.add("button");
			rowJunkButton.classList.add("danger");
			rowJunkButton.classList.add("rces-junkbutton");
			rowJunkButton.textContent = "Junk";
			rowJunkButton.addEventListener("click", () => {
				this.junkRow(row, Date.now());
			});
			row.querySelector(
				`td:nth-child(${this.headerNumbers.get("junk")}) p`
			).append(rowJunkButton);
		});

		this.filterRows();
	}

	async compileExpression() {
		try {
			if (
				typeof this.junkExpressionFilter != "function" ||
				this.junkFilterTextareaUpdated
			) {
				this.junkExpressionFilter = compileExpression(
					this.junkFilterTextarea.value
				);
				console.log(
					typeof this.junkExpressionFilter != "function",
					this.junkFilterTextareaUpdated
				);
			}
		} catch (error) {
			this.junkExpressionFilter = false;
			this.junkFilterTextarea.classList.add("rces-parse-error");

			this.junkButton.disabled = true;
			return false;
		}
		this.junkFilterTextareaUpdated = false;
		this.junkFilterTextarea.classList.remove("rces-parse-error");
		await GM.setValue(
			"rces-junk-filter-expression",
			this.junkFilterTextarea.value
		);
		this.junkButton.disabled = false;
		return true;
	}

	filterRows() {
		console.log("filterrows");
		if (!this.compileExpression(this.junkFilterTextareaUpdated)) {
			console.log("calling compile");
			return false;
		}
		console.log("filterrows proper");

		this.rows.forEach((row) => {
			if (row.classList.contains(".rces-junked")) {
				console.log("WHY RETURNING????");
				return;
			}
			const value = Number(row.dataset.rcesMarketValue);
			let result = false;
			result = this.junkExpressionFilter({
				id: Number(row.dataset.rcesCardId),
				season: Number(row.dataset.rcesSeason),
				name: row.dataset.rcesName,
				rarity: getRarityOrder(row.dataset.rcesRarity),
				ask: Number(row.dataset.rcesAsk),
				bid: Number(row.dataset.rcesBid),
				value: value,
				market_value: value,
				ex_nation: Number(row.dataset.rcesExnationFlag),
				gif: Number(row.dataset.rcesGifFlag),
				junk_value: Number(row.dataset.rcesJunkValue),
				copies: Number(row.dataset.rcesCopies),
				common: -5,
				uncommon: -4,
				rare: -3,
				ultrarare: -2,
				ultra_rare: -2,
				epic: -1,
				legendary: 0,
			});

			if (result == true) {
				row.classList.add("rces-junkable");
			} else {
				row.parentElement.append(row);
				row.classList.remove("rces-junkable");
			}
			console.log(result, row.dataset);
		});
	}

	async junkNextCard(userclickms) {
		if (
			this.junkFilterTextareaUpdated &&
			(await this.compileExpression())
		) {
			this.filterRows();
		}
		const row = this.table.querySelector("tr.rces-junkable");
		if (row != null) {
			await this.junkRow(row, userclickms);
		}
	}

	async junkRow(row, userclickms) {
		if (!this.isJunking) {
			this.isJunking = true;
			this.table
				.querySelectorAll(".rces-junkbutton")
				.forEach(async (x) => (x.disabled = true));
			try {
				const response = await this.junkCard(
					row.dataset.rcesCardId,
					row.dataset.rcesSeason,
					userclickms
				);
				if (response.trim() == "0") {
					throw new Error("Couldn't junk card.");
				}
				row.dataset.rcesCopies -= 1;
				row.querySelector(
					`td:nth-child(${this.headerNumbers.get("copies")}) p`
				).textContent = row.dataset.rcesCopies;
				if (row.dataset.rcesCopies <= 0) {
					row.parentElement.append(row);
					row.classList.remove("rces-junkable");
					row.classList.add("rces-junked");
					row.querySelector(".rces-junkbutton").remove();
				}
			} catch (err) {
				row.classList.remove("rces-junkable");
				row.classList.add("rces-junkerror");
				console.error(err);
			}
			this.isJunking = false;
			this.table
				.querySelectorAll(
					"tr:not(.rces-junkerror) button.rces-junkbutton"
				)
				.forEach(async (x) => (x.disabled = false));
		}
	}

	async junkCard(cardid, season, userclickms) {
		if (!userclickms) {
			throw new Error("No userclickms!");
		}
		const data = {};
		const url = `/page=ajax3/a=junkcard/card=${cardid}/season=${season}/script=${GM.info.script.name}(${GM.info.script.namespace}:${GM.info.script.version})/userclickms=${userclickms}`;
		console.log(url);
		return (
			await (
				await fetch(url, {
					method: "POST",
					data: data,
				})
			).text()
		).trim();
	}
}

(function () {
	"use strict";

	const app = new App(
		document.querySelector("table.clickabletimes.wide.nscodetable"),
		true
	);

	GM_addStyle(`
.clickabletimes {
	border-collapse: collapse;
}

#rces-junkdiv {
	width: 50%;
	position: relative;
	right: -50%;
}

#rces-junkdiv .button-group {
	width: 100%;
}

#rces-junkdiv button {
	margin-left: 0;
	width: 50%;
}

#rces-junk-filter {
	min-width: 100%;
	max-width: 100%;
	margin: auto;
	min-height: 2em;
}

#rces-junk-filter.rces-parse-error {
	color: red;
}

.rces-junked {
	opacity: 0.5;
}

tr.rces-junkerror td.rces-column-junk button.rces-junkbutton {
	display: initial !important;
}

tr.rces-junkerror td.rces-column-junk {
	background-color: salmon;
	opacity: 0.5;
}

.rces-time-changed td.rces-column-auction {
	background-color: red;
}

.rces-time-changed {
	background-color: lightcoral;
}

.rces-dirty-match td.rces-column-ask,
.rces-dirty-match td.rces-column-bid {
	background-color: yellow;
}

tr.rces-junkable td.rces-column-junk button.rces-junkbutton {
	display: initial;
}

tr:not(.rces-junkable) td.rces-column-junk button.rces-junkbutton {
	display: none;
}

td.rces-column-rarity,
td.rces-column-season {
	color: white;
	font-weight: bold;
	font-style: italic;
	font-variant: petite-caps;
	text-align: left;
}

[data-rces-season="1"] td.rces-column-season {
	background-color: red;
}

[data-rces-season="2"] td.rces-column-season {
	background-color: #00a5ff;
}

[data-rces-rarity="legendary"] td.rces-column-rarity {
	background-color: gold;
}

[data-rces-rarity="epic"] td.rces-column-rarity {
	background-color: #db9e1c;
}

[data-rces-rarity="ultra-rare"] td.rces-column-rarity {
	background-color: #ac00e6; /* hsl(285, 75%, 62%); */
}

[data-rces-rarity="rare"] td.rces-column-rarity {
	background-color: #008ec1;
}

[data-rces-rarity="uncommon"] td.rces-column-rarity {
	background-color: #00aa4c;
}

[data-rces-rarity="common"] td.rces-column-rarity {
	background-color: #7e7e7e;
}
`);
})();
