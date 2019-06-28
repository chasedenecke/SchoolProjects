#####################################################################
# Program uses the watershed algorithm to outline hands and
# converts all none hand pixels to black [0,0,0]
#####################################################################
import cv2
import numpy as np
import os

for file_type in ['pos']:
	for img in os.listdir(file_type):
		img_read = cv2.imread(r"pos"+str(img))
		resized_img = cv2.resize(img_read,(300,300))
		mask = np.zeros(resized_img.shape[:2],np.uint8)

		bgdModel = np.zeros((1,65), np.float64)
		fgdModel = np.zeros((1,65), np.float64)
		
		rect = (1,1, 665, 344)
		cv2.grabCut(resized_img, mask, rect, bgdModel, fgdModel, 5, cv2.GC_INIT_WITH_RECT)
		
		mask2 = np.where((mask==2)|(mask==0),0,1).astype('uint8')
		resized_img = resized_img*mask2[:,:,np.newaxis]

		cv2.imwrite("pos4/"+str(img),resized_image)
