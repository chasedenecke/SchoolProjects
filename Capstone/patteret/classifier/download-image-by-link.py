import urllib.request
import cv2
import numpy as np
import os

# Downloads images from a provided image net link.
def store_raw_images():
    # Link to image net files.
    neg_images_link = 'http://www.image-net.org/api/text/imagenet.synset.geturls?wnid=n07942152'   
    #Open the url link.
    neg_image_urls = urllib.request.urlopen(neg_images_link).read().decode()
 
   		   #Files names for images start with the given pic_num.
    pic_num = 1379 #IMPORTANT# Will overwrite any file with existing mane.
    
    # If file path exists.
    if not os.path.exists('neg'):
        os.makedirs('neg')
        
    for i in neg_image_urls.split('\n'):
        try:
            print(i)
	    # Copy network object to a locol file.
            urllib.request.urlretrieve(i, "neg/"+str(pic_num)+".jpg")
	     # Grayscale the downloaded image.
            img = cv2.imread("neg/"+str(pic_num)+".jpg",cv2.IMREAD_GRAYSCALE)
            # should be larger than samples / pos pic (so we can place our image on it)
	    # Resizes the images.
            resized_image = cv2.resize(img, (100, 100))
            cv2.imwrite("neg/"+str(pic_num)+".jpg",resized_image)
            pic_num += 1
            
        except Exception as e:
            print(str(e))
# Removes bad image files.
def find_uglies():
    match = False # Flag for comparing images.
    # Open file 'pos' alias file_type.
    for file_type in ['neg']:
	# Open every image in file_type.
        for img in os.listdir(file_type):
	    # Open every image in the uglies folder.
            for ugly in os.listdir('uglies'):
                try:
		    # Current path of the file to be compared.
                    current_image_path = str(file_type)+'/'+str(img)
		    # Read the uglies files image.
                    ugly = cv2.imread('uglies/'+str(ugly))
		    # Read the neg files image.
                    question = cv2.imread(current_image_path)
		    # Compare the two images.
                    if ugly.shape == question.shape and not(np.bitwise_xor(ugly,question).any()):
                        print('That is one ugly pic! Deleting!')
                        print(current_image_path)
			# Reap the bad image.
                        os.remove(current_image_path)
                except Exception as e:
                    print(str(e))
# Labes the positive images.						
def create_pos_n_neg():
    for file_type in ['pos2']:
        
        for img in os.listdir(file_type):
            if file_type == 'pos2':
                line = file_type+'/'+img+' 1 0 0 50 50\n'
                with open('hands.info','a') as f:
                    f.write(line)
            elif file_type == 'neg':
                line = file_type+'/'+img+'\n'
                with open('bg.txt','a') as f:
                    f.write(line)
#Comment and uncomment the functions wished to be used.#

#create_pos_n_neg()
#store_raw_images()
#find_uglies()


