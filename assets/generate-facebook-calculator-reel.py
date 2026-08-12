#!/usr/bin/env python3
"""Generate a short, disclosed 9:16 calculator Reel for Facebook."""

from __future__ import annotations

from pathlib import Path
import subprocess
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
OUT_DIR = ROOT / "qa-output" / "facebook-calculator-reel"
OUT = OUT_DIR / "facebook-calculator-reel.mp4"
HERO = ASSETS / "hero-ev-home.webp"
BOLD = "/usr/share/fonts/truetype/noto/NotoSansDisplay-Bold.ttf"
REGULAR = "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf"
MONO_BOLD = "/usr/share/fonts/truetype/noto/NotoSansMono-Bold.ttf"

W, H = 1080, 1920
FPS = 30
NAVY = "#06171f"
NAVY_2 = "#0b2b36"
MINT = "#9ee5c7"
WHITE = "#fffdf8"
SOFT = "#d9e4e7"
GOLD = "#ffcc66"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def center_text(draw: ImageDraw.ImageDraw, y: int, text: str, fnt, fill: str, max_width: int = 920, spacing: int = 10) -> int:
    words = text.split()
    lines: list[str] = []
    line = ""
    for word in words:
        test = f"{line} {word}".strip()
        if draw.textbbox((0, 0), test, font=fnt)[2] <= max_width:
            line = test
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    for item in lines:
        box = draw.textbbox((0, 0), item, font=fnt)
        x = int((W - (box[2] - box[0])) // 2)
        draw.text((x, y), item, font=fnt, fill=fill)
        y += (box[3] - box[1]) + spacing
    return y


def base_card() -> Image.Image:
    hero = Image.open(HERO).convert("RGB")
    bg = ImageOps.fit(hero, (W, H), method=Image.Resampling.LANCZOS, centering=(0.58, 0.50))
    bg = bg.filter(ImageFilter.GaussianBlur(5))
    bg = ImageEnhance.Brightness(bg).enhance(0.32).convert("RGBA")
    overlay = Image.new("RGBA", (W, H), (6, 23, 31, 110))
    bg = Image.alpha_composite(bg, overlay)
    d = ImageDraw.Draw(bg)
    d.rounded_rectangle((62, 126, 1018, 1788), radius=54, fill=(6, 23, 31, 232), outline=(158, 229, 199, 88), width=3)
    d.rounded_rectangle((94, 160, 986, 224), radius=30, fill=MINT)
    label = "CANADA • PRIVATE IN-BROWSER ESTIMATE"
    lf = font(BOLD, 29)
    box = d.textbbox((0, 0), label, font=lf)
    d.text(((W - (box[2] - box[0])) / 2, 173), label, font=lf, fill=NAVY)
    return bg


def pill(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], title: str, value: str, accent: str = MINT) -> None:
    draw.rounded_rectangle(box, radius=34, fill=NAVY_2, outline=accent, width=3)
    x1, y1, x2, y2 = box
    tf = font(REGULAR, 31)
    vf = font(BOLD, 54)
    draw.text((x1 + 34, y1 + 26), title, font=tf, fill=SOFT)
    vb = draw.textbbox((0, 0), value, font=vf)
    draw.text((x2 - 34 - (vb[2] - vb[0]), y1 + 62), value, font=vf, fill=accent)


def footer(draw: ImageDraw.ImageDraw, primary: str, secondary: str = "") -> None:
    pf = font(BOLD, 27)
    sf = font(REGULAR, 24)
    center_text(draw, 1585, primary, pf, WHITE, max_width=860, spacing=5)
    if secondary:
        center_text(draw, 1665, secondary, sf, SOFT, max_width=850, spacing=5)


