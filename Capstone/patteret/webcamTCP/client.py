import cv2
import socket
import argparse
import struct
import pickle

###################### Handling terminal arguments ###############################################
parser = argparse.ArgumentParser(description='Connects to a remote system for image processing.')
parser.add_argument('IP', metavar='IP', type=str, nargs='+', help='IP address of remote machine.')

parser.add_argument('PORT', metavar='Port', type=str, nargs='+', help='Port of remote machine.')

args = parser.parse_args()
#####################################################################################################
# Set up a TCP socket.
c_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# IP and Port to connect to.
c_socket.connect((''.join(args.IP), int(''.join(args.PORT))))

# Capture webcam data on default port.
cam = cv2.VideoCapture(0)

# Setting the image size.
cam.set(3, 640)
cam.set(4, 480)

# Encoding the image.
encode = [int(cv2.IMWRITE_JPEG_QUALITY), 90]
# Calculates the number of bytes in the image.
payload_size = struct.calcsize(">L")

# Holds the bytes of the image.
msg = b""
while True:
    # Delay screen capture to allow for more processing time.
    for i in range(0,3): # Obtain a frame from the webcam.
        ret, frame = cam.read() # Get a frame from the webcam.
        
	# encode the image.
        error, frame = cv2.imencode('.jpg', frame, encode)
	# Serializ the data for sending.
        data = pickle.dumps(frame, 0)
	# Length of the serialized data.
        length = len(data)
	# Send it!
        c_socket.sendall(struct.pack(">L", length) + data)

	# Wait to recive the data.
        while len(msg) < payload_size:
            msg += c_socket.recv(4096)
	# Pull the length of the expecded data from the first packet.
        recved_msg_length = msg[:payload_size]
	# Store the payload of data in msg.
        msg = msg[payload_size:]
	# Unpack the length of data.
        msg_length = struct.unpack(">L", recved_msg_length)[0]
	# Recive remaining data.
        while len(msg) < msg_length:
            msg += c_socket.recv(4096)

        frame_data = msg[:msg_length]
        msg = msg[msg_length:]

        frame2 = pickle.loads(frame_data, fix_imports=True, encoding="bytes")
        frame2 = cv2.imdecode(frame2, cv2.IMREAD_COLOR)
        #try:
        cv2.imshow('Client', frame2)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
        #except:
        #    print("Client frame error.")
cam.release()
