Archived
======
Tech Leads: Repository archived due to inactivity in more than 6 months.
Please remember to add a CODEOWNERS file to the root of the repository when unarchiving.

# Dependency graph

A tool for building requirejs dependency graphs. It loads the result in to Neo4j
for future data-grinding.


## Install

1. Clone the repo
2. `npm install`


## Other setup

It currently expects to have a local [Neo4j][neo4j] server running at
`http://localhost:7474`. Please note that it deleted all nodes and relations as
part of the script.


## How to run

The script have a number of command-line argument. Run it with `-h` to see them.
They are defaulted to work with the current [e-conomic][e-conomic] build, but
can easily be overridden to work with other projects.

The two main ways of running it is by giving it a minified require-file as an
argument or by piping the content in:

1. `node ./index.js <local-file>`
2. `curl <http-to-file> | node ./index.js`


## Results

The resulting [Neo4j][neo4j] graph will contain nodes with two tags, and two
types of relations:

1. `Module` label: RequireJS modules. They have a `name` property.
2. `Entry` label: Entry-points into the tree. They are designated with the
   --main CLI option.
3. `DEPENDS_ON` relation: Dependency between modules.
4. `RUNS` relation: The entries have this relation to their module.


[neo4j]: http://neo4j.com
[e-conomic]: http://e-conomic.com
