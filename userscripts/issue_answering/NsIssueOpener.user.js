// ==UserScript==
// @name         NsIssueOpener
// @version      0.6.1
// @namespace    dithpri.RCES
// @description  Open issues in new tab with no decorations
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/issue_answering/NsIssueOpener.user.js
// @noframes
// @match        https://www.nationstates.net/*page=dilemmas*
// @grant        window.close
// @run-at       document-end
// ==/UserScript==

/*
 * Copyright (c) 2019-2020 dithpri (Racoda) <dithpri@gmail.com>
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

(function () {
	"use strict";

	addStyle(`.rces-chosen { border: .2em solid black; }`);
	// Open on user click in new tab
	Array.from(document.querySelectorAll(".dilemmalist > li >a"))
		.filter((x) => {
			console.log(x);
			return x
				.getAttribute("href")
				.match(/^\/?page=show_dilemma\/dilemma=/);
		})
		.map((val) => {
			val.classList.add("rces-dilemmalink");
			val.setAttribute("target", "_blank");
			val.setAttribute(
				"href",
				val.getAttribute("href") +
					"/template-overall=none/x-rces=openissue"
			);
			return val;
		})[0]
		.parentElement.classList.add("rces-chosen");

	document.addEventListener("keypress", function (ev) {
		if (ev.key != "Enter" || ev.repeat) {
			ev.preventDefault();
			return;
		}
		const element = document.querySelector(".rces-dilemmalink");
		element.click();
		// Remove issue from the list after it has been opened
		element.parentElement.remove();
		// Close page if all issues have been opened
		if (document.querySelector(".dilemmalist").textContent.trim() == "") {
			setTimeout(window.close, 100);
		}
		document
			.querySelector(".dilemmalist > li >a")
			.parentElement.classList.add("rces-chosen");
	});

	// Close page if no issues
	const issuestxt = document.querySelector(".dilemmalist").textContent.trim();
	if (issuestxt == "" || issuestxt == "There are no current issues.") {
		if (!document.body.id == "loggedout") {
			window.close();
		}
	}
})();
