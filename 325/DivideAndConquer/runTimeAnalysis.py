import os
import random
import sys
import time
from functools import partial
import itertools

bruteforceTime = 0
ndcTime = 0
edcTime = 0
for i in range(10):
    if len(sys.argv) > 2:
        if sys.argv[2] == "distinct":
            outputFile = open("randomPoints.txt", "w")
            randomXValues = random.sample(range(0, int(sys.argv[1])*10), int(sys.argv[1]))
            randomYValues = random.sample(range(0, int(sys.argv[1])*10), int(sys.argv[1]))
            randomList = list()
            for x, y in zip(randomXValues, randomYValues):
                randomList.append([x,y])
            for point in randomList:
                outputFile.write("%d %d\r\n" % (point[0], point[1]))
            outputFile.close()
    else:
        randomPoint = partial(random.sample, range(100000), 2)
        randomList = [randomPoint() for _ in range(int(sys.argv[1]))]
        outputFile = open("randomPoints.txt", "w")
        for point in randomList:
            outputFile.write("%d %d\r\n" % (point[0], point[1]))
        outputFile.close()

    millis_start = int(round(time.time() * 1000))
    os.system("python3 closestPoints.py randomPoints.txt bruteforce")
    millis_end = int(round(time.time() * 1000))
    bruteforceTime += millis_end - millis_start

    millis_start = int(round(time.time() * 1000))
    os.system("python3 closestPoints.py randomPoints.txt ndc")
    millis_end = int(round(time.time() * 1000))
    ndcTime += millis_end - millis_start

    millis_start = int(round(time.time() * 1000))
    os.system("python3 closestPoints.py randomPoints.txt edc")
    millis_end = int(round(time.time() * 1000))
    edcTime += millis_end - millis_start

bruteforceTime = bruteforceTime / 10
ndcTime = ndcTime / 10
edcTime = edcTime / 10

print("bruteforce: %d ms\r\n ndc: %d ms\r\n edc: %d ms\r\n" % (bruteforceTime, ndcTime, edcTime))