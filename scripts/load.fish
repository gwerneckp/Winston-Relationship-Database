#!/usr/bin/fish

docker run --interactive --tty --rm --volume=./data:/data --volume=./backups:/backups neo4j/neo4j-admin:5.7.0 neo4j-admin database load neo4j --from-path=/backups
