import os
import json

folder = "images/original"
output_dir = "scripts/python/output"
os.makedirs(output_dir, exist_ok=True)

filenames = [f for f in os.listdir(folder) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp'))]

with open(os.path.join(output_dir, "imageFilenames.json"), "w") as outfile:
    json.dump(filenames, outfile, indent=2)