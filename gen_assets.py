from PIL import Image, ImageDraw, ImageFont
import os

OUT = os.path.dirname(os.path.abspath(__file__))

# ---- favicon.ico (64x64) ----
fav = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
d = ImageDraw.Draw(fav)
d.rounded_rectangle([0, 0, 63, 63], radius=14, fill=(37, 99, 235, 255))
d.polygon([(25, 19), (47, 32), (25, 45)], fill=(255, 255, 255, 255))
fav.save(os.path.join(OUT, "favicon.ico"), sizes=[(64, 64)])

# ---- og-image.png (1200x630) ----
W, H = 1200, 630
og = Image.new("RGB", (W, H), (15, 23, 42))
d2 = ImageDraw.Draw(og)
d2.rectangle([0, 0, 12, H], fill=(37, 99, 235))
d2.polygon([(150, 250), (150, 380), (280, 315)], fill=(37, 99, 235))

def load_font(size):
    for path in [
        "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/seguiemj.ttf",
    ]:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            continue
    return ImageFont.load_default()

font_big = load_font(72)
font_mid = load_font(40)
font_small = load_font(32)

d2.text((320, 232), "Online URL Player", font=font_big, fill=(255, 255, 255))
d2.text((322, 330), "Play any video from a URL", font=font_mid, fill=(148, 163, 184))
d2.text((322, 400), "M3U8  /  HLS  /  MP4  /  DASH  /  WebM", font=font_small, fill=(100, 116, 139))
og.save(os.path.join(OUT, "og-image.png"))

print("assets generated:", os.path.join(OUT, "favicon.ico"), os.path.join(OUT, "og-image.png"))
