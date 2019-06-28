
## Traning the network

To train the neural network you will be using the hands.py file. This file can be used to train the network to identify any object. 

To train the network with transfer learning from a pre weighted file, run the command
```
python3 hands.py train –dataset=/path/to/hands/dataset –weights=last .h5
```

You can also train it starting with weights from ImageNet weights with
```
python3 hands.py train --dataset=/path/to/hands/dataset --weights=imagenet
```

We used the VGG Image Annotator by Abhishek Dutta to annotate imges for traning our network. Please see ImageAnotator for more information of Abhishek Dutta's work.
