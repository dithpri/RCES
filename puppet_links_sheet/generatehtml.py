#!/usr/bin/env python3

"""
 * Copyright (c) 2019-2020 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
"""

import sys
import os
import inspect
import traceback
import re
from configparser import ConfigParser, ExtendedInterpolation

# fmt: off
guard, *guard_ = 0, 0, 0  # This script requires Python 3, you're using Python 2. If running from the command line, try 'python3 generatehtml.py' instead.
# fmt: on

invalid_nation_chars = re.compile("[^A-Za-z0-9_ -]")

def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)
    sys.stderr.flush()


def canonicalize(name):
    return name.lower().replace(" ", "_")


def get_script_dir():
    return os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))


def get_cwd():
    return os.getcwd()

# gotta make sure this code does the whole script idenitification bit. 
# whodunit will be used to insert your nation into the generated HTML link so that NS knows who used this script
rawwhodunit = "Chimore says edit me"
whodunit = canonicalize(whodunit)

possible_dirs = [
    get_script_dir(),
    get_cwd(),
    str(os.path.expanduser("~/RCES/puppet_links_sheet/")),
]


def get_config_files(*params):
    config_files = set(params)
    for try_dir in possible_dirs:
        for filename in config_files:
            try:
                ret = dict(
                    map(
                        lambda filename: (
                            filename,
                            open(os.path.join(try_dir, filename), "r"),
                        ),
                        config_files,
                    )
                )
                eprint("Using config from {}".format(try_dir))
                return ret
            except OSError:
                eprint(
                    "Something went wrong when trying to read config from {}".format(
                        try_dir
                    )
                )
    raise FileNotFoundError("A required file wasn't found.")


def create_output_files(*params):
    output_files = set(params)
    for try_dir in possible_dirs:
        try:
            os.makedirs(try_dir, exist_ok=True)
            ret = dict(
                map(
                    lambda filename: (
                        filename,
                        open(os.path.join(try_dir, filename), "w"),
                    ),
                    output_files,
                )
            )
            eprint("Hint: files will be generated in {}".format(try_dir))
            return ret
        except OSError:
            eprint(
                "Something went wrong when trying to generate files in {}".format(
                    try_dir
                )
            )
            continue
    return None


def main():
    config_files = get_config_files("config.txt", "puppets_list.txt")
    outputs = create_output_files(
        "containerise (nation).txt", "containerise (container).txt", "puppet_links.html"
    )

    config = ConfigParser(interpolation=ExtendedInterpolation())
    config.read_file(config_files["config.txt"])
    puppets = config_files["puppets_list.txt"].read().split("\n")
    puppets = list(filter(None, puppets))

    containerise_rules_container = outputs["containerise (container).txt"]
    containerise_rules_nation = outputs["containerise (nation).txt"]
    links = outputs["puppet_links.html"]

    try:
        container_prefix = config["config"]["containerPrefix"]
    except KeyError:
        container_prefix = "container={}/nation={}"

    html_start = config["html_template"]["html_start"]
    html_end = config["html_template"]["html_end"]

    links.write(html_start)

    puppet_number = 1
    for nation in puppets:
        nation, *cont = re.split(invalid_nation_chars, nation)
        if cont:
            eprint(
                "Line {}: Invalid puppet name encountered! Assuming '{}' is the puppet name.".format(
                    puppet_number, nation
                )
            )
        canonical = canonicalize(nation)
        escaped_canonical = re.escape(canonical)
        container_protolink = container_prefix.format(
            *([canonical for _ in range(container_prefix.count("{}"))])
        )
        containerise_rules_container.write(
            "@^.*\\.nationstates\\.net/(.*/)?container={}(/.*)?$ , {}\n".format(
                escaped_canonical, nation
            )
        )
        containerise_rules_nation.write(
            "@^.*\\.nationstates\\.net/(.*/)?nation={}(/.*)?$ , {}\n".format(
                escaped_canonical, nation
            )
        )
        links.write("<tr>\n")
        if config["config"]["number rows"] in ["yes", "true", "1"]:
            links.write("\t<td>{}</td>".format(puppet_number))
        links.write(
            '\t<td><p><a target="_blank" href="https://www.nationstates.net/{}/nation={}?generated_by=RCES_puppet_links_sheet__author_main_nation_East_Chimore__usedBy_{}">{}</a></p></td>\n'.format(
                container_protolink, canonical, whodunit, nation
            )
        )
        try:
            for key, value in config["links"].items():
                links.write(
                    '\t<td><p><a target="_blank" href="https://www.nationstates.net/{}/{}?generated_by=RCES_puppet_links_sheet__author_main_nation_East_Chimore__usedBy_{}">{}</a></p></td>\n'.format(
                        container_protolink, value, whodunit, key
                    )
                )
        except KeyError:
            pass
        links.write("</tr>\n")
        puppet_number += 1

    links.write(html_end)


if __name__ == "__main__":
    try:
        main()
    except Exception:
        traceback.print_exc()
        eprint("Something went wrong!")
    input("Press enter to continue...")
