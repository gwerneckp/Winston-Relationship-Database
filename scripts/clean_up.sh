#!/bin/bash

echo "Cleaning up containers and images"

for container_id in $(docker container ls -a | grep school | awk '{print $1}'); do
    docker container rm "$container_id"
    echo "Removed container $container_id"
done

for image_id in $(docker images | grep school | awk '{print $3}'); do
    docker image rm "$image_id"
    echo "Removed image $image_id"
done
