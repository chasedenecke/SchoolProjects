import requests
import json
url = 'http://localhost:3000/fileUpload'
files = {'bob': open('./test.png', 'rb')}
r = requests.post(url, files=files, data = {'key':'fuck this value'})
print r.text
