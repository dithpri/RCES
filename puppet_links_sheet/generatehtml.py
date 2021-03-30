#!/usr/bin/env python3

"""
 * Copyright (c) 2019-2020 dithpri (Racoda) <dithpri@gmail.com>
 * This file is part of RCES: https://github.com/dithpri/RCES and licensed under
 * the MIT license. See LICENSE.md or
 * https://github.com/dithpri/RCES/blob/master/LICENSE.md for more details.
"""

import sys
import traceback
import re
import configparser

html_start = """
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<style>
	td.createcol p {
		padding-left: 10em;
	}

	a {
		text-decoration: none;
		color: black;
	}

	a:visited {
		color: grey;
	}

	table {
		border-collapse: collapse;
		display: table-cell;
		max-width: 100%;
		border: 1px solid darkorange;
	}

	tr, td {
		border-bottom: 1px solid darkorange;
	}

	td p {
		padding: 0.5em;
	}

	tr:hover {
		background-color: lightgrey;
	}

	</style>
</head>
<body>
<table>
"""

html_end = """
</table>
<script>

document.querySelectorAll("td").forEach(function(el) {
	el.addEventListener("click", function(ev) {
		if (!ev.repeat) {
			let myidx = 0;
			const row = el.parentNode;
			let child = el;
			while((child = child.previousElementSibling) != null) {
				myidx++;
			}
			try {
				row.nextElementSibling.children[myidx].querySelector("p > a").focus();
			} finally {
				row.parentNode.removeChild(row);
			}
		}
	});
});

</script>
</body>
</html>
"""

invalid_nation_chars = re.compile("[^A-Za-z0-9_ -]")

def eprint(*args, **kwargs):
	print(*args, file=sys.stderr, **kwargs)
	sys.stderr.flush()

def canonicalize(name):
	return name.lower().replace(" ", "_")

def main():
	config = configparser.ConfigParser()
	config.read("config.txt")

	try:
		container_prefix = config['config']['containerPrefix']
	except KeyError:
		container_prefix = "container={}/nation={}"
		containerise_rules = {

		}

	with open('puppets_list.txt') as f:
		puppets = f.read().split('\n')

	puppets = list(filter(None, puppets))

	containerise_rules_container = open('containerise (container).txt', 'w')
	containerise_rules_nation = open('containerise (nation).txt', 'w')
	links = open('puppet_links.html', 'w')

	links.write(html_start)

	for nation in puppets:
		nation, *cont = re.split(invalid_nation_chars, nation)
		if cont:
			eprint("Invalid puppet name encountered! Assuming '{}' is the puppet name.".format(nation))
		canonical = canonicalize(nation)
		escaped_canonical = re.escape(canonical)
		container_protolink = container_prefix.format(*([canonical for _ in range(container_prefix.count("{}"))]))
		containerise_rules_container.write("@^.*\\.nationstates\\.net/(.*/)?container={}(/.*)?$ , {}\n".format(escaped_canonical, nation))
		containerise_rules_nation.write("@^.*\\.nationstates\\.net/(.*/)?nation={}(/.*)?$ , {}\n".format(escaped_canonical, nation))
		links.write("<tr>\n")
		links.write('\t<td><p><a target="_blank" href="https://www.nationstates.net/{}/nation={}">{}</a></p></td>\n'.format(container_protolink, canonical, nation))
		try:
			for key, value in config['links'].items():
				links.write('\t<td><p><a target="_blank" href="https://www.nationstates.net/{}/{}">{}</a></p></td>\n'.format(container_protolink, value, key))
		except KeyError:
			pass
		links.write('\t<td class="createcol"><p><a target="_blank" href="https://www.nationstates.net/{}/page=blank/template-overall=none/x-rces-cp?x-rces-cp-nation={}">Create {}</a></p></td>\n'.format(container_protolink, nation.replace(" ", "_"), nation))
		links.write("</tr>\n")

	links.write(html_end)

if __name__ == "__main__":
	try:
		main()
	except Exception:
		traceback.print_exc()
		eprint("Something went wrong!")
	input("Press enter to continue...")
