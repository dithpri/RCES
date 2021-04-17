# RCES

- [RCES](#rces)
  - [DISCLAIMER](#disclaimer)
  - [About](#about)
  - [Licensing](#licensing)
  - [Bugs](#bugs)
  - [What does RCES stand for?](#what-does-rces-stand-for)
  - [Contributing](#contributing)
  - [Description of all utilities](#description-of-all-utilities)
    - [Issue Answering Scripts](#issue-answering-scripts)
    - [Auction Utilities](#auction-utilities)
      - [Card Default Prices](#card-default-prices)
      - [Main Auction Displayer](#main-auction-displayer)
      - [Highlighters](#highlighters)
        - [Universal Member Highlighter](#universal-member-highlighter)
        - [TNP Guild Highlighter](#tnp-guild-highlighter)
        - [Gardener Highlighter](#gardener-highlighter)
        - [NASPAQ Highlighter](#naspaq-highlighter)
    - [Miscellaneous](#miscellaneous)
      - [Better Card Page Titles](#better-card-page-titles)
      - [Auction Keybdindings](#auction-keybdindings)
      - [Puppet Creation Assistant](#puppet-creation-assistant)
      - [Cards Icon / Deck page link](#cards-icon--deck-page-link)
    - ["Decoration"](#decoration)
      - [InvaderNS](#invaderns)
      - [Steak Rarities](#steak-rarities)
    - [Puppet links sheet](#puppet-links-sheet)
    - [Owner report](#owner-report)
    - [goldretriever-web](#goldretriever-web)

---

## DISCLAIMER

Though these scripts are, to the best of my knowledge, legal, you should
read the NationStates [scripting rules](https://forum.nationstates.net/viewtopic.php?p=16394966#p16394966)
*BEFORE* using them. The most important takeaway is that YOU, the user,
shouldn't try to automate **restricted actions**.

When a script pauses and waits for your input, you should interact with
it manually.
That means no running another script to automate clicks or keypresses,
no placing water bottles on the keyboard, no `yes | ./script`.

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

Additionally, the image resources included in the
`Guildies Auction Highlighter UwU` and `Garderner Highlighter` are **NOT**
under the MIT license. You'll have to contact their respective owners/creators
for terms of use.

---

## Bugs

Please report any bugs you encounter by filing an issue. The UserScripts were
tested with TamperMonkey but *should* also work with compatible engines (ex.
ViolentMonkey).  
*May* work with GreaseMonkey.

---

## What does RCES stand for?

I forgot. I like to invent acronyms and forget what they're all about.

---

## Contributing

Just open a pull request.

---

## Description of all utilities

### [Issue Answering Scripts](userscripts/issue_answering)

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
#### Highlighters

##### [Universal Member Highlighter](userscripts/auction/Universal%20Member%20Highlighter.user.js)
[Install](../../raw/master/userscripts/auction/Universal%20Member%20Highlighter.user.js)  
**Tampermonkey only.**  
A universal highlighter. You can load various card organizations' configs
instead of having multiple highlighter scripts running. This also makes it much
easier for card organizations to have a highlighter, without having to duplicate
existing code.

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

#### [Auction Keybdindings](userscripts/miscellaneous/auction-keybindings.user.js)
[Install](../../raw/master/userscripts/miscellaneous/auction-keybindings.user.js)  
An early version of keybindings for the auction page. A more complete version is
being worked on. These are the available bindings for now:
  * **A**sk / **S**ell
  * **B**id / **B**uy
  * **M**atch
  * **G**ift

#### [Puppet Creation Assistant](userscripts/miscellaneous/NsPuppetCreateAssist.user.js)
[Install](../../raw/master/userscripts/miscellaneous/NsPuppetCreateAssist.user.js)  
Assists with one-click creation of puppet nations. All fields (except password
and name) are chosen randomly. Works with the `Create puppet` links in the
[puppet links sheet](#puppet-links-sheet).

#### [Cards Icon / Deck page link](userscripts/miscellaneous/cards-icon.user.js)
[Install](../../raw/master/userscripts/miscellaneous/cards-icon.user.js)  
Depending on NS theme, adds either a cards icon to the top banner or a link in
the menu. Both the link and icon redirect to the deck page.

---

### ["Decoration"](userscripts/decoration)

#### [InvaderNS](userscripts/decoration/invader.user.js)
[Install](../../raw/master/userscripts/decoration/invader.user.js)  
The hidden NationStates Invader theme. For real GPers™.

#### [Steak Rarities](userscripts/decoration/steak_rarities.user.js)
[Install](../../raw/master/userscripts/decoration/steak_rarities.user.js)  
Would you like to know what kind of steak your card is?

---

### [Puppet links sheet](puppet_links_sheet)
[Downloads](../../releases)  
A python script to generate a sheet of clickable links pointing to various
puppets. Best used with the Containerise extension for maximum effiency. Also
generates rules for Containerise so you don't have to.

[There's this guide for more information on the extension and how it's tied to
farming.](https://www.nationstates.net/page=dispatch/id=1383002)

By default, links to *issues*, *the deck page* (3 variants), *telegrams*,
*settings*, *telegram settings*, the nation itself and the
[creation assistant](#puppet-creation-assistant). Configurable throught the
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
