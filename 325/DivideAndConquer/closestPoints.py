'''
Algorithm explained here: https://www.geeksforgeeks.org/closest-pair-of-points-using-divide-and-conquer-algorithm/
Authors: Chase Denecke and Nickoli Londura
For CS325 Algorithms in Winter term of 2019
'''

import sys
import math
from operator import itemgetter
from itertools import cycle

def closestPoints():
    inputFile = open(sys.argv[1], "r")
    listOfPoints = list()
    listOfClosestPoints = list()

    for fileString in inputFile:
        listOfPoints.append([int(s) for s in fileString.split()])

    inputFile.close()

    if sys.argv[2] == "bruteforce":
        smallest = distance(listOfPoints[0], listOfPoints[1])

        for i, point1 in enumerate(listOfPoints):
            for j, point2 in enumerate(listOfPoints[i+1:]):
                if distance(point1, point2) < smallest:
                    smallest = distance(point1, point2)
                    listOfClosestPoints.clear()
                    listOfClosestPoints.append([point1, point2])
                elif distance(point1, point2) == smallest:
                    listOfClosestPoints.append([point1, point2])

        sortAndPrintList(listOfClosestPoints, smallest, "bruteforce")

    elif sys.argv[2] == "ndc":
        sortedByX = sorted(listOfPoints, key=itemgetter(0))
        listOfClosestPoints = list()
        smallestDistance = distance(sortedByX[0], sortedByX[1])
        smallestDistance, listOfClosestPoints = recursivePointMeasurerNDC(sortedByX, smallestDistance)
        sortAndPrintList(listOfClosestPoints, smallestDistance, "ndc")
    elif sys.argv[2] == "edc":
        sortedByX = sorted(listOfPoints, key=lambda pair: (pair[0],
                                          pair[1]))
        sortedByY = sorted(listOfPoints, key=itemgetter(1))
        listOfClosestPoints = list()
        smallestDistance = distance(sortedByX[0], sortedByX[1])
        smallestDistance, listOfClosestPoints = recursivePointMeasurerEDC(sortedByX, sortedByY, smallestDistance)
        sortAndPrintList(listOfClosestPoints, smallestDistance, "edc")

def distance(point1, point2):
    return math.hypot(point1[0] - point2[0], point1[1] - point2[1])

# Each call of this function makes its own local copy of the listOfClosestPoints, which it then passes back to the caller
# This list (and other lists that are returned from other recursive calls) are then merged by the calling
# function.
def recursivePointMeasurerNDC(sortedByX, smallestDistance): # Am I great at naming functions or what?
    # Base case. If remaining list has 3 or fewer elements, use brute force sort.
    listOfClosestPoints = list()
    if len(sortedByX) <= 3:
        for index, point1 in enumerate(sortedByX):
            index += 1
            for point2 in sortedByX[index:]:
                if distance(point1, point2) < smallestDistance:
                    smallestDistance = distance(point1, point2)
                    listOfClosestPoints.clear()
                    listOfClosestPoints.append([point1, point2]) # Fix to properly sort output array
                elif distance(point1, point2) == smallestDistance:
                    listOfClosestPoints.append([point1, point2]) # Fix to properly sort output array
                index +=1

        return smallestDistance, listOfClosestPoints
    
    # Make the two recursive calls and sort out their results (set closestDistance to the min of the two found by each recursive calls etc)
    median = math.floor(len(sortedByX)/2)

    smallestDistance1, listOfClosestPoints1 = recursivePointMeasurerNDC(sortedByX[:median], smallestDistance)
    smallestDistance2, listOfClosestPoints2 = recursivePointMeasurerNDC(sortedByX[median:], smallestDistance)
    smallestDistance = min(smallestDistance1, smallestDistance2)
    if smallestDistance1 < smallestDistance2:
        listOfClosestPoints = listOfClosestPoints1
    elif smallestDistance2 < smallestDistance1:
        listOfClosestPoints = listOfClosestPoints2
    else: # if smallest distance in each recursive call was the same
        listOfClosestPoints = listOfClosestPoints1
        listOfClosestPoints.extend(listOfClosestPoints2)

    # Start at median point. Add it to list. 
    # Decrement index until the x value of the list member is less than median - smallest
    # Set index to median + 1. While the x value of the point is less than the median + smallest,
    # add it to the new list and increment the index
    # sort new list by y coordinate
    lessThanMedian = list()
    greaterThanOrEqualToMedian = list() # Recursive call was done with all values >= median in one call so we check the median itself against all values less than median
    for xIterator in range(median - 1, -1, -1): #iterates down to the first member of the list if that member is <= smallestDistance from median
        if sortedByX[xIterator][0] < sortedByX[median][0] - smallestDistance:
            break
        else:
            lessThanMedian.append(sortedByX[xIterator])
    for xIterator in range(median, len(sortedByX)):
        if sortedByX[xIterator][0] > sortedByX[median][0] + smallestDistance:
            break
        else:
            greaterThanOrEqualToMedian.append(sortedByX[xIterator])
    lessThanMedian = sorted(lessThanMedian, key=itemgetter(1)) # Sort this list by y so we can 
    greaterThanOrEqualToMedian = sorted(greaterThanOrEqualToMedian, key=itemgetter(1))

    # Iterate through all possible pairs of points which have one coordinate in the first list and one coordinate in the second
    for point1 in lessThanMedian:
        for point2 in greaterThanOrEqualToMedian:
            if point2[1] > point1[1] + smallestDistance:
                break
            elif distance(point1, point2) < smallestDistance:
                listOfClosestPoints.clear()
                listOfClosestPoints.append([point1, point2])
                smallestDistance = distance(point1, point2)
            elif distance(point1, point2) == smallestDistance:
                listOfClosestPoints.append([point1, point2])
    return smallestDistance, listOfClosestPoints

