// ==UserScript==
// @name         Steak Rarities
// @namespace    dithpri.RCES
// @version      0.2
// @description  Steak Rarities
// @author       dithpri
// @match        https://www.nationstates.net/*page=deck*
// @downloadURL  https://github.com/dithpri/RCES/raw/master/userscripts/decoration/steak_rarities.user.js
// @grant        none
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
	// aux = lighten(desaturate(adjust-hue(rarity_color, -14), 25.79), 12.16);
	GM_addStyle(`
/* COMMON */
.deckcard-category-common .deckcard-category::before {
  content: "w̶e̶l̶l̶ ̶d̶o̶n̶e̶ SCORCHED"
}
/* S1 */
.deckcard-category-common {
background: rgba(66, 36, 1, 0.1);
}
.deckcard-category-common .deckcard-category {
background: linear-gradient(to top right,rgba(255,255,255,0) 0%,rgb(66, 36, 1) 100%);
}
.deckcard-category-common .deckcard-stripe {
background: rgb(66, 36, 1);
}
/* S2 */
.deckcard-season-2 figure.deckcard-category-common {
background: linear-gradient(112deg,#6e2f13 0%,rgb(66, 36, 1) 100%);
}
/* S3 */
.deckcard-season-3 .deckcard-category-common .s3-slogan{
background: rgb(66, 36, 1);
}
.deckcard-season-3 .deckcard-category-common .deckcard-stripe{
background: rgb(66, 36, 1);
}
.deckcard-season-3 .deckcard-category-common .deckcard-category{
background: rgb(66, 36, 1);
}


/* UNCOMMON */
.deckcard-category-uncommon .deckcard-category::before {
  content: "MEDIUM WELL"
}
/* S1 */
.deckcard-category-uncommon {
background: rgba(132, 79, 41, 0.1);
}
.deckcard-category-uncommon .deckcard-category {
background: linear-gradient(to top right,rgba(255,255,255,0) 0%,rgb(132, 79, 41) 100%);
}
.deckcard-category-uncommon .deckcard-stripe {
background: rgb(132, 79, 41);
}
/* S2 */
.deckcard-season-2 figure.deckcard-category-uncommon {
background: linear-gradient(112deg,#956256 0%,rgb(132, 79, 41) 100%);
}
/* S3 */
.deckcard-season-3 .deckcard-category-uncommon .s3-slogan{
background: rgb(132, 79, 41);
}
.deckcard-season-3 .deckcard-category-uncommon .deckcard-stripe{
background: rgb(132, 79, 41);
}
.deckcard-season-3 .deckcard-category-uncommon .deckcard-category{
background: rgb(132, 79, 41);
}

/* RARE */
.deckcard-category-rare .deckcard-category::before {
  content: "MEDIUM"
}
/* S1 */
.deckcard-category-rare {
background: rgba(206, 118, 91, 0.1);
}
.deckcard-category-rare .deckcard-category {
background: linear-gradient(to top right,rgba(255,255,255,0) 0%,rgb(206, 118, 91) 100%);
}
.deckcard-category-rare .deckcard-stripe {
background: rgb(206, 118, 91);
}
/* S2 */
.deckcard-season-2 figure.deckcard-category-rare {
background: linear-gradient(112deg,#c99e9e 0%,rgb(206, 118, 91) 100%);
}
/* S3 */
.deckcard-season-3 .deckcard-category-rare .s3-slogan{
background: rgb(206, 118, 91);
}
.deckcard-season-3 .deckcard-category-rare .deckcard-stripe{
background: rgb(206, 118, 91);
}
.deckcard-season-3 .deckcard-category-rare .deckcard-category{
background: rgb(206, 118, 91);
}

/* ULTRA-RARE */
.deckcard-category-ultra-rare .deckcard-category::before {
  content: "MEDIUM RARE"
}
/* S1 */
.deckcard-category-ultra-rare {
background: rgba(240, 97, 97, 0.1);
}
.deckcard-category-ultra-rare .deckcard-category {
background: linear-gradient(to top right,rgba(255,255,255,0) 0%,rgb(240, 97, 97) 100%);
}
.deckcard-category-ultra-rare .deckcard-stripe {
background: rgb(240, 97, 97);
}
/* S2 */
.deckcard-season-2 figure.deckcard-category-ultra-rare {
background: linear-gradient(112deg,#e7a8b7 0%,rgb(240, 97, 97) 100%);
}
/* S3 */
.deckcard-season-3 .deckcard-category-ultra-rare .s3-slogan{
background: rgb(240, 97, 97);
}
.deckcard-season-3 .deckcard-category-ultra-rare .deckcard-stripe{
background: rgb(240, 97, 97);
}
.deckcard-season-3 .deckcard-category-ultra-rare .deckcard-category{
background: rgb(240, 97, 97);
}

/* EPIC */
.deckcard-category-epic .deckcard-category::before {
  content: "RARE"
}
/* S1 */
.deckcard-category-epic {
background: rgba(215, 24, 24, 0.1);
}
.deckcard-category-epic .deckcard-category {
background: linear-gradient(to top right,rgba(255,255,255,0) 0%,rgb(215, 24, 24) 100%);
}
.deckcard-category-epic .deckcard-stripe {
background: rgb(215, 24, 24);
}
/* S2 */
.deckcard-season-2 figure.deckcard-category-epic {
background: linear-gradient(112deg,#cf5e78 0%,rgb(215, 24, 24) 100%);
}
/* S3 */
.deckcard-season-3 .deckcard-category-epic .s3-slogan{
background: rgb(215, 24, 24);
}
.deckcard-season-3 .deckcard-category-epic .deckcard-stripe{
background: rgb(215, 24, 24);
}
.deckcard-season-3 .deckcard-category-epic .deckcard-category{
background: rgb(215, 24, 24);
}

/* LEGENDARY */
.deckcard-category-legendary .deckcard-category::before {
  content: "BLUE"
}
/* S1 */
.deckcard-category-legendary {
background: rgba(171, 39, 79, 0.1);
}
.deckcard-category-legendary .deckcard-category {
background: linear-gradient(to top right,rgba(255,255,255,0) 0%,rgb(171, 39, 79) 100%);
}
.deckcard-category-legendary .deckcard-stripe {
background: rgb(171, 39, 79);
}
/* S2 */
.deckcard-season-2 figure.deckcard-category-legendary {
background: linear-gradient(112deg,#b45c8b 0%,rgb(171, 39, 79) 100%);
}
/* S3 */
.deckcard-season-3 .deckcard-category-legendary .s3-slogan{
background: rgb(171, 39, 79);
}
.deckcard-season-3 .deckcard-category-legendary .deckcard-stripe{
background: rgb(171, 39, 79);
}
.deckcard-season-3 .deckcard-category-legendary .deckcard-category{
background: rgb(171, 39, 79);
}

/* S2 stripes */
.deckcard-season-2 .deckcard-stripe {
background-color: none;
background: 0 0;
}
/* S2 category (header) */
.deckcard-season-2 .deckcard-category {
background: 0 0;
}
`);
})();
