#####################################################################
# Program converts all black or white pixels to transparent.
# The file must be a png file for this to work!
#####################################################################
import numpy as np
from PIL import Image
import os

for file_type in ['test2']:
	for img in os.listdir(file_type):
		img_read = Image.open("test2/" + str(img))
		img_read = img_read.convert("RGBA")
		datas = img_read.getdata()
		newData = []
		for item in datas:
			if item[0] == 0 and  item[1] == 0 and item[2] == 0:
				newData.append((255, 255, 255, 0))
			else:
				newData.append(item)
		
		img_read.putdata(newData)

		#base = os.path.splitext(img)[0]
		#os.rename(img, base + ".png")
		
		img_read.save("test2/"+str(img))
