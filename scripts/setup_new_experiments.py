#!/usr/bin/env python3
import os
import urllib.request
import gzip

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def download(url, dest_rel, optional=False):
    dest_path = os.path.join(ROOT_DIR, dest_rel)
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"})
    try:
        with urllib.request.urlopen(req) as res:
            data = res.read()
            if data[:2] == b"\x1f\x8b":
                data = gzip.decompress(data)
            with open(dest_path, "wb") as f:
                f.write(data)
        print(f"✓ {dest_rel} ({len(data)} bytes)")
    except Exception as e:
        if optional:
            print(f"- Skipped optional {url} ({e})")
        else:
            print(f"✗ Failed {url} -> {dest_rel}: {e}")
            raise

def main():
    print("=== Setting up Oscillators ===")
    osc_base = "https://musiclab.chromeexperiments.com/oscillators-service/"
    osc_files = [
        ("build.css", "oscillators/build.css"),
        ("vendor.js", "oscillators/vendor.js"),
        ("lib.js", "oscillators/lib.js"),
        ("main.js", "oscillators/main.js"),
        ("assets/texture/registration@2x.png", "oscillators/assets/texture/registration@2x.png"),
        ("assets/texture/puppets_sine@2x.png", "oscillators/assets/texture/puppets_sine@2x.png"),
        ("assets/texture/puppets_square@2x.png", "oscillators/assets/texture/puppets_square@2x.png"),
        ("assets/texture/puppets_triangle@2x.png", "oscillators/assets/texture/puppets_triangle@2x.png"),
        ("assets/texture/puppets_saw@2x.png", "oscillators/assets/texture/puppets_saw@2x.png"),
        ("assets/image/ui_arrow.svg", "oscillators/assets/image/ui_arrow.svg"),
    ]
    for src, dst in osc_files:
        download(osc_base + src, dst)

    # Clean standalone oscillators/index.html
    osc_html = """<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Oscillators - Laura's Music App</title>
    <meta name="viewport" content="user-scalable=no,width=device-width,initial-scale=1,maximum-scale=1">
    <link href="build.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Poppins&display=swap" rel="stylesheet">
</head>
<body>
    <div id="container">
        <div id="caption">
            <div class="line">oscillator.type = <span id="type-value">'sawtooth'</span>;</div>
            <div class="line">oscillator.frequency.value = <span id="freq-value">440</span>;</div>
        </div>
    </div>
    <script src="vendor.js"></script>
    <script src="lib.js"></script>
    <script src="main.js"></script>
</body>
</html>
"""
    with open(os.path.join(ROOT_DIR, "oscillators/index.html"), "w") as f:
        f.write(osc_html)
    print("✓ oscillators/index.html written")

    print("\n=== Setting up Rhythm ===")
    rhy_base = "https://musiclab.chromeexperiments.com/rhythm-service/"
    rhy_files = [
        ("build.css", "rhythm/build.css"),
        ("third-party.js", "rhythm/third-party.js"),
        ("lib.js", "rhythm/lib.js"),
        ("main.js", "rhythm/main.js"),
        ("assets/texture/slices_eyes.png", "rhythm/assets/texture/slices_eyes.png"),
        ("assets/image/ui_congas1.svg", "rhythm/assets/image/ui_congas1.svg"),
        ("assets/image/ui_congas2.svg", "rhythm/assets/image/ui_congas2.svg"),
        ("assets/image/ui_congas3.svg", "rhythm/assets/image/ui_congas3.svg"),
        ("assets/image/ui_drums1.svg", "rhythm/assets/image/ui_drums1.svg"),
        ("assets/image/ui_drums2.svg", "rhythm/assets/image/ui_drums2.svg"),
        ("assets/image/ui_drums3.svg", "rhythm/assets/image/ui_drums3.svg"),
        ("assets/image/ui_timpani1.svg", "rhythm/assets/image/ui_timpani1.svg"),
        ("assets/image/ui_timpani2.svg", "rhythm/assets/image/ui_timpani2.svg"),
        ("assets/image/ui_timpani3.svg", "rhythm/assets/image/ui_timpani3.svg"),
        ("assets/image/ui_woodblocks1.svg", "rhythm/assets/image/ui_woodblocks1.svg"),
        ("assets/image/ui_woodblocks2.svg", "rhythm/assets/image/ui_woodblocks2.svg"),
        ("assets/image/ui_woodblocks3.svg", "rhythm/assets/image/ui_woodblocks3.svg"),
        ("assets/image/ui_play.svg", "rhythm/assets/image/ui_play.svg"),
        ("assets/image/ui_pause.svg", "rhythm/assets/image/ui_pause.svg"),
        ("assets/image/ui_arrow.svg", "rhythm/assets/image/ui_arrow.svg"),
        ("assets/sample/conga-cowbell.mp3", "rhythm/assets/sample/conga-cowbell.mp3"),
        ("assets/sample/conga-high.mp3", "rhythm/assets/sample/conga-high.mp3"),
        ("assets/sample/conga-low.mp3", "rhythm/assets/sample/conga-low.mp3"),
        ("assets/sample/kit-hat.mp3", "rhythm/assets/sample/kit-hat.mp3"),
        ("assets/sample/kit-snare.mp3", "rhythm/assets/sample/kit-snare.mp3"),
        ("assets/sample/kit-tom.mp3", "rhythm/assets/sample/kit-tom.mp3"),
        ("assets/sample/timpani-triangle.mp3", "rhythm/assets/sample/timpani-triangle.mp3"),
        ("assets/sample/timpani-high.mp3", "rhythm/assets/sample/timpani-high.mp3"),
        ("assets/sample/timpani-low.mp3", "rhythm/assets/sample/timpani-low.mp3"),
        ("assets/sample/robot-clave.mp3", "rhythm/assets/sample/robot-clave.mp3"),
        ("assets/sample/robot-high.mp3", "rhythm/assets/sample/robot-high.mp3"),
        ("assets/sample/robot-low.mp3", "rhythm/assets/sample/robot-low.mp3"),

    ]
    for src, dst in rhy_files:
        download(rhy_base + src, dst)

    rhy_html = """<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Rhythm - Laura's Music App</title>
    <meta name="viewport" content="user-scalable=no,width=device-width,initial-scale=1,maximum-scale=1">
    <link href="build.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Poppins&display=swap" rel="stylesheet">
</head>
<body>
    <div id="container">
        <div id="about"></div>
        <div id="menu"></div>
    </div>
    <script type="text/javascript" src="https://gweb-musiclab-site.appspot.com/static/js/Tone.min.js"></script>
    <script src="third-party.js"></script>
    <script src="lib.js"></script>
    <script src="main.js"></script>
</body>
</html>
"""
    with open(os.path.join(ROOT_DIR, "rhythm/index.html"), "w") as f:
        f.write(rhy_html)
    print("✓ rhythm/index.html written")

    print("\n=== Setting up Kandinsky ===")
    kan_base = "https://musiclab.chromeexperiments.com/kandinsky-service/"
    kan_files = [
        ("assets/css/style.css", "kandinsky/assets/css/style.css"),
        ("assets/js/kandinsky.js", "kandinsky/assets/js/kandinsky.js"),
    ]
    for src, dst in kan_files:
        download(kan_base + src, dst)

    kan_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0, minimal-ui" />
    <title>Kandinsky - Laura's Music App</title>
    <link href="assets/css/style.css" rel="stylesheet" type="text/css" />
    <link href="https://fonts.googleapis.com/css?family=Poppins&display=swap" rel="stylesheet" />
