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


def cleanup(str):
    return re.sub(invalid_nation_chars, "", str)


def mk_generated_by(user):
    if not hasattr(mk_generated_by, "fmt"):
        mk_generated_by.fmt = "github_dithpri_RCES_generatehtml.py_0.2__usedBy_{}"
    user = cleanup(user)
    return mk_generated_by.fmt.format(user)


html_start = """
    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
        <style>
        /* Light mode */
        @media (prefers-color-scheme: light) {
            body {
                background-color: #FFF;
                color: #111;
            }
            a {
                color: #111;
            }
            tr:hover {
                background-color: #DDD;
            }
        }
        /* Dark mode */
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #111;
                color: #FFF;
            }
            a {
                color: #FFF;
            }
            tr:hover {
                background-color: #444;
            }
        }

        a {
            text-decoration: none;
        }

        a:visited {
            color: grey;
        }

        table {
            border-collapse: collapse;
            max-width: 100%;
            border: 1px solid darkorange;
        }

        tr, td {
            border-bottom: 1px solid darkorange;
        }

        td:first-child {
            border: 1px solid darkorange;
        }

        td p, td:first-child {
            padding: 0.5em;
        }

        </style>
    </head>
    <body>
    <table>
"""
html_end = """
    </table>
    <script>

    document.querySelectorAll("a").forEach(function(el) {
        el.addEventListener("click", function (ev) {
            ev.preventDefault();
            return false;
        });
        el.addEventListener("keyup", function(ev) {
            if ((ev.key && (ev.key !== "Enter" || ev.type !== "keyup")) || ev.repeat) {
                ev.preventDefault();
                el.focus();
                return;
            }
            window.open(el.href, "_blank");
            let myidx = 0;
            const row = el.closest("tr");
            let child = el.closest("td");
            while((child = child.previousElementSibling) != null) {
                myidx++;
            }
            try {
                row.nextElementSibling.children[myidx].querySelector("p > a").focus();
            } finally {
                row.parentNode.removeChild(row);
            }
        });
    });

    </script>
    </body>
    </html>
"""


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

    try:
        baseURL = config["config"]["baseURL"]
    except KeyError:
        baseURL = "https://www.nationstates.net"

    try:
        user_nation = cleanup(canonicalize(config["config"]["user nation"]))
        if user_nation == "" or user_nation is None:
            raise Exception("User nation is invalid or not defined")
    except KeyError:
        raise Exception("User nation not found in config file")

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
            '\t<td><p><a target="_blank" href="{}/{}/nation={}/generated_by={}">{}</a></p></td>\n'.format(
                baseURL,
                container_protolink,
                canonical,
                mk_generated_by(user_nation),
                nation,
            )
        )
        try:
            for key, value in config["links"].items():
                links.write(
                    '\t<td><p><a target="_blank" href="{}/{}/{}/generated_by={}">{}</a></p></td>\n'.format(
                        baseURL,
                        container_protolink,
                        value,
                        mk_generated_by(user_nation),
                        key,
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
