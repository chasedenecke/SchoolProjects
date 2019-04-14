import re

regex = re.compile(r"\"https.\"")
with open("pictureURLs.txt") as urlsFile:
    for line in urlsFile:
        result = regex.search(line)