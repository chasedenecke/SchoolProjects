# RA_Server

Hand Image Segmentation Neural Network and Mobile appplication Server.

## Tools Used

* [NodeJS](https://nodejs.org/en/about/) - Server framework used
* [MongoDB](https://www.mongodb.com/) - No SQL database

## Requirments

Docker - version 18.09.6
Docker Compose - version 1.23.1

## Installation Guide

1. Run the below command to setup and install docker containers

./INSTALL_SCRIPT

2. After running installation script this will load you into the Hand Image Segmentation Server. Now that your are in the server cd into the imageprocessingserver folder.

3. Run the make command.
 
make

4. cd into the project folder.

5. Run the command 

python segmentation_image_server.py &

6. Now that the server is running in the background cd into the remoteSegmentationTest file.

7. Run the command

python conn.py 172.0.0.1 8485

8. Once this is complete you will notice an output.jpg file in your current directory.

9. You can now stop the back grounded image server.

10. On your host machine you can extract the image from the container using dockers cp command.

Example of dockers cp 

docker cp \<containerId\>:/project/remoteSegmentationTest/output.jpg /host/path/target
