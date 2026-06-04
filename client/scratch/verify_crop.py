import cv2

img = cv2.imread('d:/MindWaves/MindWaves/client/Assets/safe-harbor-bulletin-board.png')
h, w, c = img.shape

# The coordinates we got:
coords = [
    {"name": "left", "x": 98, "y": 179, "w": 106, "h": 130},
    {"name": "middle", "x": 209, "y": 177, "w": 95, "h": 127},
    {"name": "right", "x": 307, "y": 188, "w": 105, "h": 135}
]

for item in coords:
    x, y, gw, gh = item["x"], item["y"], item["w"], item["h"]
    crop = img[y:y+gh, x:x+gw]
    cv2.imwrite(f"d:/MindWaves/MindWaves/client/scratch/crop_{item['name']}.png", crop)
    print(f"Saved crop_{item['name']}.png - Size: {crop.shape}")
