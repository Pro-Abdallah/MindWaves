import cv2
import numpy as np

# Load the image
img = cv2.imread('d:/MindWaves/MindWaves/client/Assets/safe-harbor-bulletin-board.png')
h, w, c = img.shape
print(f"Image dimensions: {w}x{h}")

# Convert to HSV or Grayscale
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# The papers are bright/light compared to the dark wooden board.
# Let's apply a threshold to isolate the papers.
_, thresh = cv2.threshold(gray, 180, 255, cv2.THRESH_BINARY)

# Find contours
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

print(f"Found {len(contours)} contours.")

papers = []
for idx, cnt in enumerate(contours):
    x, y, gw, gh = cv2.boundingRect(cnt)
    # Filter by size to make sure we only get the paper notes
    if gw > 30 and gh > 50:
        top_pct = (y / h) * 100
        left_pct = (x / w) * 100
        width_pct = (gw / w) * 100
        height_pct = (gh / h) * 100
        papers.append({
            'idx': idx,
            'x': x, 'y': y, 'w': gw, 'h': gh,
            'top': f"{top_pct:.1f}%",
            'left': f"{left_pct:.1f}%",
            'width': f"{width_pct:.1f}%",
            'height': f"{height_pct:.1f}%"
        })

# Sort papers from left to right (by x coordinate)
papers = sorted(papers, key=lambda p: p['x'])

for i, p in enumerate(papers):
    name = ["Left Paper", "Middle Paper", "Right Paper"][i] if i < 3 else f"Paper {i}"
    print(f"\n{name}:")
    print(f"  Pixel Bbox: x={p['x']}, y={p['y']}, w={p['w']}, h={p['h']}")
    print(f"  Pct Bbox: top={p['top']}, left={p['left']}, width={p['width']}, height={p['height']}")
