// ==UserScript==
// @name         NsDilemmaAutoClose
// @version      0.3
// @namespace    dithpri.RCES
// @description  Auto-close resolved dilemma windows or offer to open a pack if it was generated
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/issue_answering/NsDilemmaAutoClose.user.js
// @noframes
// @match        https://www.nationstates.net/*page=enact_dilemma/*x-rces=autoclose*
// @grant        window.close
// @run-at       document-body
// ==/UserScript==

/*
 * Copyright (c) 2019-2020 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

// Credits to 9003 for also discovering the pack-opening shortcut and reminding
// me to push an update

function addStyle(style) {
	"use strict";
	var node = document.createElement("style");
	node.innerHTML = style;
	document.getElementsByTagName("head")[0].appendChild(node);
}

(function () {
	"use strict";

	const forms = document.getElementsByTagName("form");
	if (forms.length > 0) {
		addStyle("div, h5, p { display: none; } form p { display: initial;}");
		const form = forms[0];
		// form.action = "/page=deck/template-overall=none?x-autoclose"; // To be continued
		const button = form.getElementsByTagName("button")[0];
		button.style.border = ".2em solid black";

		document.addEventListener("keyup", (ev) => {
			if (
				ev.key != "Enter" ||
				ev.repeat ||
				button.style.display == "none"
			) {
				ev.preventDefault();
				return;
			}

			button.style.display = "none";
			button.click();
		});
	} else {
		window.close();
	}
})();
