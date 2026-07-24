#!/usr/bin/env python3
"""Generate responsive, square WebP thumbnails for the homepage project grid."""

from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path
from urllib.parse import urlparse

try:
    from PIL import Image, ImageOps
except ImportError as error:
    raise SystemExit(
        "Pillow is required. Install it with "
        "`python3 -m pip install -r tools/requirements.txt`."
    ) from error


ROOT_DIR = Path(__file__).resolve().parent.parent
PROJECTS_DIR = ROOT_DIR / "projects"
THUMBNAILS_DIR = ROOT_DIR / "img" / "project-thumbnails"
MANIFEST_PATH = THUMBNAILS_DIR / "manifest.json"
PROJECT_SOURCE_FILE = "index.md"
TARGET_WIDTHS = (400, 800, 1200)
MAX_WIDTH = TARGET_WIDTHS[-1]
WEBP_QUALITY = 88


def read_image_source(markdown_path: Path) -> str:
    source = markdown_path.read_text(encoding="utf-8")
    front_matter = re.match(r"^---\r?\n([\s\S]*?)\r?\n---", source)

    if not front_matter:
        raise ValueError(f"{markdown_path} must start with YAML front matter.")

    image_source = re.search(
        r"^imageSrc:\s*(?:\"([^\"]+)\"|'([^']+)'|([^#\r\n]+))\s*$",
        front_matter.group(1),
        flags=re.MULTILINE,
    )

    if not image_source:
        raise ValueError(f"{markdown_path} must define imageSrc.")

    return next(
        value.strip() for value in image_source.groups() if value is not None
    )


def is_remote_source(source: str) -> bool:
    parsed = urlparse(source)
    return parsed.scheme in {"http", "https"} or bool(parsed.netloc)


def resolve_local_source(source: str) -> Path:
    source_path = (ROOT_DIR / source.lstrip("/")).resolve()

    try:
        source_path.relative_to(ROOT_DIR)
    except ValueError as error:
        raise ValueError(f"Image source escapes the site root: {source}") from error

    if not source_path.is_file():
        raise FileNotFoundError(f"Image source does not exist: {source}")

    return source_path


def source_digest(source_path: Path) -> str:
    digest = hashlib.sha256()
    with source_path.open("rb") as source_file:
        for chunk in iter(lambda: source_file.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def variant_widths(square_size: int) -> list[int]:
    if square_size < TARGET_WIDTHS[0]:
        return [square_size]

    widths = [width for width in TARGET_WIDTHS if width < square_size]
    widths.append(min(square_size, MAX_WIDTH))
    return sorted(set(widths))


def prepare_image(source_path: Path) -> tuple[Image.Image, bytes | None]:
    with Image.open(source_path) as opened_image:
        image = ImageOps.exif_transpose(opened_image)
        icc_profile = image.info.get("icc_profile")
        image.load()

    if image.mode not in {"RGB", "RGBA"}:
        has_transparency = image.mode in {"LA", "PA"} or (
            image.mode == "P" and "transparency" in image.info
        )
        image = image.convert("RGBA" if has_transparency else "RGB")

    square_size = min(image.size)
    left = (image.width - square_size) // 2
    top = (image.height - square_size) // 2
    square = image.crop((left, top, left + square_size, top + square_size))
    return square, icc_profile


def write_variant(
    square: Image.Image,
    width: int,
    output_path: Path,
    icc_profile: bytes | None,
) -> None:
    if square.width == width:
        variant = square.copy()
    else:
        variant = square.resize((width, width), Image.Resampling.LANCZOS)

    save_options = {
        "format": "WEBP",
        "quality": WEBP_QUALITY,
        "method": 6,
        "exact": True,
    }
    if icc_profile:
        save_options["icc_profile"] = icc_profile

    variant.save(output_path, **save_options)


def relative_site_path(path: Path) -> str:
    return "/" + path.relative_to(ROOT_DIR).as_posix()


def generate_project_thumbnails() -> None:
    THUMBNAILS_DIR.mkdir(parents=True, exist_ok=True)
    project_entries = {}
    expected_files = {MANIFEST_PATH.name}
    original_bytes = 0
    thumbnail_bytes = 0

    for markdown_path in sorted(PROJECTS_DIR.glob(f"*/{PROJECT_SOURCE_FILE}")):
        slug = markdown_path.parent.name
        source = read_image_source(markdown_path)

        if is_remote_source(source):
            continue

        source_path = resolve_local_source(source)
        original_bytes += source_path.stat().st_size
        square, icc_profile = prepare_image(source_path)
        variants = []

        for width in variant_widths(square.width):
            filename = f"{slug}-{width}.webp"
            output_path = THUMBNAILS_DIR / filename
            write_variant(square, width, output_path, icc_profile)
            expected_files.add(filename)
            thumbnail_bytes += output_path.stat().st_size
            variants.append(
                {
                    "src": relative_site_path(output_path),
                    "width": width,
                    "height": width,
                }
            )

        project_entries[slug] = {
            "source": source,
            "sourceSha256": source_digest(source_path),
            "variants": variants,
        }

    for generated_file in THUMBNAILS_DIR.iterdir():
        if generated_file.is_file() and generated_file.name not in expected_files:
            generated_file.unlink()

    manifest = {
        "version": 1,
        "settings": {
            "format": "webp",
            "quality": WEBP_QUALITY,
            "targetWidths": list(TARGET_WIDTHS),
            "crop": "center-square",
        },
        "projects": project_entries,
    }
    MANIFEST_PATH.write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )

    print(
        f"Generated {sum(len(entry['variants']) for entry in project_entries.values())} "
        f"thumbnail variants for {len(project_entries)} local projects."
    )
    print(
        f"Homepage local image payload: {original_bytes / 1024 / 1024:.2f} MiB "
        f"originals -> {thumbnail_bytes / 1024 / 1024:.2f} MiB across all variants."
    )


if __name__ == "__main__":
    generate_project_thumbnails()
