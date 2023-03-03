// ==UserScript==
// @name         NsIssueCompactorRand
// @version      0.5.2
// @namespace    dithpri.RCES
// @description  Hide everything except issue buttons and focus on a random option
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/issue_answering/NsIssueCompactorRand.user.js
// @noframes
// @match        https://www.nationstates.net/*page=show_dilemma*
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
	addStyle(`
body > *, body > #banner, .smalltext, .dilemmapaper, p, h5 {display : none;}
body > #dilemma, body > #main, p.dilemmaaccept, p.dilemmadismissbox {display: initial;}

button.button.big.icon.approve, p.dilemmadismissbox > button.big.icon.remove.danger {
visibility: initial;
}

ol {
list-style: none;
padding-left: 0;
}

button.rces-chosen {
font-weight: 700;
}

p.dilemmadismissbox {
position: fixed;
top: 0;
right: 0;
}

* { visibility: hidden;}

`);

	const issuebtns = document.querySelectorAll("button.button.big.icon.approve");
	if (issuebtns.length > 0) {
		document.querySelector("p.dilemmadismissbox > button.big.icon.remove.danger").disabled = true;
		const chosenButtonNumber = 0;
		issuebtns[chosenButtonNumber].classList.add("rces-chosen");
		document.addEventListener("keyup", function (ev) {
			if (ev.key != "Enter" || ev.repeat || issuebtns[chosenButtonNumber].style.display == "none") {
				ev.preventDefault();
				return;
			}
			document.querySelectorAll("button.button.big.icon").forEach(function (el) {
				el.style.display = "none";
			});
			issuebtns[chosenButtonNumber].click();
		});
	}
})();
