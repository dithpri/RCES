// ==UserScript==
// @name         NsPuppetCreateAssist
// @version      0.2
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

/* This file is meant to be used in conjunction with the generated puppet
 * spreadsheet.
 * I'd also recommend using something like ffpass to import pre-generated
 * nation passwords -- they'll autofill.
 */

const DISCLAIMER = `Take care when using this script - DO NOT CREATE PUPPETS SIMULTANEOUSLY.
Do it ONE AT A TIME.
No Ctrl-Tabbing and rapidly creating many puppets.
For more information, see the NS scripting rules about simultaneous requests.`;

(async function () {
	const currencies = [
		"afghani",
		"ariary",
		"baht",
		"balboa",
		"birr",
		"bolivar soberano",
		"boliviano",
		"cedi",
		"colon",
		"cordoba",
		"dalasi",
		"denar",
		"dinar",
		"dirham",
		"dobra",
		"dollar",
		"dong",
		"dram",
		"escudo",
		"euro",
		"forint",
		"franc",
		"gourde",
		"guarani",
		"guilder",
		"hryvnia",
		"kina",
		"kip",
		"koruna",
		"krona",
		"krone",
		"kuna",
		"kwacha",
		"kwanza",
		"kyat",
		"lari",
		"lek",
		"lempira",
		"leone",
		"leu",
		"lev",
		"lilangeni",
		"lira",
		"loti",
		"manat",
		"marka",
		"metical",
		"naira",
		"nakfa",
		"ngultrum",
		"ouguiya",
		"pa'anga",
		"pataca",
		"peso",
		"pound",
		"pula",
		"quetzal",
		"rand",
		"real",
		"rial",
		"riels",
		"ringgit",
		"ruble",
		"rufiyaa",
		"rupee",
		"rupiah",
		"shekel",
		"shilling",
		"sol",
		"som",
		"somoni",
		"taka",
		"tala",
		"tenge",
		"tugrik",
		"vatu",
		"won",
		"yen",
		"yuan renminbi",
		"zloty",
	];
	const animals = [
		"antelope",
		"bear",
		"beaver",
		"bison",
		"blackbird",
		"bull",
		"camel",
		"carp",
		"chukar",
		"cobra",
		"condor",
		"cow",
		"crane",
		"crocodile",
		"deer",
		"dodo",
		"dolphin",
		"dove",
		"dragon",
		"eagle",
		"elephant",
		"moose",
		"emu",
		"falcon",
		"fish",
		"fox",
		"giraffe",
		"goat",
		"grasshopper",
		"gyrfalcon",
		"holly blue",
		"horse",
		"hyena",
		"ibis",
		"jaguar",
		"kangaroo",
		"kiwi",
		"ladybird",
		"lemur",
		"leopard",
		"lion",
		"lynx",
		"manatee",
		"okapi",
		"oryx",
		"panda",
		"panther",
		"peacock",
		"pheasant",
		"phoenix",
		"robin",
		"rooster",
		"springbok",
		"squirrel",
		"stork",
		"sunbird",
		"swallow",
		"swan",
		"tapir",
		"tiger",
		"tortoise",
		"toucan",
		"turtle",
		"turul",
		"unicorn",
		"wolf",
		"zebra",
		"zebu",
	];
	const mottos = [
		"By The People For The People",
		"We Will Endure",
		"Peace And Justice",
		"Strength Through Freedom",
		"You Can't Stop Progress",
		"Unity, Discipline, Work",
		"Pride And Industry",
		"From Many, One",
		"Mission Accomplished",
		"God, Homeland, Liberty",
		"Justice, Piety, Loyalty",
		"Strength Through Compliance",
		"Might Makes Right",
		"Twirling Toward Freedom",
		"Forward Unto The Dawn",
		"Yeah",
		"This Space For Rent",
		"E Pluribus Unum",
		"Mere Anarchy Is Loosed Upon The World",
		"Mostly Harmless",
		"42",
		"This Space Intentionally Left Blank",
		"This Motto Space For Sale",
		"The Meaning To Life, The Universe, And Everything",
		"Motto",
		"Peace",
		"The Falcon Cannot Hear The Falconer",
		"Revolution And Liberty",
		"Freedom",
		"God Save The Queen",
		"Meh",
		"Never Show Mercy To Your Prey",
		"Strength Through Unity",
		"Carpe Diem",
		"Dieu Et Mon Droit",
		"United We Stand",
		"Live Free Or Die",
		"Liberté, Égalité, Fraternité",
		"Freedom For All",
		"Veni, Vidi, Vici",
		"Long Live The Queen!",
		"To Infinity And Beyond!",
		"Liberty",
		"United We Stand, Divided We Fall",
		"NationStates",
		"Live And Let Live",
		"Unity In Diversity",
		"Freedom Or Death",
		"Winter Is Coming",
		"Ordem E Progresso",
		"Strength In Unity",
	];
	const flags = [
		"Afghanistan.png",
		"Albania.png",
		"Alderney.png",
		"Algeria.png",
		"American_Samoa.png",
		"Andalusia.png",
		"Andorra.png",
		"Angola.png",
		"Anguilla.png",
		"Antigua_and_Barbuda.png",
		"Aragon.png",
		"Argentina.png",
		"Armenia.png",
		"Aruba.png",
		"Asturias.png",
		"Austral_Islands.png",
		"Australia.png",
		"Austria.png",
		"Azerbaijan.png",
		"Azores.png",
		"Bahamas.png",
		"Bahrain.png",
		"Balearic_Islands.png",
		"Bangladesh.png",
		"Barbados.png",
		"Basque_Country.png",
		"Belarus.png",
		"Belgium.png",
		"Belize.png",
		"Benin.png",
		"Bermuda.png",
		"Bhutan.png",
		"Bolivia.png",
		"Bonaire.png",
		"Bosnia_and_Herzegovina.png",
		"Botswana.png",
		"Brazil.png",
		"British_Antarctic_Territory.png",
		"British_Indian_Ocean_Territory.png",
		"British_Virgin_Islands.png",
		"Brunei.png",
		"Bulgaria.png",
		"Burkina_Faso.png",
		"Burundi.png",
		"Cambodia.png",
		"Cameroon.png",
		"Canada.png",
		"Canary_Islands.png",
		"Cantabria.png",
		"Cape_Verde.png",
		"Castile_and_Leon.png",
		"Castilla-La_Mancha.png",
		"Catalonia.png",
		"Cayman_Islands.png",
		"Central_African_Republic.png",
		"Ceuta.png",
		"Chad.png",
		"Chile.png",
		"China.png",
		"Christmas_Island.png",
		"Chuuk.png",
		"Cocos_Islands.png",
		"Colombia.png",
		"Comoros.png",
		"Cook_Islands.png",
		"Costa_Rica.png",
		"Cote_d'Ivoire.png",
		"Croatia.png",
		"Cuba.png",
		"Curacao.png",
		"Cyprus.png",
		"Czech_Republic.png",
		"Default.png",
		"Democratic_Republic_of_the_Congo.png",
		"Denmark.png",
		"Djibouti.png",
		"Dominica.png",
		"Dominican_Republic.png",
		"East_Timor.png",
		"Ecuador.png",
		"Egypt.png",
		"El_Salvador.png",
		"England.png",
		"Equatorial_Guinea.png",
		"Eritrea.png",
		"Estonia.png",
		"Ethiopia.png",
		"Europe.png",
		"Extremadura.png",
		"Falkland_Islands.png",
		"Faroe_Islands.png",
		"Federated_States_of_Micronesia.png",
		"Fiji.png",
		"Finland.png",
		"France.png",
		"French_Polynesia.png",
		"Gabon.png",
		"Galicia.png",
		"Gambia.png",
		"Gambier_Islands.png",
		"Georgia.png",
		"Germany.png",
		"Ghana.png",
		"Gibraltar.png",
		"Greece.png",
		"Greenland.png",
		"Grenada.png",
		"Guam.png",
		"Guatemala.png",
		"Guernsey.png",
		"Guinea-Bissau.png",
		"Guinea.png",
		"Guyana.png",
		"Haiti.png",
		"Herm.png",
		"Honduras.png",
		"Hong_Kong.png",
		"Hungary.png",
		"Iceland.png",
		"India.png",
		"Indonesia.png",
		"Iran.png",
		"Iraq.png",
		"Ireland.png",
		"Isle_of_Man.png",
		"Israel.png",
		"Italy.png",
		"Jamaica.png",
		"Japan.png",
		"Jersey.png",
		"Jordan.png",
		"Kazakhstan.png",
		"Kenya.png",
		"Kiribati.png",
		"Kosovo.png",
		"Kuwait.png",
		"Kyrgyzstan.png",
		"La_Rioja.png",
		"Laos.png",
		"Latvia.png",
		"Lebanon.png",
		"Lesotho.png",
		"Liberia.png",
		"Libya.png",
		"Liechtenstein.png",
		"Lithuania.png",
		"Luxembourg.png",
		"Macau.png",
		"Macedonia.png",
		"Madagascar.png",
		"Madeira.png",
		"Madrid.png",
		"Malawi.png",
		"Malaysia.png",
		"Maldives.png",
		"Mali.png",
		"Malta.png",
		"Marquesas_Islands.png",
		"Marshall_Islands.png",
		"Mauritania.png",
		"Mauritius.png",
		"Melilla.png",
		"Mexico.png",
		"Moldova.png",
		"Monaco.png",
		"Mongolia.png",
		"Montenegro.png",
		"Montserrat.png",
		"Morocco.png",
		"Mozambique.png",
		"Murcia.png",
		"Myanmar.png",
		"Namibia.png",
		"Nauru.png",
		"Navarre.png",
		"Nepal.png",
		"Netherlands.png",
		"New_Caledonia.png",
		"New_Zealand.png",
		"Nicaragua.png",
		"Niger.png",
		"Nigeria.png",
		"Niue.png",
		"Norfolk_Island.png",
		"North_Korea.png",
		"Northern_Mariana_Islands.png",
		"Norway.png",
		"Oman.png",
		"Pakistan.png",
		"Palau.png",
		"Palestine.png",
		"Panama.png",
		"Papua_New_Guinea.png",
		"Paraguay.png",
		"People's_Republic_of_China.png",
		"Peru.png",
		"Philippines.png",
		"Pitcairn_Islands.png",
		"Poland.png",
		"Portugal.png",
		"Puerto_Rico.png",
		"Qatar.png",
		"Rapa_Nui.png",
		"Republic_of_China.png",
		"Republic_of_the_Congo.png",
		"Romania.png",
		"Russia.png",
		"Rwanda.png",
		"Saba.png",
		"Saint-Pierre_and_Miquelon.png",
		"Saint_Helena.png",
		"Saint_Kitts_and_Nevis.png",
		"Saint_Lucia.png",
		"Saint_Vincent_and_the_Grenadines.png",
		"Samoa.png",
		"San_Marino.png",
		"Sao_Tome_and_Principe.png",
		"Sark.png",
		"Saudi_Arabia.png",
		"Scotland.png",
		"Sealand.png",
		"Senegal.png",
		"Serbia.png",
		"Seychelles.png",
		"Sierra_Leone.png",
		"Singapore.png",
		"Sint_Eustatius.png",
		"Sint_Maarten.png",
		"Slovakia.png",
		"Slovenia.png",
		"Solomon_Islands.png",
		"Somalia.png",
		"South_Africa.png",
		"South_Korea.png",
		"South_Sudan.png",
		"Sovereign_Military_Order_of_Malta.png",
		"Spain.png",
		"Sri_Lanka.png",
		"Sudan.png",
		"Suriname.png",
		"Swaziland.png",
		"Sweden.png",
		"Switzerland.png",
		"Syria.png",
		"Tajikistan.png",
		"Tanzania.png",
		"Thailand.png",
		"Tibet.png",
		"Togo.png",
		"Tokelau.png",
		"Tonga.png",
		"Trinidad_and_Tobago.png",
		"Tristan_da_Cunha.png",
		"Tuamotu_Archipelago.png",
		"Tunisia.png",
		"Turkey.png",
		"Turkmenistan.png",
		"Turks_and_Caicos_Islands.png",
		"Tuvalu.png",
		"Uganda.png",
		"Ukraine.png",
		"United_Arab_Emirates.png",
		"United_Kingdom.png",
		"United_States_Virgin_Islands.png",
		"United_States_of_America.png",
		"Uruguay.png",
		"Uzbekistan.png",
		"Valencian_Community.png",
		"Vanuatu.png",
		"Vatican_City.png",
		"Venezuela.png",
		"Vietnam.png",
		"Wales.png",
		"West_Papua.png",
		"Yap.png",
		"Yemen.png",
		"Zambia.png",
		"Zanzibar.png",
		"Zimbabwe.png",
	];
	const animal = animals[Math.floor(Math.random() * animals.length)];
	const motto = mottos[Math.floor(Math.random() * mottos.length)];
	const classification = Math.floor(Math.random() * 39 + 100);
	const currency = currencies[Math.floor(Math.random() * currencies.length)];
	const flag = flags[Math.floor(Math.random() * flags.length)];
	const econ = Math.floor(Math.random() * 99 + 1);
	const civil = Math.floor(Math.random() * 99 + 1);
	const polit = Math.floor(Math.random() * 99 + 1);

	if (!(await GM.getValue("NsPuppetCreateAssist_disclaimer_read", null))) {
		if (
			prompt(DISCLAIMER + "\nEnter 'I understand' in the box below to continue").toLowerCase() == "i understand"
		) {
			GM.setValue("NsPuppetCreateAssist_disclaimer_read", 1);
		} else {
			return;
		}
	}

	const puppetCreationForm = `
    <br/>
    <big><strong>${DISCLAIMER.replaceAll("\n", "<br/>")}</strong></big>
    <hr/>
<form method="POST" action="/cgi-bin/build_nation.cgi" id="x-rces-cp-onestep-form" name="form" onSubmit="submitForm(form.create_nation,'<i class=\'icon-flag-1\'></i>Creating...');">

<table>
<tr><td>
<label for="x-rces-cp-nation-name">Nation name:</label>
</td><td>
<input name="nation" id="x-rces-cp-nation-name" maxlength="40" type="text" value="" style="font-size:150%" autofocus required placeholder="Nation Name...">
</td></tr>

<tr><td>
Password:
</td><td>
<input type="password" id="x-rces-cp-pass" name="password" value="" required placeholder="Password...">
</td></tr>

<tr><td>
E-mail:
</td><td>
<input name="email" type="email" value="" placeholder="E-mail...">
</td></tr>

<tr><td>
Motto:
</td><td>
<input name="slogan" maxlength="55" type="text" value="${motto}" placeholder="Motto..." />
</td></tr>

<tr><td>
Currency:
</td><td>
<input name="currency" maxlength="40" type="text" value="${currency}" placeholder="currency...">
</td></tr>

<tr><td>
National Animal:
</td><td>
<input name="animal" maxlength="40" type="text" value="${animal}" placeholder="animal...">
</td></tr>
<tr><td>

Classification (aka. Pretitle):
</td><td>
<select id="type" name="type" style="display: none">
<option value="${classification}">(RANDOM)</option>
</select>
RANDOM: ${classification}
</td></tr>

<tr><td>
Flag:
</td><td>
<select id="flag" name="flag" style="display: none">
<option selected value="${flag}">(RANDOM)</option>
</select>
RANDOM: ${flag}
</td></tr>

<tr><td>
Civil/Econ/Polit freedoms
</td><td>
<input type="text" name="style" value="${civil}.${econ}.${polit}" readonly>
</td></tr>

</table>



<br>
<input id="x-rces-cp-rememberme" type="checkbox" name="autologin" value="1" checked style="vertical-align:bottom">
<label for="x-rces-cp-rememberme">Remember me</label>
<br>
<input type="checkbox" name="legal" value="1" id="legal" checked required="required">
<label for="legal">I agree to the NationStates <a href="/page=legal" class="ttq" id="ttq_2">Terms &amp; Conditions</a>.</label>
<br>

<input type="hidden" name="name" id="name" value="">
<input type="hidden" id="x-rces-cp-confirm-pass" name="confirm_password" value="" required placeholder="Password...">
<input type="hidden" name="history" value="">
<input type="hidden" name="q0" value="">
<input type="hidden" name="q1" value="">
<input type="hidden" name="q2" value="">
<input type="hidden" name="q3" value="">
<input type="hidden" name="q4" value="">
<input type="hidden" name="q5" value="">
<input type="hidden" name="q6" value="">
<input type="hidden" name="q7" value="">
<button type="submit" class="button" value="1" name="create_nation"><i class="icon-flag-1"></i> Create Nation</button>
<br>

</form>
`;
	let hook = document.getElementById("content");
	if (hook) {
		hook.innerHTML = puppetCreationForm;
	} else {
		document.body.innerHTML = puppetCreationForm;
	}

	document.getElementById("x-rces-cp-onestep-form").onsubmit = function () {
		document.getElementById("name").value = document.getElementById("x-rces-cp-nation-name").value;
		document.getElementById("x-rces-cp-confirm-pass").value = document.getElementById("x-rces-cp-pass").value;
		return true;
	};
	document.getElementById("x-rces-cp-nation-name").value = location.href
		.replace(/^.*\/x-rces-cp\?x-rces-cp-nation=([A-Za-z0-9_-]+)$/, "$1")
		.replace(/_/g, " ");
	document.getElementById("x-rces-cp-nation-name").focus();
})();
