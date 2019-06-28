# Server Client webcam

Captures webcam data on client and sends it to the server for processing. The processed data is then sent back to the client to be displayed. Was created to process live image data on an Amazon Web Server (AWS).

### Prerequisites
OpenCV2
Numpy

## Running/Testing

Run the server first and then run the client program. The server program takes no arguments. The client program takes two arguments. The first argument is an IP address and the second is the port number. I would recomend testing on the loopback(127.0.0.1) address first.
