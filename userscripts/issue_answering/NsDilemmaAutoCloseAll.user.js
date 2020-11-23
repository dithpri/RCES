// ==UserScript==
// @name         NsDilemmaAutoCloseAll
// @version      0.1
// @namespace    dithpri.RCES
// @description  Auto-close resolved dilemma windows (even if a pack is generated)
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/issue_answering/NsDilemmaAutoCloseAll.user.js
// @noframes
// @match        https://www.nationstates.net/*page=enact_dilemma/*x-rces=autoclose*
// @grant        window.close
// @run-at       document-start
// ==/UserScript==

/*
 * Copyright (c) 2019-2020 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

(function () {
	"use strict";
	window.close();
})();
