# RCES


<details><summary>Table of contents</summary>

- [RCES](#rces)
  - [DISCLAIMER](#disclaimer)
  - [Usage](#Usage)
  - [About](#about)
  - [Licensing](#licensing)
  - [Bugs](#bugs)
  - [GreaseMonkey](#greasemonkey)
  - [What does RCES stand for?](#what-does-rces-stand-for)
  - [Contributing](#contributing)
  - [Description of all utilities](#description-of-all-utilities)
    - [Issue Scripts](#issue-scripts)
      - [Remember Issue Choices](#remember-issue-choices)
      - [Cards issue answering scripts](#cards-issue-answering-scripts)
    - [Auction Utilities](#auction-utilities)
      - [Card Default Prices](#card-default-prices)
      - [Main Auction Displayer](#main-auction-displayer)
      - [Alternate Auction Layout](#alternate-auction-layout)
      - [localid Synchronizer](#localid-synchronizer)
      - [Highlighters](#highlighters)
        - [Universal Member Highlighter](#universal-member-highlighter)
        - [TNP Guild Highlighter](#tnp-guild-highlighter)
        - [Gardener Highlighter](#gardener-highlighter)
        - [NASPAQ Highlighter](#naspaq-highlighter)
    - [Miscellaneous](#miscellaneous)
      - [Better Card Page Titles](#better-card-page-titles)
      - [Auction Keybindings](#auction-keybindings)
      - [Cards Icon / Deck page link](#cards-icon--deck-page-link)
      - [Container Owner Links](#container-owner-links)
      - [Junk Confirmation Changer](#junk-confirmation-changer)
      - [Puppet Creation Assistant](#puppet-creation-assistant)
      - [Boneyard Card Links](#boneyard-card-links)
    - ["Decoration"](#decoration)
      - [IntruderNS](#intruderns)
      - [Steak Rarities](#steak-rarities)
      - [Zoomer Nation Creator](#zoomer-nation-creator)
    - [Puppet links sheet](#puppet-links-sheet)
    - [Owner report](#owner-report)
    - [goldretriever-web](#goldretriever-web)

</details>

---

## DISCLAIMER

⚠️ ***These scripts are not endorsed by NationStates nor by NationStates staff.*** ⚠️

Though these scripts are, to the best of my knowledge, legal, you should
read the NationStates [scripting rules](https://forum.nationstates.net/viewtopic.php?p=16394966#p16394966)
*BEFORE* using them. The most important takeaway is that YOU, the user,
shouldn't try to automate **restricted actions**.

When a script pauses and waits for your input, you should interact with
it manually.
That means no running another script to automate clicks or keypresses,
no placing water bottles on the keyboard, no `yes | ./script`.

---

## Usage

For userscripts (`.user.js` extension) - the majority of this repo, you'll
just need a userscript manager, like
[Violentmonkey](https://addons.mozilla.org/en-US/firefox/addon/violentmonkey/)
or
[Tampermonkey](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/).
Once you have the browser extension installed, you can click one of the
"Install" buttons below to install the script.

---

## About

This is a repository of various scripts that I've coded in 2019/2020 to help
with [NationStates](https://www.nationstates.net) card farming.

Each userscript or utility is designed to be a self-contained module, so that
the whole project can be mixed-and-matched.

Most of them have been created in mid- to late-2019 and have since evolved
significantly. Some of them were previously scattered through Discord and
various gists, notably:

  * [Default Prices](https://gist.github.com/dithpri/d443d2873a4b6212fc0b32894ce15707)
  * [TNP Guild Highlighter](https://gist.github.com/dithpri/7f06ce1bf64d2a4b5ec9225da2f1e3df)
  * [Main Auction Displayer](https://gist.github.com/dithpri/6a3fb524e59755510b18e676039b16d2)
  * [Gardener Highlighter](https://gist.github.com/dithpri/93015dd7281c579ed267dafdf5e97b8d)

I'm in the process of consolidating them into this repository to make
management easier and for them to be available to a wider public.

---

## Licensing

This project is under the [MIT License](LICENSE.md). However, some of the
sources have previously been made available under the 0BSD license. All of the
scripts included in the first repository commit are available, in that form,
under the 0BSD license. Everything added or created in subsequent commits is
available under the MIT license. For details, see [LICENSE.md](LICENSE.md).

Additionally, any image resources in this repo, including (but not limited to)
those embedded in `Guildies Auction Highlighter UwU` and `Gardener Highlighter`
are **NOT** under the MIT license. You'll have to contact their respective
owners/creators for terms of use.

---

## Bugs

Please report any bugs you encounter by filing an issue. The UserScripts were
tested with TamperMonkey but *should* also work with compatible engines (ex.
ViolentMonkey).  

## GreaseMonkey

*May* work with GreaseMonkey. GreaseMonkey is ***not*** supported. Bugs only
appearing on GreaseMonkey are unlikely to be fixed.

---

## What does RCES stand for?

I forgot. I like to invent acronyms and forget what they're all about.

---

## Contributing

Just open a pull request.

---

## Description of all utilities

### [Issue Scripts](userscripts/issue_answering)

#### [Remember Issue Choices](userscripts/issue_answering/Remember%20Issue%20Choices.user.js)
[Install](../../raw/master/userscripts/issue_answering/Remember%20Issue%20Choices.user.js)  
For those more stats-oriented, or just not wanting to re-read each issue when it
pops up, this script will remember your previous choices and remind you of them
when answering issues.

#### Cards issue answering scripts
These consist of three scripts. When used together, issue answering can be done
just by pressing enter repeatedly:
  * [NsIssueOpener](userscripts/issue_answering/NsIssueOpener.user.js) | [Install](../../raw/master/userscripts/issue_answering/NsIssueOpener.user.js)  
  no more
  clicking! Just keep pressing enter to open links to unanswered issues in a new
  tab.
  * [NsIssueCompactorRand](userscripts/issue_answering/NsIssueCompactorRand.user.js) | [Install](../../raw/master/userscripts/issue_answering/NsIssueCompactorRand.user.js)  
  [NsIssueCompactorRand (GreaseMonkey)](../GM-Hacks/userscripts/issue_answering/NsIssueCompactorRand.user.js) | [GreaseMonkey Install](../../raw/GM-Hacks/userscripts/issue_answering/NsIssueCompactorRand.user.js)  
  removes all the fluff and text around issue, focusing on a random option.
  Press enter and voilà: issue answered. *The issue has to be opened using the
  previous script.*
  * Autoclose:
    * [NsDilemmaAutoClose](userscripts/issue_answering/NsDilemmaAutoClose.user.js) | [Install](../../raw/master/userscripts/issue_answering/NsDilemmaAutoClose.user.js)  
    Offers to open the card pack the issue generated. If no pack was
    generated, closes the tab. *The issue has to be answered using the previous
    script.*  
    * [NsDilemmaAutoCloseAll](userscripts/issue_answering/NsDilemmaAutoCloseAll.user.js) | [Install](../../raw/master/userscripts/issue_answering/NsDilemmaAutoCloseAll.user.js)  
    Closes the tab after an issue has been answered. Even if a pack was
    generated. *The issue has to be answered using the previous script*

---

### [Auction Utilities](userscripts/auction)

#### [Card Default Prices](userscripts/auction/Card%20Default%20Prices.user.js)
[Install](../../raw/master/userscripts/auction/Card%20Default%20Prices.user.js)  
Pretty straightforward: change the default starting price when placing an ask or
bid. You'll have to edit the value in the script manually (for now).

#### [Main Auction Displayer](userscripts/auction/Main%20Auction%20Displayer.user.js)
[Install](../../raw/master/userscripts/auction/Main%20Auction%20Displayer.user.js)  
Contacts several Google Spreadsheets (that were totally never ever secret) with
known puppets and puppetmasters. Adds the puppetmaster's name next to the
puppet. The currently used spreadsheets are
[9003](https://www.nationstates.net/nation=9003)'s puppet reporting spreadsheet
and [XKI](https://www.nationstates.net/region=10000_islands)'s Card Co-op
spreadsheet.

#### [Alternate Auction Layout](userscripts/auction/Alternate%20Auction%20Layout.user.js)
[Install](../../raw/master/userscripts/auction/Alternate%20Auction%20Layout.user.js)  
An alternate, wider auction layout better suited designed to minimize scrolling,
with some extra tweaks:
 * The card, auction (bids/asks/matches) and information table
   (owners/copies...) will be displayed side-by side.
 * The Sell and Buy buttons are located *above* the auction instead of below.
 * Identical bids/asks (same nation and same amount) are collapsed into one.
 * Exact matches (bid is equal to ask) will only display the match value.

#### [localid Synchronizer](userscripts/auction/localid%20Synchronizer.user.js)
[Install](../../raw/master/userscripts/auction/localid%20Synchronizer.user.js)  
Synchronizes the `localid` across card pages. In short, you don't have to reload
the auction page anymore to avoid those security errors when you have multiple
tabs open.

#### Highlighters

##### [Universal Member Highlighter](userscripts/auction/Universal%20Member%20Highlighter.user.js)
[Install](../../raw/master/userscripts/auction/Universal%20Member%20Highlighter.user.js)  
<s>**ViolentMonkey/TamperMonkey only.**</s> Should work on all userscript extensions. Best used on a modern one like VM/TM.  
A universal highlighter. You can load various card organizations' configs
instead of having multiple highlighter scripts running. This also makes it much
easier for card organizations to have a highlighter, without having to duplicate
existing code. A curated list of configs is available [here](resources/umh-configs.md).  
To add a config, navigate to the [NS settings page](https://www.nationstates.net/page=settings) and click the *Universal Member Highlighter settings* button. If using TM/VM, you can also do this through the extension menu on a card page.

<details>
<summary>Organization-specific highlighters</summary>

##### [TNP Guild Highlighter](userscripts/auction/Guildies%20Auction%20Highlighter%20UwU.user.js)
[Install](../../raw/master/userscripts/auction/Guildies%20Auction%20Highlighter%20UwU.user.js)  
Adds an icon of TNP's Cards Guild next to guild members during an auction.

##### [Gardener Highlighter](userscripts/auction/Gardener%20Highlighter.user.js)
[Install](../../raw/master/userscripts/auction/Gardener%20Highlighter.user.js)  
The same as the Guild Highlighter, except for members of the Card Gardening
Society.

##### [NASPAQ Highlighter](userscripts/auction/NASPAQ%20Highlighter.user.js)
[Install](../../raw/master/userscripts/auction/NASPAQ%20Highlighter.user.js)  
Highlighter for NASPAQ members.
</details>

---

### [Miscellaneous](userscripts/miscellaneous)

#### [Better Card Page Titles](userscripts/miscellaneous/Better%20Card%20Page%20Titles.user.js)
[Install](../../raw/master/userscripts/miscellaneous/Better%20Card%20Page%20Titles.user.js)  
Tweaks the titles on card pages to be more descriptive instead of the default
"NationStates | Trading Cards".

<details>
<summary>Examples</summary>

* `NationStates | Trading Cards | Live Auctions`
* `NationStates | Trading Cards | {nation}'s deck`
* `NationStates | Trading Cards | {nation}'s Trades | Sales`
* `NationStates | Trading Cards | {nation} (S{season})`
* etc.
</details>

#### [Auction Keybindings](userscripts/miscellaneous/auction-keybindings.user.js)
[Install](../../raw/master/userscripts/miscellaneous/auction-keybindings.user.js)  
An early version of keybindings for the auction page.<s> A more complete version is
being worked on.</s> These are the available bindings for now:
<details>

  * **A**sk / **S**ell
  * **B**id / **B**uy
  * **M**atch
  * **G**ift
  * **M**atch
  * Market **V**alue match
  * **R**emove ask/bid
  * **C**hange ask/bid
  
</details>

#### [Cards Icon / Deck page link](userscripts/miscellaneous/cards-icon.user.js)
[Install](../../raw/master/userscripts/miscellaneous/cards-icon.user.js)  
Depending on NS theme, adds either a cards icon to the top banner or a link in
the menu. Both the link and icon redirect to the deck page.

#### [Container Owner Links](userscripts/miscellaneous/Container%20Owner%20Links.user.js)
[Install](../../raw/master/userscripts/miscellaneous/Container%20Owner%20Links.user.js)  
Adds nifty links next to nations on the card owners page. Clicking on them will copy the appropriate container link (for you to send when requesting cards from others).

#### [Junk Confirmation Changer](userscripts/miscellaneous/Junk%20Confirmation%20Changer.user.js)
[Install](../../raw/master/userscripts/miscellaneous/Junk%20Confirmation%20Changer.user.js)
Allows you to tweak the conditions for when a junking confirmation popup
appears.

#### [Boneyard Card Links](userscripts/miscellaneous/Boneyard%20Card%20Links.user.js)
[Install](../../raw/master/userscripts/miscellaneous/Boneyard%20Card%20Links.user.js)  
Adds a link to the nation's trading card on the boneyard page. No longer
necessary, as it is implemented by NS.

---

### ["Decoration"](userscripts/decoration)

#### [IntruderNS](userscripts/decoration/intruder.user.js)
[Install](../../raw/master/userscripts/decoration/intruder.user.js)  
The hidden NationStates Intruder theme. For real GPers™.

#### [Steak Rarities](userscripts/decoration/steak_rarities.user.js)
[Install](../../raw/master/userscripts/decoration/steak_rarities.user.js)  
Would you like to know what kind of steak your card is?

#### [Zoomer Nation Creator](userscripts/decoration/zoomer_nation_creator.user.js)
[Install](../../raw/master/userscripts/decoration/zoomer_nation_creator.user.js)  
...

---

### [Puppet links sheet](puppet_links_sheet)
[Downloads](../../releases)  
A python script to generate a sheet of clickable links pointing to various
puppets. Best used with the Containerise extension for maximum efficiency. Also
generates rules for Containerise so you don't have to.

[There's this guide for more information on the extension and how it's tied to
farming.](https://www.nationstates.net/page=dispatch/id=1383002)

By default, links to *issues*, *the deck page* (3 variants), *telegrams*,
*settings*, *telegram settings* and the nation itself. Configurable through the
`config.txt` file. Puppets (or future puppets) go in `puppets_list.txt`

---

### [Owner report](owner_report)
[Downloads](../../releases)  
A python script that reads a list of cards and/or a list of puppets. It will
spit out the number of owners, number of copies and who the owners are for each
card. If provided with the list of puppets to check, it will do so for each card
on the puppets. Cards go in the `cards.txt` file, puppets in `puppets.txt`.

---

### [goldretriever-web](https://dithpri.github.io/goldretriever-web/build/index.html)
[Use](https://dithpri.github.io/goldretriever-web/build/index.html)  
This is a web version of
[Valentine Z's goldretriever](https://forum.nationstates.net/viewtopic.php?f=42&t=476326)

Source is available [here](https://github.com/dithpri/goldretriever-web).
