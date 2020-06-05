// ==UserScript==
// @name         Main Auction Displayer
// @version      0.8
// @namespace    dithpri.RCES
// @description  Displays puppets' main nation above puppet name in an auction
// @author       dithpri
// @downloadURL  https://github.com/dithpri/RCES/raw/master/src/auction/Main%20Auction%20Displayer.user.js
// @noframes
// @match        https://www.nationstates.net/*/page=deck/*
// @match        https://www.nationstates.net/page=deck/*
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @connect      docs.google.com
// ==/UserScript==

/* 
 * Copyright (c) 2020 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
 */

/* Permissions:
 *
 * GM.xmlHttpRequest, `connect docs.google.com`:
 *     to automatically fetch and update the puppet list.
 *
 * GM.setValue, GM.getValue:
 *     to save and load the puppet list locally.
 */

(async function () {
    'use strict';
    const canonicalize = function (name) {
        return name.trim().toLowerCase().replace(/ /g, "_");
    }

    const update_puppets = async function (isAuctionPage) {
        const puppets_map = JSON.parse(await GM.getValue("rces-main-nations", "{}"));
        if (isAuctionPage) {
            document.querySelectorAll("#cardauctiontable > tbody > tr > td > p > a.nlink, .deckcard-title > a.nlink:not(.rces-was-parsed)").forEach(function (el, i) {
                const canonical_nname = el.getAttribute("href").replace(/^nation=/, "");
                el.classList.add("rces-was-parsed");
                if (Object.prototype.hasOwnProperty.call(puppets_map, canonical_nname)) {
                    const puppetmaster = puppets_map[canonical_nname];
                    el.insertAdjacentHTML('beforebegin', (`<a href="nation=${canonicalize(puppetmaster)}" class="nlink rces-was-parsed">(<span class="nnameblock">${puppetmaster}</span>)</a><br />`));
                }
            });
        }
        document.querySelectorAll("a.nlink:not(.rces-was-parsed)").forEach(function (el, i) {
            const canonical_nname = el.getAttribute("href").replace(/^nation=/, "");
            if (Object.prototype.hasOwnProperty.call(puppets_map, canonical_nname)) {
                const puppetmaster = puppets_map[canonical_nname];
                el.classList.add("rces-was-parsed");
                el.insertAdjacentHTML('afterend', (`&nbsp;<a href="nation=${canonicalize(puppetmaster)}" class="nlink rces-was-parsed">(<span class="nnameblock">${puppetmaster}</span>)</a>`));
            }
        });
    };

    // If we haven't updated in the last 24h
    if ((await GM.getValue("rces-main-nations-lastupdate", 0)) + 24 * 60 * 60 * 1000 < (new Date().getTime())) {
        GM.xmlHttpRequest({
            method: "GET",
            url: "https://docs.google.com/spreadsheets/d/1MZ-4GLWAZDgB1TDvwtssEcVKHKunOKi3l90Jof1pBB4/export?format=tsv&id=1MZ-4GLWAZDgB1TDvwtssEcVKHKunOKi3l90Jof1pBB4&gid=733627866",
            onload: async function (data) {
                await GM.setValue("rces-main-nations", JSON.stringify(data.responseText
                    .split("\n")
                    .map((x) => x.split("\t").slice(0, 1 + 1))
                    .slice(1)
                    .reduce(function (map, obj) {
                        map[canonicalize(obj[0].trim())] = obj[1].trim();
                        return map;
                    }, {})));

                GM.setValue("rces-main-nations-lastupdate", new Date().getTime());
            }
        });
    }

    if (document.getElementById("auctiontablebox")) {
        update_puppets(true);
        let observer = new MutationObserver(function (mutationList) {
            update_puppets(true);
        });

        const observerOptions = {
            childList: true
        };

        observer.observe(document.getElementById("auctiontablebox"), observerOptions);
    } else {
        update_puppets(false);
    }
})();
