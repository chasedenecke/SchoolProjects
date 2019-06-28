# Program rotates all jpg images in a file.
import cv2
import numpy as np
from PIL import Image
import random
import os

degree = [320,90, 45, 135,300,225,180, 210, 240, 315, 30, 60, 330, 270]

try:
    for file_type in ['train']:
        for file in os.listdir(file_type):
            img = cv2.imread("train/" + str(file))
            # Shape of image in terms of pixels.
            (rows, cols) = img.shape[:2]

            # getRotationMatrix2D creates a matrix needed for transformation.
            # We want matrix for rotation w.r.t center to 45 degree without scaling.
            M = cv2.getRotationMatrix2D((cols / 2, rows / 2), degree[random.randint(0, len(degree)-1)], 1)
            res = cv2.warpAffine(img, M, (cols, rows))

            # Write image back to disk.
            cv2.imwrite("train/" + str(file) + ".jpg", res)
except IOError:
    print ('Error while reading files !!!')
