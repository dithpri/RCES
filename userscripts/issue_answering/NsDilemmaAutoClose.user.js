// ==UserScript==
// @name         NsDilemmaAutoClose
// @version      0.5
// @namespace    dithpri.RCES
// @description  Auto-close resolved dilemma windows or offer to open a pack if it was generated
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/issue_answering/NsDilemmaAutoClose.user.js
// @noframes
// @match        https://www.nationstates.net/*page=enact_dilemma*
// @grant        window.close
// @run-at       document-end
// ==/UserScript==

/*
 * Copyright (c) 2019-2020 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

// Credits to 9003 for also discovering the pack-opening shortcut and reminding
// me to push an update

(function () {
	"use strict";

	const pack_open_btn = document.querySelector(".button.lootboxbutton");
	if (pack_open_btn) {
		pack_open_btn.scrollIntoView();
		document.addEventListener("keyup", (ev) => {
			if (ev.key != "Enter" || ev.repeat) {
				ev.preventDefault();
				return;
			}
			if (pack_open_btn.style.display != "none") {
				pack_open_btn.style.display = "none";
				pack_open_btn.click();
			}
		});
	} else {
		window.close();
	}
})();
