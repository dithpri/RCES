// ==UserScript==
// @name         Zoomer nation 🏞 creator 📲📲
// @namespace    dithpri.RCES
// @version      0.1
// @description  Zoomer nation 🏞 creator 📲📲
// @author       dithpri
// @match        https://www.nationstates.net/page=create_nation
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/decoration/zoomer_nation_creator.user.js
// @grant        none
// ==/UserScript==

// Thanks to Conklandi/XKZ for the inspiration!

/*
 * Copyright (c) 2021 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

function GM_addStyle(style) {
	"use strict";
	var node = document.createElement("style");
	node.innerHTML = style;
	document.getElementsByTagName("head")[0].appendChild(node);
}

(function () {
	"use strict";
	document.querySelectorAll("#style-selector label").forEach((el) => {
		let emoji =
			{
				anarchic: "👊🏴",
				libertarian: "🐍",
				capitalist: "🤑💰",
				liberal: "🏳🌈 ",
				centrist: "🤢🤮",
				conservative: "🦅",
				socialist: "☭",
				authoritarian: "👁️",
				tyrannical: "👑🚨",
				random: "⁉️⚙",
			}[el.textContent.toLowerCase()] || "";
		el.textContent = `\u202e${emoji}\u202c ${el.textContent} ${emoji}`;
	});
	document.querySelectorAll(".quiz-dropdowns label").forEach((el) => {
		el.textContent =
			{
				"strongly disagree": "☠️",
				disagree: "❌",
				agree: "✅",
				"strongly agree": "💗",
			}[el.textContent.toLowerCase()] || el.textContent;
	});
	GM_addStyle('#style-selector.flatradio-grid input[type="radio"] + label { width: 30%; white-space: nowrap; }');
})();
