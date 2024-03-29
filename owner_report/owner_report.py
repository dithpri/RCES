#!/usr/bin/env python3

"""
 * Copyright (c) 2020 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
"""

import sys


def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)
    sys.stderr.flush()


try:
    import sans
except ImportError:
    eprint(
        """You need `sans` to run this script!
install it by running
    python3 -m pip install -U sans
or
    py -m pip install -U sans
or from https://pypi.org/project/sans/"""
    )
    input("Press enter to continue...")
    sys.exit(1)

import asyncio
import datetime
import re
from collections import defaultdict


def canonical_nation_name(name):
    return name.lower().replace(" ", "_")


current_season = 3


async def main():
    mode = -1
    username = ""
    while mode not in [1, 2, 3]:
        print("[1] Owner report of cards on your puppets (listed in puppets.txt)")
        print("[2] Owner report of cards (listed in cards.txt)")
        print("[3] Both")
        mode = input("Please enter mode: ")
        try:
            mode = int(mode)
        except ValueError:
            eprint("That's not a number!")
    while not username:
        username = input("Please enter your nation name: ")
    sans.set_agent(f"Owner Report (dev. dithpri/Racoda) (in use by {username})")
    output_file = open(datetime.datetime.now().strftime("%Y-%m-%d %H-%M-%S.tsv"), "x")
    cards = set()
    if mode in [2, 3]:
        with open("cards.txt", "r") as input_file:
            linenum = 0
            for line in input_file:
                linenum += 1
                if temp := re.match(
                    r"^https?://(www\.)?nationstates.net/page=deck/card=(?P<id>[0-9]+)(/season=(?P<season>[0-9]+))?",
                    line,
                ):
                    id, season = temp.group("id"), temp.group("season")
                elif temp := re.match(
                    "(?P<id>[0-9]+)(([^0-9])+(?P<season>[0-9]+))?", line
                ):
                    id, season = temp.group("id"), temp.group("season")
                else:
                    eprint(f"Unable to process line {linenum}: unknown format")
                    continue
                if season:
                    cards.add((id, season))
                else:
                    for s in range(1, current_season + 1):
                        cards.add((id, s))
    client = sans.AsyncClient()
    if mode in [1, 3]:
        with open("puppets.txt", "r") as input_file:
            puppets = filter(None, input_file.read().splitlines())
        for puppet in puppets:
            result = (
                await client.get(
                    sans.World(
                        "cards deck",
                        nationname=canonical_nation_name(puppet),
                    )
                )
            ).xml
            if result.find("./DECK/CARD") is None:
                eprint(f"{puppet} does not exist or has an empty deck.")
                continue
            for card in result.find("./DECK").iter("CARD"):
                cards.add(
                    (
                        int(card.find("./CARDID").text),
                        int(card.find("./SEASON").text),
                    )
                )
    output_file.write("ID\tSEASON\tNUMBER OF OWNERS\tNUMBER OF COPIES\tOWNERS:COPIES\n")
    for card in cards:
        id, season = card
        owners_dict = defaultdict(int)
        num_owners = 0
        num_copies = 0
        result = (
            await client.get(sans.World("card owners", cardid=id, season=season))
        ).xml
        owners = result.find("./OWNERS")
        if owners is None:
            eprint(f"Card {id} season {season} does not exist.")
            continue
        for owner in owners.iter("OWNER"):
            num_copies += 1
            owners_dict[owner.text] += 1
        owners = owners_dict.keys()
        num_owners = len(owners)
        owners_copies = ",".join(
            [
                ":".join((a, str(b)))
                for a, b in sorted(
                    owners_dict.items(), key=lambda x: x[1], reverse=True
                )
            ]
        )
        output_file.write(
            f"{id}\t{season}\t{num_owners}\t{num_copies}\t{owners_copies}\n"
        )
    await client.aclose()


if __name__ == "__main__":
    asyncio.run(main())
