#!/bin/bash

data_dir=$(pwd)/data
backups_dir=$(pwd)/backups

docker run --interactive --tty --rm --volume=$data_dir:/data --volume=$backups_dir:/backups neo4j/neo4j-admin:5.7.0 neo4j-admin database dump neo4j --to-path=/backups --verbose
