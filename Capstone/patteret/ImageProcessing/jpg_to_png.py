#####################################################################
# Program walks through images in a file called test and 
# coverts them from a jpg file extension to a png.
#####################################################################
from PIL import Image
import os

for file_type in ['test']:
	for img in os.listdir(file_type):
		fp, ext = os.path.splitext("test/" + img)
		im = Image.open("test/" + img)
		rgb_im = im.convert('RGB')
		rgb_im.save(str(fp) + ".png", "PNG")
