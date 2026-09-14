import re

with open("terminology.html", "r", encoding="utf-8") as f:
    html = f.read()

# Locate start of target block:
start_marker = "// ============================================================\n    // VISUAL ASPECT: ARTICULATION (STACCATO VS LEGATO) CANVAS"
end_marker = "// ============================================================\n    // PROGRESSION TEMPO & FEEL ENGINE"

idx_start = html.find(start_marker)
idx_end = html.find(end_marker)

if idx_start == -1 or idx_end == -1:
    print(f"Error: markers not found. start={idx_start}, end={idx_end}")
    exit(1)

with open("full_engine_block.js", "r", encoding="utf-8") as f_eng:
    full_engine = f_eng.read()

html = html[:idx_start] + full_engine + "\n\n    " + html[idx_end:]

# Now update masterRenderLoop to include all new renderers
old_loop = """    function masterRenderLoop() {
      animGlobalPhase += 0.025;
      renderConductorStage();
      renderPianoAudioWave();
      renderPitchScope60fps();
      renderOctaveLadder60fps();
      renderIntervalRuler60fps();
      renderMetronome60fps();
      renderPolyrhythm60fps();
      renderOscScope60fps();
      renderHarmonicStrings60fps();
      renderChordGeometry60fps();
      renderProgressionRoute60fps();
      requestAnimationFrame(masterRenderLoop);
    }"""

new_loop = """    function masterRenderLoop() {
      animGlobalPhase += 0.025;
      artAnimTime += 0.025;
      renderConductorStage();
      renderPianoAudioWave();
      renderPitchScope60fps();
      renderOctaveLadder60fps();
      renderIntervalRuler60fps();
      renderMetronome60fps();
      renderPolyrhythm60fps();
      renderOscScope60fps();
      renderHarmonicStrings60fps();
      renderChordGeometry60fps();
      renderProgressionRoute60fps();
      // Section 9 Articulation & Expression 60fps Canvases
      renderStaccatoCanvas();
      renderLegatoCanvas();
      renderTenutoCanvas();
      renderAccentCanvas();
      renderGlissCanvas();
      renderVibratoTremoloCanvas();
      renderTrillCanvas();
      renderOrnamentCanvas();
      renderGraceCanvas();
      renderStringsCanvas();
      renderRubatoCanvas();
      requestAnimationFrame(masterRenderLoop);
    }"""

if old_loop in html:
    html = html.replace(old_loop, new_loop)
    print("masterRenderLoop updated successfully")
else:
    print("Warning: old_loop not found verbatim")

# Ensure initFloatingDock() is called at script end
init_call = "    initFloatingDock();\n    selectTimeSignature('4/4');"
html = html.replace("selectTimeSignature('4/4');", init_call)

with open("terminology.html", "w", encoding="utf-8") as f:
    f.write(html)

print("apply_full_engine.py completed successfully")
