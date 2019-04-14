import re

regex = re.compile(r'(\"[^"]*\")')
with open("pictureURLs.txt") as urlsFile:
    for line in urlsFile:
        result = regex.findall(line)
        print(result[0] + ",")