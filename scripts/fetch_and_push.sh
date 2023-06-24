#!/bin/bash

git fetch
git reset --hard origin/main
docker-compose down
docker-compose build
docker-compose up -d
