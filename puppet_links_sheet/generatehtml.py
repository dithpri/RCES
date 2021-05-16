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

guard, *guard_ = 0, 0, 0 # This script requires Python 3, you're using Python 2. If running from the command line, try 'python3 generatehtml.py' instead.

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

def get_file_paths():
	reqs = {
		"config": "config.txt",
		"puppets_list": "puppets_list.txt"
	}
	ret = {}
	possible_roots = set([get_cwd(), get_script_dir()])
	for k, v in reqs.items():
		for root in possible_roots:
			tryfile = os.path.join(root, v)
			if os.path.isfile(tryfile):
				ret[k] = tryfile
				break
		if k not in ret:
			eprint("Could not find `{}` in any of these directories: ".format(v))
			for root in possible_roots:
				eprint("  {}".format(root))
	if ret.keys() != reqs.keys():
		raise FileNotFoundError("A required file wasn't found.")
	return ret

def main():
	if get_cwd() != get_script_dir():
		eprint("Hint: The working directory is different from the script directory.")
		eprint("Hint: files will be generated in {}".format(get_cwd()))

	files = get_file_paths()
	config = ConfigParser(interpolation=ExtendedInterpolation())

	with open(files["config"]) as config_file:
		config.read_file(config_file)

	try:
		container_prefix = config['config']['containerPrefix']
	except KeyError:
		container_prefix = "container={}/nation={}"
		containerise_rules = {

		}

	html_start = config['html_template']['html_start']
	html_end = config['html_template']['html_end']
	with open(files["puppets_list"]) as f:
		puppets = f.read().split('\n')

	puppets = list(filter(None, puppets))

	containerise_rules_container = open('containerise (container).txt', 'w')
	containerise_rules_nation = open('containerise (nation).txt', 'w')
	links = open('puppet_links.html', 'w')

	links.write(html_start)

	puppet_number = 1
	for nation in puppets:
		nation, *cont = re.split(invalid_nation_chars, nation)
		if cont:
			eprint("Line {}: Invalid puppet name encountered! Assuming '{}' is the puppet name.".format(puppet_number, nation))
		canonical = canonicalize(nation)
		escaped_canonical = re.escape(canonical)
		container_protolink = container_prefix.format(*([canonical for _ in range(container_prefix.count("{}"))]))
		containerise_rules_container.write("@^.*\\.nationstates\\.net/(.*/)?container={}(/.*)?$ , {}\n".format(escaped_canonical, nation))
		containerise_rules_nation.write("@^.*\\.nationstates\\.net/(.*/)?nation={}(/.*)?$ , {}\n".format(escaped_canonical, nation))
		links.write("<tr>\n")
		if config['config']['number rows'] in ["yes", "true", "1"]:
				links.write("\t<td>{}</td>".format(puppet_number))
		links.write('\t<td><p><a target="_blank" href="https://www.nationstates.net/{}/nation={}">{}</a></p></td>\n'.format(container_protolink, canonical, nation))
		try:
			for key, value in config['links'].items():
				links.write('\t<td><p><a target="_blank" href="https://www.nationstates.net/{}/{}">{}</a></p></td>\n'.format(container_protolink, value, key))
		except KeyError:
			pass
		if config['config']['include create column'] in ["yes", "true", "1"]:
			links.write('\t<td class="createcol"><p><a target="_blank" href="https://www.nationstates.net/{}/page=blank/template-overall=none/x-rces-cp?x-rces-cp-nation={}">Create {}</a></p></td>\n'.format(container_protolink, nation.replace(" ", "_"), nation))
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