</head>
<body>
    <div id="experience"></div>
    <div id="play-button" class="btn play">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#fff"/></svg>
    </div>
    <div id="reset-button" class="btn reset">
        <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="#fff"/></svg>
    </div>
    <div id="undo-button" class="btn undo">
        <svg viewBox="0 0 24 24"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C20.94 11.13 17.11 8 12.5 8z" fill="#fff"/></svg>
    </div>
    <script type="text/javascript" src="assets/js/kandinsky.js"></script>
</body>
</html>
"""
    with open(os.path.join(ROOT_DIR, "kandinsky/index.html"), "w") as f:
        f.write(kan_html)
    print("✓ kandinsky/index.html written")

    print("\n=== Setting up Viola the Bird and Blob Opera Wrappers ===")
    viola_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Viola the Bird - Laura's Music App</title>
    <style>
        body, html { margin:0; padding:0; width:100%; height:100%; overflow:hidden; background:#000; }
        iframe { width:100%; height:100%; border:none; display:block; }
    </style>
</head>
<body>
    <iframe src="https://gacembed.withgoogle.com/viola-the-bird?axl=1" allow="autoplay *; microphone *; midi *; camera *; accelerometer; gyroscope; fullscreen"></iframe>
</body>
</html>
"""
    os.makedirs(os.path.join(ROOT_DIR, "viola-the-bird"), exist_ok=True)
    with open(os.path.join(ROOT_DIR, "viola-the-bird/index.html"), "w") as f:
        f.write(viola_html)
    print("✓ viola-the-bird/index.html written")

    blob_html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Blob Opera - Laura's Music App</title>
    <style>
        body, html { margin:0; padding:0; width:100%; height:100%; overflow:hidden; background:#000; }
        iframe { width:100%; height:100%; border:none; display:block; }
    </style>
</head>
<body>
    <iframe src="https://gacembed.withgoogle.com/blob-opera?axl=1" allow="autoplay *; microphone *; midi *; camera *; accelerometer; gyroscope; fullscreen"></iframe>
</body>
</html>
"""
    os.makedirs(os.path.join(ROOT_DIR, "blob-opera"), exist_ok=True)
    with open(os.path.join(ROOT_DIR, "blob-opera/index.html"), "w") as f:
        f.write(blob_html)
    print("✓ blob-opera/index.html written")


    print("\n=== Additional Thumbnails ===")
    thumb_base = "https://musiclab.chromeexperiments.com/img/experiments/"
    new_thumbs = [
        ("thumbnail_oscillators.jpg", "assets/thumbnails/oscillators.jpg"),
        ("thumbanil_rhythm.jpg", "assets/thumbnails/rhythm.jpg"),
        ("thumbnail_kandinsky.jpg", "assets/thumbnails/kandinsky.jpg"),
    ]
    for src, dst in new_thumbs:
        download(thumb_base + src, dst, optional=True)

    # Viola the Bird & Blob Opera thumbnails from Google Arts & Culture CDN
    download("https://lh3.googleusercontent.com/ci/AL18g_TZn1jo_HcMQ8N41M61XQ_T2s08j0W7_W4ZlY0r1aP_qg4k-8aQ9B48hRrqW5M=s1200", "assets/thumbnails/viola.jpg", optional=True)
    download("https://lh3.googleusercontent.com/ci/AL18g_T400f_47HjZkGZ_lR8u_8oP6J4g5c-Q1r0n2S3m7t1h9k0v8x2b3n4m5=s1200", "assets/thumbnails/blob-opera.jpg", optional=True)

    print("\nAll new experiments configured successfully!")

if __name__ == "__main__":
    main()
