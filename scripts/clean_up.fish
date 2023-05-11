#!/usr/bin/fish

echo "Cleaning up containers and images";
for container_id in $(docker container ls -a | grep school | awk '{print $1}');
docker container rm $container_id;
echo "Removed container $container_id";
end

for image_id in $(docker images | grep school | awk '{print $3}');
docker image rm $image_id;
echo "Removed image $image_id";
end