# Image Processing Server
## Description
This imageprocessingserver is used to subtract the background out of images leaving only the object of interest in the frame. This will drastically reduce the noise in an image for other programs that are attempting to extract features from the object.

## Why Might This Be Needed
This network acts as a filter to assist in the training of neural network models. A research paper published in 2016 titled “Why Should I Trust you?”: Explaining the Predictions of Any Classifier shows one neural network learned the difference between dogs and wolves. The paper goes on to explain the  network only learned how to identify wolves based on the snow in the background. By removing background data, it forces a network during training to focus on the object and nothing else.

## What We Are Using It For
We train our network to identify hands. Once trained our network is able to subtract the background leaving only the hand. Allowing for a separate network to focus on a specifically individuals hand as they record their rheumatoid arthritis activity over time.

## Getting Started

These instructions will help get you up and running with this project on running on your local machine.

### Prerequisites
You will need to be on running Ubuntu operating system version 18 or higher.
You will also need to install Docker to user are docker file. This will reduce the overhead of installing the dependencies manually. You can follow the instructions here to install the binary for docker on your system https://docs.docker.com/install/linux/docker-ce/binaries/. 

When cloning this repository you will also want to have Git lfs installed on your machine our else you will not be able to use our trained weight file. You can learn more about installing git lfs here.
```
https://help.github.com/en/articles/installing-git-large-file-storage
```

## Creating the Docker image
To create the Docker image. Make sure your Docker daemon is running, then execute the command
```
sudo docker build -t test-container .
```

## Mounting the Docker image
To mount the Docker image. Execute the command
```
sudo docker run -it test-container
```
## Setting up Pycocotools
cd into the imageprocessingserver directory. Once in the directory execute make

```
make
```
This will setup the last dependence. 

## Running The Server

See the read me file in the project folder.

## Testing the Servre
See project/remoteSegmentationTest file's README.md

## Traning the Network.
To train the network with your own custom data you will need to navigate to the README.md file located in
```
project/hands
```

## Contributing

Please see the original mask-rcnn we forked at https://github.com/matterport/Mask_RCNN

Please see the original vgg image anotator at http://www.robots.ox.ac.uk/~vgg/software/via/
