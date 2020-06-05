// ==UserScript==
// @name         NsDilemmaAutoClose
// @version      0.1
// @namespace    dithpri.RCES
// @description  Auto-close resolved dilemma windows
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/src/issue_answering/NsDilemmaAutoClose.user.js
// @noframes
// @match        https://www.nationstates.net/page=enact_dilemma/*
// @grant        window.close
// @run-at       document-start
// ==/UserScript==

/* This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

(function () {
    'use strict';
    window.close();
})();

