// ==UserScript==
// @name         localid Synchronizer
// @version      0.1
// @namespace    dithpri.RCES
// @description  A simple alternative to the cards queue, synchronizes localid across tabs to avoid having to reload.
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/auction/localid%20Synchronizer.user.js
// @match        https://www.nationstates.net/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_addValueChangeListener
// ==/UserScript==

/*
 * Copyright (c) 2022 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

(async function () {
	const nation_name = document.body.dataset.nname;
	const localid_selector = 'form > input[name="localid"]';
	const value_name = `localid:${nation_name}`;
	const old_id = JSON.parse(await GM.getValue(value_name, "[]"));
	const current_id = document.querySelector(localid_selector)?.value;
	if (nation_name == undefined || current_id == undefined) {
		return;
	}
	if (!old_id.includes(current_id)) {
		old_id.unshift(current_id);
		GM.setValue(value_name, JSON.stringify(old_id.slice(0, 10)));
	}
	GM_addValueChangeListener(value_name, (_name, _old_value, new_value, _remote) => {
		const new_id = JSON.parse(new_value)[0];
		[...document.querySelectorAll(localid_selector)].forEach((element) => {
			element.value = new_id;
		});
	});
})();
