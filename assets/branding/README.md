# EcoSort AI icon

Approved leaf-and-circular-arrow symbol from the EcoSort AI logo, 19 October 2026.

- `ecosort-symbol.svg`: source of truth; self-contained vector.
- `ecosort-icon.png`: opaque 1024 × 1024 platform/legacy icon.
- `ecosort-adaptive-foreground.png`: transparent 1024 × 1024 Android foreground, padded inside the adaptive safe area.
- `ecosort-monochrome.png`: alpha mask for Android themed icons.
- `ecosort-favicon.png`: opaque 256 × 256 web favicon.

Palette: #28633F mark, #F1F6F0 background. The operating system controls the final launcher shape.

To regenerate: `python3 scripts/generate-brand-icons.py` (Pillow and Inkscape required only for regeneration). CI uses the checked-in PNGs directly. Native icon changes require a fresh APK installation; an existing APK will keep its previous icon.
