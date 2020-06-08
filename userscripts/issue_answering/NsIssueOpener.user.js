// ==UserScript==
// @name         NsIssueOpener
// @version      0.5
// @namespace    dithpri.RCES
// @description  Open issues in new tab with no decorations
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/issue_answering/NsIssueOpener.user.js
// @noframes
// @match        https://www.nationstates.net/*page=dilemmas*
// @grant        window.close
// @run-at       document-body
// ==/UserScript==

/*
 * Copyright (c) 2019-2020 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

(function () {
    "use strict";

    // Open on user click in new tab
    Array.from(document.querySelectorAll(".dilemmalist > li >a"))
        .filter(x => { console.log(x); return x.getAttribute("href").match(/^\/?page=show_dilemma\/dilemma=/) })
        .map(val => {
            val.classList.add("rces-dilemmalink");
            val.setAttribute("target", "_blank");
            val.setAttribute("href", val.getAttribute("href") + "/template-overall=none/x-rces=openissue");
            // Remove issues from the list after it has been opened
            val.addEventListener("click", event => {
                val.parentElement.remove();
                // Close page if all issues have been opened
                if (document.querySelector(".dilemmalist").textContent.trim() == "") {
                    setTimeout(window.close, 100);
                } else /* focus on next issue */ {
                    document.querySelector(".rces-dilemmalink").focus();
                }
            });
            return val;
        })[0].focus();

    // Close page if no issues
    const issuestxt = document.querySelector(".dilemmalist").textContent.trim();
    if (issuestxt == "" || issuestxt == "There are no current issues.") {
        if (!document.body.id == "loggedout") {
            window.close();
        }
    }
})();
