#!/usr/bin/env python3
"""Generate Facebook Page avatar and cover assets for EV Home Rewards."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "hero-ev-home.webp"
AVATAR = ROOT / "facebook-avatar.png"
COVER = ROOT / "facebook-cover.jpg"
BOLD = "/usr/share/fonts/truetype/noto/NotoSansDisplay-Bold.ttf"
REGULAR = "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf"
NAVY = "#06171f"
MINT = "#9ee5c7"
WHITE = "#fffdf8"
SOFT = "#d9e4e7"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def generate_avatar() -> None:
    size = 512
    img = Image.new("RGB", (size, size), NAVY)
    d = ImageDraw.Draw(img)

    # Keep all important content inside the circular crop safe area.
    d.ellipse((24, 24, 488, 488), fill="#0b2b36", outline=WHITE, width=8)
    d.ellipse((58, 58, 454, 454), fill=MINT)

    ev_font = font(BOLD, 194)
    label_font = font(BOLD, 36)
    ev = "EV"
    ev_box = d.textbbox((0, 0), ev, font=ev_font)
    d.text(((size - (ev_box[2] - ev_box[0])) / 2, 100), ev, font=ev_font, fill=NAVY)

    label = "HOME REWARDS"
    label_box = d.textbbox((0, 0), label, font=label_font)
    d.rounded_rectangle((74, 346, 438, 412), radius=24, fill=NAVY)
    d.text(((size - (label_box[2] - label_box[0])) / 2, 356), label, font=label_font, fill=WHITE)

    img.save(AVATAR, "PNG", optimize=True)


def generate_cover() -> None:
    width, height = 1640, 624
    hero = Image.open(SOURCE).convert("RGB")
    img = ImageOps.fit(hero, (width, height), method=Image.Resampling.LANCZOS, centering=(0.55, 0.52)).convert("RGBA")

    overlay = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for x in range(width):
        # Strong reading field on the left; preserve the charger/vehicle on the right.
        alpha = int(235 * max(0.06, 1 - x / 1280))
        od.line((x, 0, x, height), fill=(6, 23, 31, alpha))
    img = Image.alpha_composite(img, overlay)
    d = ImageDraw.Draw(img)

    kicker_font = font(BOLD, 28)
    title_font = font(BOLD, 68)
    price_font = font(BOLD, 58)
    body_font = font(REGULAR, 30)
    fine_font = font(REGULAR, 23)

    # Place all essential text inside Facebook's center-crop safe area for mobile.
    content_x = 330
    d.text((content_x, 72), "PETER'S EV HOME REWARDS • CANADA", font=kicker_font, fill=MINT)
    d.text((content_x, 128), "Home EV charging rewards", font=title_font, fill=WHITE)
    d.text((content_x, 222), "$0 hardware purchase price*", font=price_font, fill=MINT)
    d.text((content_x, 313), "For eligible Canadian EV drivers", font=body_font, fill=WHITE)

    d.rounded_rectangle((316, 432, 1340, 556), radius=18, fill=(6, 23, 31, 220), outline=(255, 255, 255, 48), width=2)
    d.text((342, 455), "*Approval, refundable deposit, shipping and installation conditions apply.", font=fine_font, fill=SOFT)
    d.text((342, 501), "Independent Grizzl-E Club member referral • Current Club terms control", font=fine_font, fill=SOFT)

    img.convert("RGB").save(COVER, "JPEG", quality=92, optimize=True, progressive=True)


if __name__ == "__main__":
    generate_avatar()
    generate_cover()
    print(f"wrote {AVATAR} ({AVATAR.stat().st_size} bytes)")
    print(f"wrote {COVER} ({COVER.stat().st_size} bytes)")
