from PIL import Image
import os

for f in os.listdir('.'):
    if f.endswith('.png'):
        with Image.open(f) as img:
            img.convert('RGB').save(f.replace('.png', '.jpg'), quality=95)
        os.remove(f)