def recursivePointMeasurerEDC(sortedByX, sortedByY, smallestDistance): # Am I great at naming functions or what?
    # Base case. If remaining list has 3 or fewer elements, use brute force sort to find closest points.
    listOfClosestPoints = list()
    if len(sortedByX) <= 3:
        for index, point1 in enumerate(sortedByX):
            index += 1
            for point2 in sortedByX[index:]: # start 2nd point at index 1 beyond that of 1st point to avoid computing the distance between a point and itself
                if distance(point1, point2) < smallestDistance:
                    smallestDistance = distance(point1, point2)
                    listOfClosestPoints.clear()
                    listOfClosestPoints.append([point1, point2]) 
                elif distance(point1, point2) == smallestDistance:
                    listOfClosestPoints.append([point1, point2]) 
                index +=1

        return smallestDistance, listOfClosestPoints
    

    # Make the two recursive calls and sort out their results (set closestDistance to the min of the two found by each recursive calls etc)

    median = math.floor(len(sortedByX)/2)
    smallestDistance1, listOfClosestPoints1 = recursivePointMeasurerEDC(sortedByX[:median], sortedByY, smallestDistance)
    smallestDistance2, listOfClosestPoints2 = recursivePointMeasurerEDC(sortedByX[median:], sortedByY, smallestDistance)

    smallestDistance = min(smallestDistance1, smallestDistance2)
    if smallestDistance1 < smallestDistance2:
        listOfClosestPoints = listOfClosestPoints1
    elif smallestDistance2 < smallestDistance1:
        listOfClosestPoints = listOfClosestPoints2
    else: # if smallest distance in each recursive call was the same
        listOfClosestPoints = listOfClosestPoints1
        listOfClosestPoints.extend(listOfClosestPoints2)

    # Iterate through list sorted by Y. For every point whose x value is less than the median's x value but
    # greater than the median's x value minus the smallest distance, add it to the lessThanMedian list.
    # For every point that is equal to the median but less than or equal to the median's x value but
    # less than the median's x value plus the smallest distance, add it to the greaterThanOrEqualToMedian list
    # The execution time of this task is proportional to the size of the sorted list. O(n)

    lessThanMedian = list()
    greaterThanOrEqualToMedian = list() # Recursive call was done with all values >= median in one call so we check the median itself against all values less than median
    for xIterator in range(median - 1, -1, -1): #iterates down to the first member of the list if that member is <= smallestDistance from median
        if sortedByX[xIterator][0] < sortedByX[median][0] - smallestDistance:
            break
        else:
            lessThanMedian.append(sortedByX[xIterator])
    for xIterator in range(median, len(sortedByX)):
        if sortedByX[xIterator][0] > sortedByX[median][0] + smallestDistance:
            break
        else:
            greaterThanOrEqualToMedian.append(sortedByX[xIterator])
    lessThanMedian = sorted(lessThanMedian, key=itemgetter(1)) # Sort this list by y so we can 
    greaterThanOrEqualToMedian = sorted(greaterThanOrEqualToMedian, key=itemgetter(1))


    # Iterate through all possible pairs of points which have one coordinate in the first list and one coordinate in the second
    for point1 in lessThanMedian:
        for point2 in greaterThanOrEqualToMedian:
            if point2[1] > point1[1] + smallestDistance:
                break
            elif distance(point1, point2) < smallestDistance:
                listOfClosestPoints.clear()
                listOfClosestPoints.append([point1, point2])
                smallestDistance = distance(point1, point2)
            elif distance(point1, point2) == smallestDistance:
                listOfClosestPoints.append([point1, point2])
    return smallestDistance, listOfClosestPoints

# Sort a list by sorting every pair of points, and then sorting the entire list by either x or y of the first point in every pair
def sortAndPrintList(myList, dis, algType):
    if len(myList) > 1:
        sortedList = list()

        for i, pair in enumerate(myList):
            if pair[0][0] < pair[1][0]:
                sortedList.append([pair[0], pair[1]])
            elif pair[0][0] > pair[1][0]:
                sortedList.append([pair[1], pair[0]])
            else:
                if pair[0][1] < pair[1][1]:
                    sortedList.append([pair[0], pair[1]])
                else:
                    sortedList.append([pair[1], pair[0]])

        sortedList.sort(key=lambda pair: (pair[0][0],
                                          pair[0][1]))
        myList = sortedList

    if algType == "bruteforce":
        outputFile = open("output_bruteforce.txt", "w")
        outputFile.write("%.1f\r\n" % dis)
        
        for i, pair in enumerate(myList):
            outputFile.write("%d %d %d %d\r\n" % (pair[0][0], pair[0][1], pair[1][0], pair[1][1]))

        outputFile.close()
    elif algType == "ndc":
        outputFile = open("output_divideandconquer.txt", "w")
        outputFile.write("%.1f\r\n" % dis)

        for i, pair in enumerate(myList):
            outputFile.write("%d %d %d %d\r\n" % (pair[0][0], pair[0][1], pair[1][0], pair[1][1]))

        outputFile.close()
    elif algType == "edc":
        outputFile = open("output_enhanceddnc.txt", "w")
        outputFile.write("%.1f\r\n" % dis)

        for i, pair in enumerate(myList):
            outputFile.write("%d %d %d %d\r\n" % (pair[0][0], pair[0][1], pair[1][0], pair[1][1]))

        outputFile.close()

closestPoints()
