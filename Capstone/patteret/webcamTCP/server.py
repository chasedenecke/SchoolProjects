import cv2
import socket
import argparse
import struct
import pickle
import numpy as np

# Use IP if current machine and listen on PORT.
HOST = ''
PORT = 8485
# Set up a TCP socket.
s=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
print('Socket created')
# Bind the host and port to the socket.
s.bind((HOST,PORT))
print('Socket bind complete')
# Listen for connections.
s.listen()

print('Socket now listening')
# Accept the connections.
conn,addr=s.accept()

# Encoding the image.
encode = [int(cv2.IMWRITE_JPEG_QUALITY), 90]\
# Calculates the number of bytes in the image.
payload_size = struct.calcsize(">L")
# Holds the bytes of the image.
data = b""
while True:
	# Wait to recive the data.
	while len(data) < payload_size:
		data += conn.recv(4096)
	# Pull the length of the expecded data from the first packet.
	received_data_length = data[:payload_size]
	# Store the payload of data in msg.
	data = data[payload_size:]
	# Unpack the length of data.
	data_length = struct.unpack(">L", received_data_length)[0]
	# Recive remaining data.
	while len(data) < data_length:
		data += conn.recv(4096)

	frame_data = data[:data_length]
	data = data[data_length:]

	frame = pickle.loads(frame_data, fix_imports=True, encoding="bytes")
	frame = cv2.imdecode(frame, cv2.IMREAD_COLOR)
	# encode the image.
	result, msg = cv2.imencode('.jpg', frame, encode)
	# Serializ the data for sending.
	msg = pickle.dumps(msg, 0)
	# Length of the serialized data.
	size = len(msg)

	#cv2.imshow('server',frame)
	#if cv2.waitKey(1) & 0xFF == ord('q'):
	#	break
	# Send it!
	conn.sendall(struct.pack(">L", size) + msg)
