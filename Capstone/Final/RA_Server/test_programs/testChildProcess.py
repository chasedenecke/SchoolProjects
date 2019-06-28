
import cv2
import socket
import argparse
import struct
import pickle

###################### Handling terminal arguments ###############################################

parser = argparse.ArgumentParser(description='Connects to a remote system for image processing.')
parser.add_argument('IP', metavar='IP', type=str, nargs='+', help='IP address of remote machine.')

parser.add_argument('PORT', metavar='Port', type=str, nargs='+', help='Port of remote machine.')

parser.add_argument('SENDING_LOCATION', metavar='SENDING_LOCATION', type=str, nargs='+', help='image name sent by server.')
parser.add_argument('STORING_LOCATION', metavar='STORING_LOCATION', type=str, nargs='+', help='image storage location.')

args = parser.parse_args()
#####################################################################################################

print("IP: " + args.IP[0] + " PORT: " + args.PORT[0] + " Sending Location: " + args.SENDING_LOCATION[0] + " Stroing Location: " + args.STORING_LOCATION[0])
