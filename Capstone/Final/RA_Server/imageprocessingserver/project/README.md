## Running the server
Once  you have all the requirements properly installed you can run the server with the command
```
python3 segmentation_image_server.py
```

## How does this server work
This server will read the weight .h5 file from the imageprocessingserver folder and open a connection on port 8485. It will then wight for a client to connect. Once a client and sends an image file, the server will process the image, removing the background, and send this new image back to the client.

## Tesing just the server
To test if the server is working properly we have created a test client script that will send a photo to the server once and save the returned image. See the remoteSegmentationTest directory on how to exicute this client.

## Traning the Network for new objects
See the read me file in the hands directory for more information on traning your own network weights.
