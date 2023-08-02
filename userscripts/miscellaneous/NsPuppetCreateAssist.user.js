// ==UserScript==
// @name         NsPuppetCreateAssist
// @version      0.3
// @namespace    dithpri.RCES
// @description  A script for one-click puppet creation
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/miscellaneous/NsPuppetCreateAssist.user.js
// @noframes
// @match        https://www.nationstates.net/*page=blank/*x-rces-cp*
// @grant        GM.getValue
// @grant        GM.setValue
// ==/UserScript==

/*
 * Copyright (c) 2020 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

const DISCLAIMER = `
NsPuppetCreateAssist has been removed from the RCES repo because it's an ugly hack.
Don't use it.
`;

(async function () {
	if (!(await GM.getValue("NsPuppetCreateAssist_disclaimer_read", null))) {
		if (
			prompt(DISCLAIMER + "\nEnter 'I understand' in the box below to continue").toLowerCase() == "i understand"
		) {
			GM.setValue("NsPuppetCreateAssist_disclaimer_read", 1);
		} else {
			return;
		}
	}

	const puppetCreationForm = `<br/><big><strong>${DISCLAIMER.replaceAll("\n", "<br/>")}</strong></big><hr/>`;
	let hook = document.getElementById("content");
	if (hook) {
		hook.innerHTML = puppetCreationForm;
	} else {
		document.body.innerHTML = puppetCreationForm;
	}
})();
