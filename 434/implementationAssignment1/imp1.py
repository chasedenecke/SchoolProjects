import numpy as np
from io import StringIO

if __name__ == '__main__':
    def parseFiles():
        trainData = np.genfromtxt("housing_train.txt")
        testData = np.genfromtxt("housing_test.txt")
        print(trainData)
        print("train data dims = ", trainData.shape)
        # print(testData)
        X = np.delete(trainData, [13], axis=1)
        newCol = np.ones((X.shape[0], 1), dtype=int)
        # print("newCol = ", newCol)
        print("newCol dims = ", newCol.size)
        X = np.append(X, newCol, 1)
        print("x.dims = ", X.shape)
        tempList = [x for x in range(X.shape[1]-1)]
        print(tempList)
        Y = np.delete(trainData, [x for x in range(X.shape[1]-1)], axis=1)
        print("X = ", X)
        # print("Y = ", Y)
        W = calcOptimalWieght(X, Y)
        print("W = ", W)
        print("leastSquares = ", leastSquares(X, W, Y))

    # Takes matrices in the form of numpy arrays
    def calcOptimalWieght(X, Y):
        Xtrans = np.transpose(X) 
        inverse = np.linalg.inv(np.matmul(Xtrans, X)) # Find the inverse of Xtranspose * X
        W = np.matmul(np.matmul(inverse, Xtrans), Y)
        # np.reshape(W, (W.size, 1))
        return W

    def leastSquares(X, W, Y):
        predictedValues = np.matmul(X, W)
        print(predictedValues)
        print("dims of predictedValues = ", predictedValues.shape)
        return np.linalg.lstsq(np.matmul(X, W), Y, rcond=None)

    parseFiles()