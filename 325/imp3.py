'''
Authors: Nickoli Londura and Chase Denecke
CS 325 at Oregon State University
Winter Term 2019
Implementation Assignment 3
'''

import csv
from pulp import *
import math
from math import *
import numpy as np
import matplotlib.pyplot as plt

class LineFitter:
    def __init__(self, filePath):
        self.averageTemp = list()
        self.day = list()
        self.sinusoidalCoefficients = list()
        self.lrCoefficients = list()
        self.xs = list()
        self.ys = list()
        with open(filePath, newline='') as csvfile:
            temperatureReader = csv.reader(csvfile, delimiter=';', quotechar='|') # 
            labelRow = next(temperatureReader)
            for row in temperatureReader:
                self.averageTemp.append(float(row[7]))
                self.day.append(int(row[8]))

    # Least squares isn’t good enough for me
    def LinearRegression(self):
        print("\r\nLinear Regression Problem\r\n")

        #points = [(1,3),(2,5),(3,7),(5,11),(7,14),(8,15),(10,19)]

        # Create the 'prob' variable to contain the problem data
        prob = LpProblem("Linear Regression Problem", LpMinimize)

        # Define the variables
        self.xs = [1, 2, 3, 5, 7, 8, 10]
        self.ys = [3, 5, 7, 11, 14, 15, 19]
        a = LpVariable("a", None, None)
        b = LpVariable("b", None, None)
        c = LpVariable("c", None, None)

        # The constraints are entered
        prob += c, "The objective function"
        j = 1
        for i in range(0,6):
            prob += a*self.xs[i] + b - self.ys[i] <= c, "constraint_" + str(j)
            j += 1
            prob += a*self.xs[i] + b - self.ys[i] >= -c, "constraint_" + str(j)
            j += 1

        # The problem data is written to an .lp file
        prob.writeLP("RegressionModel.lp")

        # The problem is solved using PuLP's choice of Solver
        prob.solve()

        # The status of the solution is printed to the screen
        print("Status:", LpStatus[prob.status])

        print("Optimal Result:")

        # Each of the variables is printed with it's resolved optimum value
        for v in prob.variables():
            print(v.name, "=", v.varValue)
            if v.name != "c":
                self.lrCoefficients.append(v.varValue)


        # The optimised objective function value is printed to the screen
        print("min c = ", value(prob.objective))

    # Local temperature change
    def SinusoidalFunction(self):
        print("\r\nSinusoidal Function Problem\r\n")

        # Create the 'prob2' variable to contain the problem data
        prob2 = LpProblem("Sinusoidal Function Problem", LpMinimize)

        # Define the variables
        ds = lineFitter.day
        Ts = lineFitter.averageTemp
        x0 = LpVariable("x0", None, None)
        x1 = LpVariable("x1", None, None)
        x2 = LpVariable("x2", None, None)
        x3 = LpVariable("x3", None, None)
        x4 = LpVariable("x4", None, None)
        x5 = LpVariable("x5", None, None)
        c = LpVariable("c", None, None)

        # The constraints are entered
        prob2 += c, "The objective function"

        j = 1
        for i in range(0, len(ds) - 1):
            prob2 += x0 + x1*ds[i] + x2*cos((2*math.pi*ds[i]) / 365.25) + x3*sin((2*math.pi*ds[i]) / 365.25) + x4*cos((2*math.pi*ds[i]) / (365.25*10.7)) + x5*sin((2*math.pi*ds[i]) / (365.25*10.7)) - Ts[i] <= c, "constraint_" + str(j)
            j += 1
            prob2 += x0 + x1*ds[i] + x2*cos((2*math.pi*ds[i]) / 365.25) + x3*sin((2*math.pi*ds[i]) / 365.25) + x4*cos((2*math.pi*ds[i]) / (365.25*10.7)) + x5*sin((2*math.pi*ds[i]) / (365.25*10.7)) - Ts[i] >= -c, "constraint_" + str(j)
            j += 1

        # The problem data is written to an .lp file
        prob2.writeLP("SinusoidalModel.lp")

        # The problem is solved using PuLP's choice of Solver
        prob2.solve()

        # The status of the solution is printed to the screen
        print("Status:", LpStatus[prob2.status])

        print("Optimal Result:")

        # Each of the variables is printed with it's resolved optimum value
        for v in prob2.variables():
            print(v.name, "=", v.varValue)
            if v.name != "c": 
                self.sinusoidalCoefficients.append(v.varValue)


        # The optimised objective function value is printed to the screen
        print("min c = ", value(prob2.objective))

    # This function plots the temperature curve of best fit, the scatter plot of the data points
    # from the CSV file, and the graph of the long term warming trend. It uses Matplotlib.pyplot
    # to do so.
    def plotResults(self):
        # Set the range and scale of the axes we are graphing. day is x-axis, temp is y-axis
        day = np.arange(0.0, len(self.day), 0.1) # The third number in this tuple sets the precision of the scale or something
        temp = np.arange(0.0, 5.0, 0.02)
        xs = np.arange(0.0, self.xs[len(self.xs) - 1], 0.1)

        # This line is not necessary for a single plot like what I am doing, but apparently it is useful for other applications.
        plt.figure(1)
        
        plt.subplot(211)
        plt.plot(xs, self.lrCoefficients[0]*xs + self.lrCoefficients[1], 'k')
        plt.scatter(self.xs, self.ys, s=15)

        # Matplotlib likes 3-digit subplot IDs for some reason, which is why this isn't plt.subplot(1). It also doesn't like 100. 
        plt.subplot(212)

        # Graph the sinusoidal curve of best fit. This equation comes from the assignment description for "Warm-up problem 2".
        # It has a long term warming trend (x0 + x1*day), a seasonal effect (x2*sin(something*day) + x3*cos(something*day)),
        # and a solar cycle effect: (x4*sin(somethingElse*day) + x5*cos(somethingElse*day))
        # An interesting note here is the choice to use sin(day)+cos(day) for both the seasonal and solar effects
        # as opposed to sin(day - phase shift). As it turns out, sin(day - phase shift) is not linear because it has 
        # three variables when one includes the coefficient. 
        plt.plot(day, self.sinusoidalCoefficients[0] + self.sinusoidalCoefficients[1]*day+ self.cos(self.sinusoidalCoefficients[2], day, 'seasonal') + self.sin(self.sinusoidalCoefficients[3], day, 'seasonal') + self.cos(self.sinusoidalCoefficients[4], day, 'solar') + self.sin(self.sinusoidalCoefficients[5], day, 'solar'), 'r')
        
        # Graph the scatter plot with all the points we read from the CSV file
        plt.scatter(self.day, self.averageTemp, s=0.1) # s=0.1 is to control the size of the dots

        # Graph the long term linear temperature trend
        plt.plot(day, self.sinusoidalCoefficients[0] + self.sinusoidalCoefficients[1]*day, 'k')

        # Display the graph to show to whoever ran the program.
        plt.show()


    # These functions are simply here to make the equation for the curve of best fit a little less messy
    def sin(self, xi, d, cycle):
        if cycle == 'seasonal':
            return xi*np.sin(2*np.pi*d/365.25)
        elif cycle == 'solar':
            return xi*np.sin(2*np.pi*d/(365.25*10.7))

    def cos(self, xi, d, cycle):
        if cycle == 'seasonal':
            return xi*np.cos(2*np.pi*d/365.25)
        elif cycle == 'solar':
            return xi*np.cos(2*np.pi*d/(365.25*10.7))

lineFitter = LineFitter("Corvallis.csv")
lineFitter.LinearRegression()
lineFitter.SinusoidalFunction()
lineFitter.plotResults()