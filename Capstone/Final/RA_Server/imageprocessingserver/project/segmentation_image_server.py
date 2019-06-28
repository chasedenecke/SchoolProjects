import socket
import sys
import datetime
import cv2
import pickle
import numpy as np
import struct ## new
import zlib

HOST=''
PORT=8485

s=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
print('Socket created')

s.bind((HOST,PORT))

data = b""

encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 90]
payload_size = struct.calcsize(">L")

print("payload_size: {}".format(payload_size))


def color_splash(image, mask):
    """Apply color splash effect.
    image: RGB image [height, width, 3]
    mask: instance segmentation mask [height, width, instance count]

    Returns result image.
    """
    # Make a black copy of the image. The black copy still
    # has 3 RGB channels.
    gray = [0,0,0]

    # Copy color pixels from the original color image where mask is set
    if mask.shape[-1] > 0:
        # We're treating all instances as one, so collapse the mask into one layer
        mask = (np.sum(mask, -1, keepdims=True) >= 1)
        splash = np.where(mask, image, gray).astype(np.uint8)
    else:
        splash = gray.astype(np.uint8)
    return splash


def detect_and_color_splash(image, masks):
    segimage = color_splash(image, masks)
    # Save output
    #file_name = "splash_{:%Y%m%dT%H%M%S}.png".format(datetime.datetime.now())
    #skimage.io.imsave(file_name, splash)
    return segimage

def random_colors(N):
    np.random.seed(1)
    colors = [tuple(255 * np.random.rand(3)) for _ in range(N)]
    return colors


# Apply mask to image
def apply_mask(image, mask, color, alpha=0.5):
    # For RGB
    for n, c in enumerate(color):
        image[:, :, n] = np.where(
            mask == 1,
            image[:, :, n] * (1 - alpha) + alpha * c,
            image[:, :, n]
        )
    return image


def display_instances(image, boxes, masks):
    """
        take the image and results and apply the mask, box, and Label
    """
    n_instances = boxes.shape[0]
    colors = random_colors(n_instances)

    if not n_instances:
        print('NO INSTANCES TO DISPLAY')
    else:
        assert boxes.shape[0] == masks.shape[-1] # == ids.shape[0]

    for i, color in enumerate(colors):
        if not np.any(boxes[i]):
            continue

        y1, x1, y2, x2 = boxes[i]
        mask = masks[:, :, i]

        image = apply_mask(image, mask, color)

    return image


if __name__ == '__main__':
    """
        test everything
    """
    import os
    import sys
    import random
    import math
    import numpy as np
    import skimage.io
    import matplotlib
    import matplotlib.pyplot as plt

    # Root directory of the project
    ROOT_DIR = os.path.abspath("../")

    # Import Mask RCNN
    sys.path.append(ROOT_DIR)  # To find local version of the library
    from mrcnn import utils
    from mrcnn.config import Config
    import mrcnn.model as modellib
    from mrcnn import visualize
# Import COCO config
    sys.path.append(os.path.join(ROOT_DIR, "project/coco/"))  # To find local version
#   import coco 
    from project.coco import coco

# Directory to save logs and trained model
    MODEL_DIR = os.path.join(ROOT_DIR, "logs")

# Local path to trained weights file
    COCO_MODEL_PATH = os.path.join(ROOT_DIR, "mask_rcnn_hand_0030.h5")
# Download COCO trained weights from Releases if needed
    if not os.path.exists(COCO_MODEL_PATH):
        utils.download_trained_weights(COCO_MODEL_PATH)

    class InferenceConfig(coco.CocoConfig):
        GPU_COUNT = 1
        IMAGES_PER_GPU = 1

    config = InferenceConfig()
    config.display()

    model = modellib.MaskRCNN(
        mode="inference", model_dir=MODEL_DIR, config=config
    )
    model.load_weights(COCO_MODEL_PATH, by_name=True)

    while True:
        #ret, frame = capture.read()
        print('Socket bind complete')
        s.listen()

        print('Socket now listening')
        conn,addr=s.accept()

        while len(data) < payload_size:
                print("Recv: {}".format(len(data)))
                data += conn.recv(4096)

        print("Done Recv: {}".format(len(data)))
        packed_msg_size = data[:payload_size]
        data = data[payload_size:]
        msg_size = struct.unpack(">L", packed_msg_size)[0]
        print("msg_size: {}".format(msg_size))
        while len(data) < msg_size:
            data += conn.recv(4096)
        
        frame_data = data[:msg_size]
        data = data[msg_size:]
        
        frame=pickle.loads(frame_data, fix_imports=True, encoding="bytes")
        frame = cv2.imdecode(frame, cv2.IMREAD_COLOR)
       
        results = model.detect([frame], verbose=0)
        r = results[0]
        frame = detect_and_color_splash(frame, r['masks'])
        #frame = display_instances(
        #    frame, r['rois'], r['masks'])

        result, msg = cv2.imencode('.jpg', frame, encode_param)

        data2 = pickle.dumps(msg, 0)
        size = len(data2)

#       cv2.imwrite("img_proc.jpg", frame)
        conn.sendall(struct.pack(">L", size) + data2)

        conn.close()
