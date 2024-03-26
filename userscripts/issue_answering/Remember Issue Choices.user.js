// ==UserScript==
// @name         Remember Issue Choices
// @version      0.2.3
// @namespace    dithpri.RCES
// @description  Remembers previous issue choices
// @author       dithpri
// @match        https://www.nationstates.net/*page=show_dilemma*
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/issue_answering/Remember%20Issue%20Choices.user.js
// @noframes
// @grant        GM.setValue
// @grant        GM.getValue
// ==/UserScript==

/*
 * Copyright (c) 2021-2022 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 *
 */

function addStyle(style) {
	"use strict";
	var node = document.createElement("style");
	node.innerHTML = style;
	document.getElementsByTagName("head")[0].appendChild(node);
}

(async function () {
	"use strict";

	const dilemmaId = document
		.querySelector('form[action^="/page=enact_dilemma/"]')
		.action.replace(/.*dilemma=([0-9]+).*/, "$1");

	let previousChoices = new Proxy(JSON.parse(await GM.getValue(dilemmaId, "{}")), {
		get: (target, name) => (name in target ? target[name] : 0),
	});

	const mostChosenList = [...Object.entries(previousChoices)].sort(([, a], [, b]) => b - a).map(([x]) => x);
	const totalChoices = [...Object.entries(previousChoices)].map(([, x]) => x).reduce((acc, x) => acc + x);

	[...document.querySelectorAll('button[name^="choice-"]')].forEach((button) => {
		const choiceId = button.name.replace(/^choice-/, "");
		button.addEventListener("click", function () {
			previousChoices[choiceId]++;
			GM.setValue(dilemmaId, JSON.stringify(previousChoices));
		});
		const chosenCountWrapper = document.createElement("div");
		chosenCountWrapper.classList.add("rces-choicehistory");
		chosenCountWrapper.classList.add("info");
		const idx = mostChosenList.findIndex((x) => x == choiceId);
		if (idx <= 3 && idx != -1) {
			chosenCountWrapper.classList.add(`rces-choicehistory-preferred-${idx}`);
		}
		const cntChosen = previousChoices[choiceId];
		if (cntChosen > 0) {
			chosenCountWrapper.innerText += `Chosen ${(((previousChoices[choiceId] / totalChoices) * 100) | 0).toFixed(
				0
			)}% of the time (${previousChoices[choiceId]}/${totalChoices})`;
		} else {
			chosenCountWrapper.innerText = `Never chosen.`;
		}
		if (choiceId == -1) {
			chosenCountWrapper.style.float = "left";
		}
		button.insertAdjacentElement("afterend", chosenCountWrapper);
	});

	addStyle(`
	.rces-choicehistory {
		border-color: grey;
		visibility: initial;
		padding: 0.15em;
		width: fit-content;
		float: right;
		margin: 0 0.1em;
	}
	.rces-choicehistory-preferred-0 {
		border-color: green;
	}
	.rces-choicehistory-preferred-1 {
		border-color: darkcyan;
	}
	.rces-choicehistory-preferred-2 {
		border-color: orange;
	}
	.rces-choicehistory-preferred-3 {
		border-color: rosybrown;
	}
	`);
})();
