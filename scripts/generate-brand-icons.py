"""Rasterize the approved vector mark into Expo icon assets.
Requires Inkscape and Pillow only when regenerating; checked-in PNGs are used by CI.
"""
from pathlib import Path
import subprocess
import tempfile
from PIL import Image

root = Path(__file__).resolve().parents[1]
folder = root / 'assets' / 'branding'
with tempfile.TemporaryDirectory() as tmp:
    raw = Path(tmp) / 'symbol.png'
    subprocess.run(['inkscape', str(folder / 'ecosort-symbol.svg'), '--export-type=png', '--export-width=1024', '--export-height=1024', '--export-filename=' + str(raw)], check=True)
    symbol = Image.open(raw).convert('RGBA')
    # Keep the complete artwork comfortably inside the Android adaptive-icon
    # central 66/108 safe circle, including the top arrowhead.
    layer = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
    scaled = symbol.resize((666, 666), Image.Resampling.LANCZOS)
    layer.alpha_composite(scaled, ((1024 - 666) // 2, (1024 - 666) // 2))
    layer.save(folder / 'ecosort-adaptive-foreground.png')
    mono = Image.new('RGBA', layer.size, (0, 0, 0, 0))
    mono.putalpha(layer.getchannel('A'))
    mono.save(folder / 'ecosort-monochrome.png')
    # Opaque, unmasked platform icon; the OS supplies its own launcher mask.
    icon = Image.new('RGBA', (1024, 1024), '#F1F6F0')
    icon.alpha_composite(layer)
    icon.convert('RGB').save(folder / 'ecosort-icon.png')
    # The browser icon can use more of its canvas for legibility at 16–32 px.
    favicon = Image.new('RGBA', (1024, 1024), '#F1F6F0')
    favicon.alpha_composite(symbol)
    favicon.resize((256, 256), Image.Resampling.LANCZOS).convert('RGB').save(folder / 'ecosort-favicon.png')
print('Generated platform, adaptive, monochrome and favicon PNGs from the approved SVG.')
