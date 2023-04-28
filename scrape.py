import os
import json
import requests
from bs4 import BeautifulSoup, Tag

BASE_URL = "https://iansvivarium.com"
MORPHS_URL = f"{BASE_URL}/morphs/"

TYPE_MAP = {
    "Wildtypes": 0,
    "Single Recessive": 1,
    "Double Trait": 2,
    "Triple Trait": 3,
    "Quad Trait": 4,
    "Five Trait": 5,
    "Six Trait": 6,
    "Single Dominant": 7,
    "Single Incomplete Dominant": 7,
    "Selectively Bred": 8
}

def download_image(url, subdir):
    response = requests.get(url)
    if response.status_code == 200:
        with open(os.path.join(os.getcwd(), subdir), "wb") as f:
            f.write(response.content)
        return 1
    else:
        return 0

response = requests.get(MORPHS_URL)
soup = BeautifulSoup(response.text, "html.parser")
count = 0
t_count = 0
h_count = 0
a_count = 0
for li in soup.find_all("li", class_="morphlist-row"):
    current_header = None
    for sibling in li.previous_siblings:
        if isinstance(sibling, Tag) and sibling.has_attr("class") and "morphlist-header" in sibling["class"]:
            current_header = sibling.text
            break
    if (TYPE_MAP.get(current_header, -1)==-1):
        break
    
    count += 1
    
    img = li.find("img")
    thumbnail_url = f"{BASE_URL}/{img['src'].lstrip('../')}"
    thumbnail_filename = img["src"].split("/")[-1]
    t_flag = download_image(thumbnail_url, f"thumbnails/{thumbnail_filename}")
    t_count += t_flag
    anchor = li.find("a")
    morph_file_name = anchor['href'].split('?m=')[1].split('&sid')[0]
    morph_img_name = ''.join(morph_file_name.split('_'))
    morph_url = f"{BASE_URL}/morphs/{morph_file_name}/pics/"
    morph_name = anchor.text
    h_img_name = f"{morph_img_name}-h.jpg"
    a_img_name = f"{morph_img_name}-a.jpg"

    span = li.find("span", class_="ivcombo")
    traits = span.text.split(" + ")

    h_flag=download_image(f"{morph_url}{h_img_name}", f"pics/{h_img_name}")
    a_flag=download_image(f"{morph_url}{a_img_name}", f"pics/{a_img_name}")
    h_count += h_flag
    a_count += a_flag

    json_data = {
        "name": morph_name,
        "type": TYPE_MAP[current_header],
        "traits": traits,
        "thumbnail": f"./thumbnails/{thumbnail_filename}",
        "hatchlingImg": f"./pics/{h_img_name}" if h_flag else "",
        "adultImg": f"./pics/{a_img_name}" if a_flag else "",
    }

    with open(f"{os.getcwd()}/json/{morph_file_name}.json", "w") as f:
        json.dump(json_data, f, indent=2)
    b
    print(morph_file_name, t_flag, a_flag, h_flag)

print(count, t_count, a_count, h_count)
