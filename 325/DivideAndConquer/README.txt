Authors: Chase Denecke and Nickoli Londura

Bruteforce, naive divide-and-conquer and enhanced divide-and-conquer are all located in
closestPoints.py. To run any of the algorithms from the command line using the source code, the command is:

$ python3 ./closestPoints.py [inputFile] [algorithm]

So for example, bruteforce would be run with using an input file called randomPoints.txt with the following command:

$ python3 ./closestPoints.py randomPoints.txt bruteforce

Naive divide-and-conquer can be run with:

$ python3 ./closestPoints.py randomPoints.txt ndc

And enhanced divid-and-conquer could be run with:

$ python3 ./closestPoints.py randomPoints.txt edc

To run the runTimeAnalysis:

$ python3 ./runtimeAnalysis.py [input size] [distinct]