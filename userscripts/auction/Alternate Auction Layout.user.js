// ==UserScript==
// @name         Alternate Auction Layout
// @version      0.3
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

function update_auctiontable() {
	// collapse identical bids/asks/matches into a single row

	const expandButton = document.getElementById("auctiontablebox").querySelector(".cardauctionshowmorerow");
	if (false && expandButton) {
		expandButton.style.display = "none";
		document
			.getElementById("auctiontablebox")
			.querySelectorAll(".cardauctionhiddenrow")
			.forEach(function (el) {
				el.classList.remove("cardauctionhiddenrow");
			});
	}

	let lastRow = undefined;
	let count = -1;

	// the 0 is a hack to force the last iteration to update too
	[...document.getElementById("cardauctiontable").querySelectorAll("tr"), 0].forEach(function (el) {
		if (lastRow === undefined) {
			lastRow = el;
			count = 1;
		}
		if (el.textContent == lastRow.textContent) {
			if (el.parentNode) {
				el.parentNode.removeChild(el);
			}
			count++;
			return;
		} else {
			if (count > 1) {
				const countIndicatorEl = document.createElement("div");
				countIndicatorEl.textContent = `×${count}`;
				if (lastRow.children[2].textContent != "") {
					countIndicatorEl.prepend(document.createElement("hr"));
				}
				lastRow.children[2].append(countIndicatorEl);
			}
			lastRow = el;
			count = 1;
		}
	});

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

	// Because NS, for some reason, has really fucked up templating that results in nested forms and weird templates when there's no bids/asks placed.
	// Move elements that do not normally belong in #auctiontablebox to after its parent form.
	document
		.querySelectorAll("#auctiontablebox > :not(#cardauctiontable)")
		.forEach((node) => document.getElementById("auctiontablebox").parentElement.after(node));

	// Add id to table for easier use
	document.querySelector("table.shiny.wide.deckcard-card-stats").id = "rces-infotable";

	// Container for side-by-side display of table and auction
	document.getElementById("deck-single-card").before(newElementWithAttribs("div", {id: "rces-container"}));

	// Move table wrapper, auction wrapper, card to container
	document
		.getElementById("rces-container")
		.append(
			document.getElementById("deck-single-card"),
			newElementWithAttribs("div", {id: "rces-auction-wrapper"}),
			newElementWithAttribs("div", {id: "rces-infotable-wrapper"})
		);

	// Actually move table and auction into respective wrappers
	document.getElementById("rces-infotable-wrapper").append(document.getElementById("rces-infotable"));
	document
		.getElementById("rces-auction-wrapper")
		.append(
			document.getElementById("cardauctionoffertable").parentElement,
			document.getElementById("auctiontablebox").parentElement
		);

	// Wrap the auction countdown to make it float with scrolling
	document.getElementById("rces-container").before(newElementWithAttribs("div", {id: "rces-countdown-wrapper"}));
	document.getElementById("rces-countdown-wrapper").append(document.getElementById("countdown-cardauction") || "");

	// Move the "You own x copies" info to the top.
	document.getElementById("ttq_1a").after(document.querySelector(".minorinfo") || "");

	if (document.getElementById("auctiontablebox")) {
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
