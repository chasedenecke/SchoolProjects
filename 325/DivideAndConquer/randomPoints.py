import random
import sys
from functools import partial
import itertools

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
else:
    randomPoint = partial(random.sample, range(1000000), 2)
    randomList = [randomPoint() for _ in range(int(sys.argv[1]))]
    outputFile = open("randomPoints.txt", "w")
    for point in randomList:
        outputFile.write("%d %d\r\n" % (point[0], point[1]))