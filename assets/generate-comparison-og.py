#!/usr/bin/env python3
"""Generate the 1200×630 card for the Canadian program comparison."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "hero-ev-home.webp"
OUTPUT = ROOT / "og-grizzle-vs-chargelab.jpg"
BOLD = "/usr/share/fonts/truetype/noto/NotoSansDisplay-Bold.ttf"
REGULAR = "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf"

W, H = 1200, 630
img = Image.open(SOURCE).convert("RGB")
scale = max(W / img.width, H / img.height)
img = img.resize((round(img.width * scale), round(img.height * scale)), Image.Resampling.LANCZOS)
left = (img.width - W) // 2
upper = (img.height - H) // 2
img = img.crop((left, upper, left + W, upper + H)).filter(ImageFilter.GaussianBlur(0.25))

overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
od = ImageDraw.Draw(overlay)
for x in range(W):
    alpha = 246 if x < 735 else max(82, round(246 - ((x - 735) / 465) * 164))
    od.line((x, 0, x, H), fill=(3, 18, 26, alpha))
img = Image.alpha_composite(img.convert("RGBA"), overlay)
d = ImageDraw.Draw(img)

font_kicker = ImageFont.truetype(BOLD, 24)
font_title = ImageFont.truetype(BOLD, 61)
font_body = ImageFont.truetype(REGULAR, 25)
font_small = ImageFont.truetype(REGULAR, 18)
font_brand = ImageFont.truetype(BOLD, 24)
white = "#fffdf8"
mint = "#9ee5c7"
soft = "#dbe6e4"
red = "#e33131"

# Independent site mark.
d.ellipse((60, 44, 101, 85), fill=red)
d.rounded_rectangle((74, 53, 87, 74), radius=4, outline=white, width=3)
d.line((77, 49, 77, 58), fill=white, width=3)
d.line((84, 49, 84, 58), fill=white, width=3)
d.text((114, 49), "EV REWARDS CANADA", font=font_brand, fill=white)

# Comparison message.
d.text((60, 130), "CANADIAN HOME-CHARGING REWARDS", font=font_kicker, fill=mint)
d.text((60, 183), "Grizzl-E Club vs", font=font_title, fill=white)
d.text((60, 253), "ChargeLab Rewards", font=font_title, fill=mint)
d.text((60, 348), "Hardware, ownership, payouts & exit terms", font=font_body, fill=white)

# Method and disclosure.
d.rounded_rectangle((60, 417, 705, 504), radius=5, fill=(6, 23, 31, 215), outline=(255, 255, 255, 44), width=1)
d.text((82, 435), "Independent, first-party terms comparison", font=font_small, fill=soft)
d.text((82, 468), "Checked August 11, 2026 • Current terms control", font=font_small, fill=soft)
d.text((60, 555), "Referral relationship disclosed in the guide", font=font_small, fill=soft)

img.convert("RGB").save(OUTPUT, "JPEG", quality=91, optimize=True, progressive=True)
print(f"wrote {OUTPUT} ({OUTPUT.stat().st_size} bytes)")
