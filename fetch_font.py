import urllib.request
import re
import zipfile
import io

url = "https://fontsgeek.com/fonts/Revue-Regular"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    # try to find a download link
    match = re.search(r'href="(.*?download.*?)"', html)
    if match:
        dl_url = match.group(1)
        if not dl_url.startswith('http'):
            dl_url = "https://fontsgeek.com" + dl_url
        print("Downloading from", dl_url)
        req2 = urllib.request.Request(dl_url, headers={'User-Agent': 'Mozilla/5.0'})
        data = urllib.request.urlopen(req2).read()
        with open("revue.zip", "wb") as f:
            f.write(data)
        print("Done.")
except Exception as e:
    print("Error:", e)
