import cv2
import socket
import argparse
import struct
import pickle

parser = argparse.ArgumentParser(description='Connects to a remote system for image processing.')
parser.add_argument('IP', metavar='IP', type=str, nargs='+', help='IP address of remote machine.')

parser.add_argument('PORT', metavar='Port', type=str, nargs='+', help='Port of remote machine.')

parser.add_argument('Sending_Image', metavar='Sending_Image', type=str, nargs='+', help='image name sent by server.')
parser.add_argument('Storing_Location', metavar='Storing_Location', type=str, nargs='+', help='image storage location.')

args = parser.parse_args()

c_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
c_socket.connect((''.join(args.IP), int(''.join(args.PORT))))
connection = c_socket.makefile('wb')

cam = cv2.VideoCapture(0)

cam.set(3, 640)
cam.set(4, 480)

encode = [int(cv2.IMWRITE_JPEG_QUALITY), 90]
payload_size = struct.calcsize(">L")

count = 0
msg = b""

while True:
    # Delay screen capture to allow for more processing time.
#    for i in range(0,3): # Obtain a frame from the webcam.
        #ret, frame = cam.read()
        print(args.Sending_Image[0])
        frame = cv2.imread(args.Sending_Image[0])
        frame = cv2.resize(frame,(640,480))
        
        error, frame = cv2.imencode('.jpg', frame, encode)
        data = pickle.dumps(frame, 0)
        length = len(data)

        c_socket.sendall(struct.pack(">L", length) + data)
#        count += 1

        while len(msg) < payload_size:
            msg += c_socket.recv(4096)

        recved_msg_length = msg[:payload_size]
        msg = msg[payload_size:]
        msg_length = struct.unpack(">L", recved_msg_length)[0]

        while len(msg) < msg_length:
            msg += c_socket.recv(4096)

        frame_data = msg[:msg_length]
        msg = msg[msg_length:]

        frame2 = pickle.loads(frame_data, fix_imports=True, encoding="bytes")
        frame2 = cv2.imdecode(frame2, cv2.IMREAD_COLOR)
        #try:
        cv2.imshow('client', frame2)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

        cv2.imwrite(args.Storing_Location[0], frame2)
        c_socket.close()
        break
        #except:
            #print("Client frame error.")
cam.release()
