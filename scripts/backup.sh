#!/bin/bash

data_dir=$(pwd)/data
backups_dir=$(pwd)/backups

docker run --interactive --tty --rm --volume="$data_dir:/data" --volume="$backups_dir:/backups" neo4j:4.4.20 neo4j-admin dump --database=neo4j --to=/backups/neo4j.$(date +'%m%d%y').dump
