// ==UserScript==
// @name         InvaderNS
// @version      0.1
// @description  Da ba dee da ba daa
// @author       dithpri
// @match        https://www.nationstates.net/*
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/decoration/invader.user.js
// @run-at       document-body
// ==/UserScript==

/*
 * Copyright (c) 2020 dithpri (Racoda) <dithpri@gmail.com>
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
	document.getElementsByTagName("body")[0].insertAdjacentHTML(
		"beforeend",
		`<svg style="position: absolute;
  height: 0; width: 0;
  overflow: none;
  left: -100%;">
  <filter id="longuniquenamethatnsdoesntuse" color-interpolation-filters="sRGB"
          x="0" y="0" height="100%" width="100%">
    <feColorMatrix type="matrix"
      values="1  0  0  0  0
              0  0  0  0  0
              -1 0  0  0  1
              0  0  0  1  0" />
  </filter>
</svg>`
	);

	GM_addStyle(
		`body {filter: contrast(150%) grayscale(100%) url("#longuniquenamethatnsdoesntuse")}`
	);
})();
