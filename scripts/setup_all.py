#!/usr/bin/env python3
import os
import shutil
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
            print(f"- Optional {url} skipped ({e})")
        else:
            print(f"✗ Failed {url} -> {dest_rel}: {e}")
            raise


def main():
    print("=== 1. Setting up Arpeggios ===")
    arp_base = "https://musiclab.chromeexperiments.com/arpeggios-service/build/"
    arp_files = [
        "bundle.js",
        "vendors-node_modules_css-loader_lib_css-base_js-node_modules_domready_ready_js-node_modules_s-bac8a2.bundle.js",
        "static_style_main_scss-static_app_Touchstart_js.bundle.js",
        "vendors-node_modules_jquery-knob_dist_jquery_knob_min_js-node_modules_slick-carousel_slick_sl-68337b.bundle.js",
        "static_app_chord_Chord_js.bundle.js"
    ]
    for f in arp_files:
        download(arp_base + f, f"arpeggios/build/{f}")

    print("\n=== 2. Setting up Chords ===")
    chords_base = "https://musiclab.chromeexperiments.com/chords-service/build/"
    chords_files = [
        "bundle.js",
        "app_Start_js-app_Touchstart_js-app_interface_Piano_js-app_interface_Toggle_js-app_sound_Arp_j-e2c542.bundle.js",
        "vendors-node_modules_css-loader_lib_css-base_js-node_modules_domready_ready_js-node_modules_s-7c81c8.bundle.js"
    ]
    for f in chords_files:
        download(chords_base + f, f"chords/build/{f}")

    print("\n=== 3. Setting up Melody Maker ===")
    melody_base = "https://musiclab.chromeexperiments.com/melodymaker-service/build/"
    melody_files = [
        "bundle.js",
        "app_grid_Grid_js-app_interface_Bottom_js-app_sound_Player_js-app_sound_Sequencer_js-style_main_scss.bundle.js",
        "vendors-node_modules_css-loader_lib_css-base_js-node_modules_domready_ready_js-node_modules_s-9cfa67.bundle.js"
    ]
    for f in melody_files:
        download(melody_base + f, f"melodymaker/build/{f}")

    print("\n=== 4. Setting up Piano Roll ===")
    piano_base = "https://musiclab.chromeexperiments.com/pianoroll-service/build/"
    piano_files = [
        "loader.js",
        "bundle.js",
        "PianoRoll.js"
    ]
    for f in piano_files:
        download(piano_base + f, f"pianoroll/build/{f}")

    print("\n=== 5. Setting up Sound Spinner ===")
    spinner_base = "https://musiclab.chromeexperiments.com/voicespinner-service/build/"
    spinner_files = [
        "compatibility-check.bundle.js",
        "app.bundle.js",
        "app_Touchstart_js-app_Visible_js-app_interface_UserInterface_js-app_mic_Loader_js-app_mic_Pla-48850f.bundle.js",
        "vendors-node_modules_css-loader_lib_css-base_js-node_modules_domready_ready_js-node_modules_j-c874be.bundle.js"
    ]
    for f in spinner_files:
        download(spinner_base + f, f"soundspinner/build/{f}")

    print("\n=== 6. Setting up Spectrogram ===")
    spec_base = "https://musiclab.chromeexperiments.com/spectrogram-service/"
    spec_files = [
        ("css/screen.css", "spectrogram/css/screen.css"),
        ("js/bundle.js", "spectrogram/js/bundle.js"),
        ("js/app.js", "spectrogram/js/app.js"),
        ("bin/fonts/icons/icons.woff", "spectrogram/bin/fonts/icons/icons.woff", False),
        ("bin/fonts/icons/icons.ttf", "spectrogram/bin/fonts/icons/icons.ttf", False),
        ("bin/fonts/icons/icons.svg", "spectrogram/bin/fonts/icons/icons.svg", True),
        ("bin/fonts/icons/icons.eot", "spectrogram/bin/fonts/icons/icons.eot", True),
    ]
    for item in spec_files:
        src = item[0]
        dst = item[1]
        opt = item[2] if len(item) > 2 else False
        download(spec_base + src, dst, optional=opt)


    # Copy local shaders, sounds, images into spectrogram
    shutil.copytree(os.path.join(ROOT_DIR, "spectrogram/src/bin/shaders"), os.path.join(ROOT_DIR, "spectrogram/bin/shaders"), dirs_exist_ok=True)
    shutil.copytree(os.path.join(ROOT_DIR, "spectrogram/src/bin/snd"), os.path.join(ROOT_DIR, "spectrogram/bin/snd"), dirs_exist_ok=True)
    os.makedirs(os.path.join(ROOT_DIR, "spectrogram/img"), exist_ok=True)
    for img in ["finger_anim.png", "horse.jpg", "seven.png"]:
        src_img = os.path.join(ROOT_DIR, "spectrogram/src/images", img)
        if os.path.exists(src_img):
            shutil.copy2(src_img, os.path.join(ROOT_DIR, "spectrogram/img", img))
    print("✓ Copied spectrogram shaders, sounds, and images")

    print("\n=== 7. Setting up Sound Waves ===")
    # Copy soundwaves dist files to root of soundwaves/
    dist_dir = os.path.join(ROOT_DIR, "soundwaves/dist")
    sw_dir = os.path.join(ROOT_DIR, "soundwaves")
    for item in os.listdir(dist_dir):
        s = os.path.join(dist_dir, item)
        d = os.path.join(sw_dir, item)
        if os.path.isdir(s):
            shutil.copytree(s, d, dirs_exist_ok=True)
        else:
            shutil.copy2(s, d)
    print("✓ Copied soundwaves/dist to soundwaves/")

    print("\n=== 8. Downloading Official Thumbnails for Landing Portal ===")
    thumb_base = "https://musiclab.chromeexperiments.com/img/experiments/"
    thumbs = [
        ("thumbnail_arpeggios.jpg", "assets/thumbnails/arpeggios.jpg"),
        ("thumbnail_chords.jpg", "assets/thumbnails/chords.jpg"),
        ("thumbnail_harmonics.jpg", "assets/thumbnails/harmonics.jpg"),
        ("thumbnail_strings.jpg", "assets/thumbnails/strings.jpg"),
        ("thumbnail_melody_maker.jpg", "assets/thumbnails/melodymaker.jpg"),
        ("thumbnail_pianoroll.jpg", "assets/thumbnails/pianoroll.jpg"),
        ("thumbnail_voicespinner.jpg", "assets/thumbnails/soundspinner.jpg"),
        ("thumbnail_frequency.jpg", "assets/thumbnails/soundwaves.jpg"),
        ("thumbnail_spectrogram.jpg", "assets/thumbnails/spectrogram.jpg"),
    ]
    for src, dst in thumbs:
        download(thumb_base + src, dst)

    print("\nSetup completed successfully!")

if __name__ == "__main__":
    main()
