// ==UserScript==
// @name         Alternate Auction Layout
// @version      0.5
// @namespace    dithpri.RCES
// @description  An alternate auction layout better suited for wide screens
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/auction/Alternate%20Auction%20Layout.user.js
// @noframes
// @match        https://www.nationstates.net/*page=deck*/card=*
// @match        https://www.nationstates.net/*card=*/page=deck*
// ==/UserScript==
/*
 * Copyright (c) 2022 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

function addStyle(style) {
	"use strict";
	var node = document.createElement("style");
	node.innerHTML = style;
	document.getElementsByTagName("head")[0].appendChild(node);
}

function newElementWithAttribs(elem, attribs) {
	let ret = document.createElement(elem);
	for (const attribName in attribs) {
		ret.setAttribute(attribName, attribs[attribName]);
	}
	return ret;
}

function canRowsCollapse(previousRow, currentRow) {
	if (previousRow == undefined || currentRow == undefined) {
		return false;
	}
	// Rows are identical
	if (previousRow.textContent == currentRow.textContent) {
		return true;
	}
	// Rows are unmatched "watch" bids or "no-junk" asks
	if (
		previousRow.classList.contains("cardauctionunmatchedrow") &&
		currentRow.classList.contains("cardauctionunmatchedrow")
	) {
		// "no-junk" ask
		if (
			previousRow.children[1].textContent == currentRow.children[1].textContent &&
			previousRow.children[1].textContent == "10000.00"
		) {
			return true;
		}
		// "watch" bid
		if (
			previousRow.children[3].textContent == currentRow.children[3].textContent &&
			previousRow.children[3].textContent == "0.01"
		) {
			return true;
		}
	}
	// Fallback
	return false;
}

function update_auctiontable() {
	// collapse identical bids/asks/matches into a single row
	let previousRow = undefined;
	[
		...document
			.getElementById("cardauctiontable")
			.querySelectorAll("tr.cardauctionunmatchedrow, tr.cardauctionmatchedrow"),
		undefined, // undefined is a hack to force an update/collapse of the last row if needed
	].forEach((row) => {
		if (previousRow == undefined) {
			// We're on the first row, there's nothing to collapse
			previousRow = row;
			return;
		}
		if (row != undefined && canRowsCollapse(previousRow, row)) {
			// If one of the rows is already visible, make sure the "collapsed" row will be visible as well
			if (!"cardauctionhiddenrow" in previousRow.classList || !"cardauctionhiddenrow" in row.classList) {
				previousRow.classList.remove("cardauctionhiddenrow");
				row.classList.remove("cardauctionhiddenrow");
			}

			// Merge data from previous row if the buyers/sellers are not identical
			if (previousRow.children[0].textContent != row.children[0].textContent) {
				row.children[0].prepend(...previousRow.children[0].children);
			}
			if (previousRow.children[4].textContent != row.children[4].textContent) {
				row.children[4].prepend(...previousRow.children[4].children);
			}

			// Current and previous rows can be collapsed, update the number of collapsed rows and remove previous row
			row.dataset.rcesCollapsedRows = Number(previousRow.dataset.rcesCollapsedRows || 1) + 1;
			if (previousRow.parentNode) {
				previousRow.parentNode.removeChild(previousRow);
			}
		} else if (previousRow.dataset.rcesCollapsedRows > 1) {
			// Current and previous rows are different, only now do we actually need to add an indicator of the number collapsed rows
			const countIndicatorEl = document.createElement("div");
			countIndicatorEl.textContent = `×${previousRow.dataset.rcesCollapsedRows}`;
			if (previousRow.children[2].textContent != "") {
				previousRow.children[2].append(document.createElement("hr"));
			}
			previousRow.children[2].append(countIndicatorEl);
		}
		previousRow = row;
	});

	// Hide bid/ask if they're identical to the match column
	document
		.getElementById("auctiontablebox")
		.querySelectorAll("#cardauctiontable > tbody > tr.cardauctionmatchedrow")
		.forEach(function (el) {
			//td > p > span.cardprice
			const [s1, s2, s3] = [...el.querySelectorAll("td > p > span.cardprice")];
			const [p1, p2, p3] = [s1, s2, s3].map((x) => Number(x.textContent));
			if (p1 == p2 && p2 == p3) {
				s1.style.visibility = "hidden";
				s3.style.visibility = "hidden";
			}
		});
}

(function () {
	"use strict";
	// Check if we're on the auction page or owners/trades history/finds/collections page
	const isAuctionPage = !!document.getElementById("auctiontablebox");

	if (isAuctionPage) {
		// Because NS, for some reason, has really fucked up templating that results in nested forms and weird templates when there's no bids/asks placed.
		// Move elements that do not normally belong in #auctiontablebox to after its parent form.
		document
			.querySelectorAll("#auctiontablebox > :not(#cardauctiontable)")
			.forEach((node) => document.getElementById("auctiontablebox").parentElement.after(node));
	}

	// Add id to table for easier use
	document.querySelector("table.shiny.wide.deckcard-card-stats").id = "rces-infotable";

	// Container for side-by-side display of table and auction
	document.getElementById("deck-single-card").before(newElementWithAttribs("div", {id: "rces-container"}));

	// Move table wrapper, auction wrapper, card to container
	document
		.getElementById("rces-container")
		.append(
			newElementWithAttribs("div", {id: "rces-card-wrapper"}),
			newElementWithAttribs("div", {id: "rces-auction-wrapper"}),
			newElementWithAttribs("div", {id: "rces-infotable-wrapper"})
		);

	// Move the card to its wrapper
	document.getElementById("rces-card-wrapper").append(document.getElementById("deck-single-card"));
	// Move the card information table to its wrapper
	document.getElementById("rces-infotable-wrapper").append(document.getElementById("rces-infotable"));
	if (isAuctionPage) {
		// Move the auction log below the card
		document.getElementById("rces-card-wrapper").append(document.getElementById("auctionlog-area"));
		// Move the auction table and bid/ask buttons to the correct wrapper
		document
			.getElementById("rces-auction-wrapper")
			.append(
				document.getElementById("cardauctionoffertable").parentElement,
				document.getElementById("auctiontablebox").parentElement
			);
	}

	// Wrap the auction countdown to make it float with scrolling
	document.getElementById("rces-container").before(newElementWithAttribs("div", {id: "rces-countdown-wrapper"}));
	document.getElementById("rces-countdown-wrapper").append(document.getElementById("countdown-cardauction") || "");

	// Move the "You own x copies" info to the top.
	document.getElementById("ttq_1a").after(document.querySelector(".minorinfo") || "");

	if (isAuctionPage) {
		update_auctiontable();

		let observer = new MutationObserver(function (mutationList) {
			update_auctiontable();
		});

		const observerOptions = {
			childList: true,
		};

		observer.observe(document.getElementById("auctiontablebox"), observerOptions);
	}

	addStyle(`
#countdown-cardauction {
display: inline-block;
background-color: ${window.getComputedStyle(document.getElementById("main")).backgroundColor};
margin: 0;
padding: 0.5em;
border-radius: 0.5em;
}
#rces-countdown-wrapper{
position: sticky;
z-index: 99;
top: ${document.getElementById("banner")?.clientHeight || 0}px;
text-align: center;
pointer-events: none;
}
#rces-container {
display: flex;
justify-content: space-evenly;
flex-direction: row;
}
.minorinfo{
font-weight: 1000;
color: darkgreen;
text-align: center;
}
`);
})();
