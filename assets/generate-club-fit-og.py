#!/usr/bin/env python3
"""Generate the 1200×630 card for the Canadian Grizzl-E Club fit guide."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "hero-ev-home.webp"
OUTPUT = ROOT / "og-grizzle-club-fit-check.jpg"
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
    alpha = 248 if x < 795 else max(100, round(248 - ((x - 795) / 405) * 148))
    od.line((x, 0, x, H), fill=(3, 18, 26, alpha))
img = Image.alpha_composite(img.convert("RGBA"), overlay)
d = ImageDraw.Draw(img)

font_brand = ImageFont.truetype(BOLD, 24)
font_kicker = ImageFont.truetype(BOLD, 23)
font_title = ImageFont.truetype(BOLD, 65)
font_body = ImageFont.truetype(REGULAR, 24)
font_badge = ImageFont.truetype(BOLD, 20)
font_small = ImageFont.truetype(REGULAR, 17)
white = "#fffdf8"
mint = "#9ee5c7"
soft = "#dbe6e4"
red = "#e33131"

# Independent site mark.
d.ellipse((60, 43, 101, 84), fill=red)
d.rounded_rectangle((74, 52, 87, 73), radius=4, outline=white, width=3)
d.line((77, 48, 77, 57), fill=white, width=3)
d.line((84, 48, 84, 57), fill=white, width=3)
d.text((114, 48), "EV REWARDS CANADA", font=font_brand, fill=white)

# Query-aligned message.
d.text((60, 124), "CANADIAN TERMS-BASED FIT CHECK", font=font_kicker, fill=mint)
d.text((60, 173), "Is Grizzl-E Club", font=font_title, fill=white)
d.text((60, 246), "worth it?", font=font_title, fill=mint)
d.text((60, 341), "Costs • Wi-Fi • Active use • Ownership • Exit terms", font=font_body, fill=white)

# Timely update badge.
d.rounded_rectangle((60, 405, 626, 464), radius=5, fill=red)
d.text((82, 421), "NEW: “UP TO 15¢/KWH” EXPLAINED", font=font_badge, fill=white)

# Evidence and disclosure.
d.text((60, 505), "Official terms checked August 14, 2026", font=font_small, fill=soft)
d.text((60, 540), "Independent member-referral guide • relationship disclosed", font=font_small, fill=soft)

img.convert("RGB").save(OUTPUT, "JPEG", quality=91, optimize=True, progressive=True)
print(f"wrote {OUTPUT} ({OUTPUT.stat().st_size} bytes)")
