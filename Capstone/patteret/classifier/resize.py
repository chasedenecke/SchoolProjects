import cv2
import numpy as np
import os


# Grayscale an resize the image.
def pre_process():
	# If path DNE make the path.
	if not os.path.exists('pos'):
		os.makedirs('pos')

	# If path DNE make the path.
	if not os.path.exists('pos2'):
		os.makedirs('pos2')

	# Open file 'pos' alias file_type.
	for file_type in ['pos']: 
		# Open every image in file_type.
		for img in os.listdir(file_type):
			# Grayscale the image.
			img_read = cv2.imread("pos/" + str(img),cv2.IMREAD_GRAYSCALE)
			# Resize the image
			resized_image = cv2.resize(img_read,(50,50))
			# Save processed image into file 'pos2'
			cv2.imwrite("pos2/"+str(img),resized_image)
			
pre_process()
