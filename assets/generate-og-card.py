#!/usr/bin/env python3
"""Generate the 1200×630 social link-preview card from the site hero."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "hero-ev-home.webp"
OUTPUT = ROOT / "og-ev-home.jpg"
BOLD = "/usr/share/fonts/truetype/noto/NotoSansDisplay-Bold.ttf"
REGULAR = "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf"

W, H = 1200, 630
img = Image.open(SOURCE).convert("RGB")
scale = max(W / img.width, H / img.height)
img = img.resize((round(img.width * scale), round(img.height * scale)), Image.Resampling.LANCZOS)
left = (img.width - W) // 2
upper = (img.height - H) // 2
img = img.crop((left, upper, left + W, upper + H)).filter(ImageFilter.GaussianBlur(0.15))

# Preserve the EV and charger on the right while creating a calm text field.
overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
overlay_draw = ImageDraw.Draw(overlay)
for x in range(W):
    if x < 620:
        alpha = int(238 - (x / 620) * 92)
    else:
        alpha = max(28, int(146 - ((x - 620) / 580) * 118))
    overlay_draw.line((x, 0, x, H), fill=(3, 17, 25, min(246, alpha + 12)))
img = Image.alpha_composite(img.convert("RGBA"), overlay)

d = ImageDraw.Draw(img)
font_kicker = ImageFont.truetype(BOLD, 25)
font_title = ImageFont.truetype(BOLD, 62)
font_price = ImageFont.truetype(BOLD, 64)
font_body = ImageFont.truetype(REGULAR, 25)
font_small = ImageFont.truetype(REGULAR, 19)
font_brand = ImageFont.truetype(BOLD, 24)

mint = "#9ee5c7"
white = "#fffdf8"
soft = "#dbe6e4"
red = "#e33131"

# Brand mark.
d.ellipse((60, 45, 101, 86), fill=red)
d.rounded_rectangle((74, 54, 87, 75), radius=4, outline=white, width=3)
d.line((77, 50, 77, 59), fill=white, width=3)
d.line((84, 50, 84, 59), fill=white, width=3)
d.text((114, 50), "EV REWARDS CANADA", font=font_brand, fill=white)

# Referral identity and core offer.
d.text((60, 132), "FOR ELIGIBLE CANADIAN EV DRIVERS", font=font_kicker, fill=mint)
d.text((60, 183), "Grizzl-E Club charger", font=font_title, fill=white)
d.text((60, 251), "$0 hardware purchase price", font=font_price, fill=mint)
d.text((60, 341), "Plus cash rewards on eligible home charging.", font=font_body, fill=white)

# Clear terms and relationship disclosure inside the image itself.
d.rounded_rectangle((60, 407, 670, 503), radius=5, fill=(6, 23, 31, 205), outline=(255, 255, 255, 48), width=1)
d.text((82, 425), "Approval, refundable deposit and shipping apply.", font=font_small, fill=soft)
d.text((82, 459), "Installation/electrical work may be your cost.", font=font_small, fill=soft)
d.text((60, 551), "Independent member referral • Current Club terms control", font=font_small, fill=soft)

img.convert("RGB").save(OUTPUT, "JPEG", quality=91, optimize=True, progressive=True)
print(f"wrote {OUTPUT} ({OUTPUT.stat().st_size} bytes)")