def render_cards() -> list[Path]:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    cards: list[Path] = []

    # Card 1 — hook
    img = base_card(); d = ImageDraw.Draw(img)
    center_text(d, 365, "What could home EV charging cost in year one?", font(BOLD, 78), WHITE, spacing=12)
    center_text(d, 770, "Start with five simple numbers.", font(REGULAR, 43), MINT)
    d.line((270, 940, 810, 940), fill=MINT, width=6)
    center_text(d, 1030, "Ballpark first. Fine-tune later.", font(BOLD, 49), WHITE)
    footer(d, "No signup needed to calculate.", "Nothing you enter is transmitted or stored.")
    cards.append(save(img, 1))

    # Card 2 — driving assumptions
    img = base_card(); d = ImageDraw.Draw(img)
    center_text(d, 330, "A realistic starter example", font(BOLD, 68), WHITE)
    pill(d, (125, 625, 955, 825), "Annual driving", "15,000 km")
    pill(d, (125, 890, 955, 1090), "Charged at home", "80%")
    center_text(d, 1215, "Rounded from NRCan’s 2023 car and light-truck estimates—not a prediction for you.", font(REGULAR, 39), SOFT, max_width=820)
    footer(d, "Change only what you know.")
    cards.append(save(img, 2))

    # Card 3 — large cash inputs
    img = base_card(); d = ImageDraw.Draw(img)
    center_text(d, 330, "Add the two big upfront numbers", font(BOLD, 66), WHITE)
    pill(d, (125, 625, 955, 825), "Example charger", "$700", GOLD)
    pill(d, (125, 890, 955, 1090), "Example installation quote", "$1,500", GOLD)
    center_text(d, 1230, "Planning examples—not quotes or Canadian averages.", font(BOLD, 37), WHITE, max_width=820)
    footer(d, "Use your electrician’s quote when available.")
    cards.append(save(img, 3))

    # Card 4 — result reveal
    img = base_card(); d = ImageDraw.Draw(img)
    center_text(d, 320, "Starter result", font(BOLD, 64), MINT)
    center_text(d, 500, "$2,560", font(MONO_BOLD, 126), WHITE)
    center_text(d, 655, "estimated first-year cost", font(BOLD, 44), SOFT)
    d.rounded_rectangle((130, 820, 950, 1100), radius=44, fill=NAVY_2, outline=MINT, width=3)
    center_text(d, 865, "$2,200 upfront", font(BOLD, 58), WHITE)
    center_text(d, 970, "+ about $30/month electricity", font(BOLD, 39), MINT)
    center_text(d, 1225, "Your rate, vehicle and electrical quote can change this.", font(REGULAR, 36), SOFT, max_width=820)
    footer(d, "Ballpark only—not a guaranteed cost.")
    cards.append(save(img, 4))

    # Card 5 — CTA and compact disclosure
    img = base_card(); d = ImageDraw.Draw(img)
    center_text(d, 320, "Run your own numbers", font(BOLD, 74), WHITE)
    d.rounded_rectangle((160, 620, 920, 795), radius=42, fill=MINT)
    center_text(d, 664, "FREE CALCULATOR", font(BOLD, 53), NAVY)
    center_text(d, 900, "Peter’s EV Home Rewards Canada", font(BOLD, 42), WHITE)
    center_text(d, 1010, "Independent member resource", font(REGULAR, 35), MINT)
    d.rounded_rectangle((120, 1170, 960, 1535), radius=36, fill=NAVY_2, outline=(255, 255, 255, 55), width=2)
    disclosure = "Independent Grizzl-E Club member resource. Peter may earn 1¢ per eligible referred kWh. Approval and current terms control. Other conditions are in the caption."
    center_text(d, 1230, disclosure, font(BOLD, 38), SOFT, max_width=760, spacing=9)
    footer(d, "Calculator link + full conditions in the caption.")
    cards.append(save(img, 5))
    return cards


def save(img: Image.Image, index: int) -> Path:
    path = OUT_DIR / f"card-{index}.png"
    img.convert("RGB").save(path, "PNG", optimize=True)
    return path


def render_video(cards: list[Path]) -> None:
    clips: list[Path] = []
    durations = [3, 3, 3, 3, 3]
    for idx, (card, duration) in enumerate(zip(cards, durations), 1):
        clip = OUT_DIR / f"clip-{idx}.mp4"
        subprocess.run([
            "ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-i", str(card),
            "-t", str(duration), "-r", str(FPS), "-vf", f"scale={W}:{H},format=yuv420p",
            "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-movflags", "+faststart", str(clip)
        ], check=True)
        clips.append(clip)
    concat = OUT_DIR / "concat.txt"
    concat.write_text("\n".join(f"file '{p.name}'" for p in clips) + "\n")
    subprocess.run([
        "ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(concat),
        "-c", "copy", "-movflags", "+faststart", str(OUT)
    ], check=True, cwd=OUT_DIR)


if __name__ == "__main__":
    cards = render_cards()
    render_video(cards)
    print(OUT)
