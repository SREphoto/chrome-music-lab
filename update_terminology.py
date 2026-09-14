import re
import sys

with open("terminology.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update CSS: Add .card-active and improve dock styles
css_insertion = """
    /* Dynamic Active Visual Feedback for Cards & Buttons */
    .term-card.card-active {
      border-color: var(--accent-cyan) !important;
      box-shadow: 0 0 35px rgba(56, 189, 248, 0.45), 0 20px 45px -10px rgba(0, 0, 0, 0.8) !important;
      transform: translateY(-3px);
    }

    .exp-btn.playing {
      background: linear-gradient(135deg, #38bdf8, #0284c7) !important;
      color: #fff !important;
      border-color: #fff !important;
      box-shadow: 0 0 22px rgba(56, 189, 248, 0.65) !important;
    }
"""

if ".term-card.card-active" not in html:
    html = html.replace(".term-card:hover {", css_insertion + "\n    .term-card:hover {")

# Ensure minimized dock styling is smooth
dock_min_css = """.floating-keyboard-dock.minimized {
      width: auto !important;
      min-width: 270px;
      max-width: 90vw;
      padding: 0.5rem 1rem;
      border-radius: 999px;
      gap: 0;
    }

    .floating-keyboard-dock.minimized .dock-body {
      display: none !important;
    }

    .floating-keyboard-dock.minimized .dock-header {
      border-bottom: none;
      padding-bottom: 0;
      gap: 0.65rem;
    }"""

html = re.sub(
    r'\.floating-keyboard-dock\.minimized\s*\{[^}]*\}\s*\.floating-keyboard-dock\.minimized\s*\.dock-body\s*\{[^}]*\}',
    dock_min_css,
    html
)

# 2. Build complete Section 9 HTML with 11 cards
new_section_9_html = """    <!-- ============================================================
         SECTION 9: ARTICULATION & EXPRESSION (COMPLETE MASTER SUITE)
         ============================================================ -->
    <section class="category-section" id="articulation">
      <div class="category-header">
        <div class="category-icon" style="background: linear-gradient(135deg, #f43f5e, #be123c);">
          <svg style="width:26px;height:26px;fill:currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        </div>
        <div>
          <h2 class="category-title">Articulation & Expression Master Suite</h2>
          <p class="category-subtitle">The physical touch, nuance, phrasing, ornaments, and acoustic attacks that bring musical notes to life.</p>
        </div>
      </div>

      <div class="term-grid">
        <!-- 1. Staccato & Staccatissimo -->
        <div class="term-card" id="card_staccato">
          <div class="term-title-row">
            <h3 class="term-name">Staccato & Staccatissimo</h3>
            <span class="term-phonetic">Detached (•) & Spiky Wedge (▼)</span>
          </div>
          <p class="term-def">
            <strong>Staccato</strong> (Italian: <em>"detached"</em>, marked with a dot <strong>•</strong>) shortens the note to approximately 50% of its written duration, leaving crisp silent air between notes. <strong>Staccatissimo</strong> (vertical wedge <strong>▼</strong>) cuts duration to an ultra-crisp 25%, creating needle-sharp acoustic points.
          </p>
          <canvas id="staccatoCanvas" class="term-canvas" style="height:120px;"></canvas>
          <div class="canvas-caption">
            <span>Note Separation & Transient Profile</span>
            <span id="staccatoTag">Staccato (50%) vs Staccatissimo (25%)</span>
          </div>
          <div class="experiment-box">
            <span class="experiment-label">Detached Articulation Laboratory</span>
            <div class="exp-controls">
              <button class="exp-btn exp-btn-lg" onclick="playStaccatoDemo('staccato', this)">Staccato (50% Crisp)</button>
              <button class="exp-btn exp-btn-lg secondary" onclick="playStaccatoDemo('staccatissimo', this)">Staccatissimo (25% Spiky)</button>
              <button class="exp-btn exp-btn-lg secondary" onclick="playStaccatoDemo('normal', this)">Tenuto Reference (100%)</button>
            </div>
          </div>
        </div>

        <!-- 2. Legato & Slur -->
        <div class="term-card" id="card_legato">
          <div class="term-title-row">
            <h3 class="term-name">Legato & The Slur</h3>
            <span class="term-phonetic">Bound & Flowing (⌒ Slur)</span>
          </div>
          <p class="term-def">
            <strong>Legato</strong> (Italian: <em>"tied together"</em>, marked with a curved slur arc <strong>⌒</strong>) binds consecutive pitches in a seamless, unbroken melodic stream without silence or re-striking between pitches. Essential for vocal cantabile and lyrical string phrasing.
          </p>
          <canvas id="legatoCanvas" class="term-canvas" style="height:120px;"></canvas>
          <div class="canvas-caption">
            <span>Seamless Voice-Leading Ribbon</span>
            <span id="legatoTag">Continuous Overlapping Resonance</span>
          </div>
          <div class="experiment-box">
            <span class="experiment-label">Connected Phrasing Comparison</span>
            <div class="exp-controls">
              <button class="exp-btn exp-btn-lg" onclick="playLegatoDemo('legato', this)">Play Slurred Legato Phrase</button>
              <button class="exp-btn exp-btn-lg secondary" onclick="playLegatoDemo('detached', this)">Play Detached Non-Legato</button>
            </div>
          </div>
        </div>

        <!-- 3. Tenuto & Portato (Mezzo-Staccato) -->
        <div class="term-card" id="card_tenuto">
          <div class="term-title-row">
            <h3 class="term-name">Tenuto & Portato</h3>
            <span class="term-phonetic">Held Value (–) & Pulsing (._.)</span>
          </div>
          <p class="term-def">
            <strong>Tenuto</strong> (horizontal dash <strong>–</strong>) commands the performer to hold the note for its absolute full metric duration with gentle acoustic weight. <strong>Portato</strong> (dots under a slur <strong>._.</strong>, mezzo-staccato) produces a warm, pulsating phrase where notes are gently re-articulated without harshness.
          </p>
          <canvas id="tenutoCanvas" class="term-canvas" style="height:120px;"></canvas>
          <div class="canvas-caption">
            <span>Duration Weight & Pulsation Envelope</span>
            <span id="tenutoTag">Weighted Sustained Block vs Pulsing Breath</span>
          </div>
          <div class="experiment-box">
            <span class="experiment-label">Duration & Weight Comparison</span>
            <div class="exp-controls">
              <button class="exp-btn exp-btn-lg" onclick="playTenutoDemo('tenuto', this)">Tenuto (Weighted Full Duration)</button>
              <button class="exp-btn exp-btn-lg secondary" onclick="playTenutoDemo('portato', this)">Portato / Mezzo-Staccato (Pulsing)</button>
            </div>
          </div>
        </div>

        <!-- 4. Accents, Marcato & Sforzando -->
        <div class="term-card" id="card_accent">
          <div class="term-title-row">
            <h3 class="term-name">Accents, Marcato & Sforzando</h3>
            <span class="term-phonetic">Dynamic Attack (> , ^ , sfz)</span>
          </div>
          <p class="term-def">
            <strong>Standard Accent (>)</strong> adds sharp velocity to the attack before falling to ambient volume. <strong>Marcato (^)</strong> (vertical wedge roof) strikes with maximum force and an immediate staccato cut. <strong>Sforzando (sfz)</strong> delivers a sudden explosive shockwave, often dropping instantly to piano (sfp).
          </p>
          <canvas id="accentCanvas" class="term-canvas" style="height:120px;"></canvas>
          <div class="canvas-caption">
            <span>Attack Velocity & Shockwave Impact</span>
            <span id="accentTag">Explosive Attack Peak & Dynamic Recovery</span>
          </div>
          <div class="experiment-box">
            <span class="experiment-label">Attack Force Comparison</span>
            <div class="exp-controls">
              <button class="exp-btn" onclick="playAccentDemo('normal', this)">Normal Attack</button>
              <button class="exp-btn" onclick="playAccentDemo('accent', this)">Accent (>) Attack Punch</button>
              <button class="exp-btn secondary" onclick="playAccentDemo('marcato', this)">Marcato (^) Hammer Strike</button>
              <button class="exp-btn secondary" onclick="playAccentDemo('sforzando', this)">Sforzando (sfz &rarr; p)</button>
            </div>
          </div>
        </div>

        <!-- 5. Glissando & Portamento -->
        <div class="term-card" id="card_gliss">
          <div class="term-title-row">
            <h3 class="term-name">Glissando & Portamento</h3>
            <span class="term-phonetic">Pitch Slide (gliss.) & Vocal Scoop</span>
          </div>
          <p class="term-def">
            <strong>Glissando</strong> is a continuous unbroken sweep across all intervening frequencies (trombone slide, harp strum, synth glide). <strong>Portamento</strong> is an expressive, delicate micro-scoop connecting two lyrical notes in expressive vocal and violin cantabile.
          </p>
          <canvas id="glissCanvas" class="term-canvas" style="height:120px;"></canvas>
          <div class="canvas-caption">
            <span>Continuous Frequency Trajectory Beam</span>
            <span id="glissTag">Octave Slide vs Lyrical Vocal Portamento</span>
          </div>
          <div class="experiment-box">
            <span class="experiment-label">Continuous Pitch Modulation</span>
            <div class="exp-controls">
              <button class="exp-btn" onclick="playGlissDemo('glissando', this)">Glissando Slide (C4 &rarr; C5)</button>
              <button class="exp-btn secondary" onclick="playGlissDemo('portamento', this)">Lyrical Portamento Scoop (G4 &rarr; E5)</button>
              <button class="exp-btn secondary" onclick="playGlissDemo('fall', this)">Jazz Brass Fall-Off</button>
            </div>
          </div>
        </div>

        <!-- 6. Vibrato & Tremolo -->
        <div class="term-card" id="card_vibrato">
          <div class="term-title-row">
            <h3 class="term-name">Vibrato vs. Tremolo</h3>
            <span class="term-phonetic">Pitch LFO (FM) vs Amplitude (AM)</span>
          </div>
          <p class="term-def">
            <strong>Vibrato</strong> modulates <em>pitch</em> (frequency modulation via LFO at ~5.5 Hz) adding warmth and expressiveness. <strong>Tremolo</strong> modulates <em>volume</em> (amplitude modulation) or rapidly reiterates a single note (bowed violin tremolo or mandolin picking) at 12–16 Hz.
          </p>
          <canvas id="vibratoTremoloCanvas" class="term-canvas" style="height:120px;"></canvas>
          <div class="canvas-caption">
            <span>Frequency Wobble (FM) vs Amplitude Pulse (AM)</span>
            <span id="vibratoTag">Pitch LFO vs Volume Tremolo</span>
          </div>
          <div class="experiment-box">
            <span class="experiment-label">Acoustic Modulation Engines</span>
            <div class="exp-controls">
              <button class="exp-btn" onclick="playVibratoTremoloDemo('vibrato', this)">Singing Vibrato (5.5 Hz Pitch Wobble)</button>
              <button class="exp-btn secondary" onclick="playVibratoTremoloDemo('amp_tremolo', this)">Volume Tremolo (8 Hz Amplitude Pulse)</button>
              <button class="exp-btn secondary" onclick="playVibratoTremoloDemo('string_tremolo', this)">Bowed String Tremolo (Rapid 32nds)</button>
            </div>
          </div>
        </div>

        <!-- 7. Ornaments: Trill (Trillo) -->
        <div class="term-card" id="card_trill">
          <div class="term-title-row">
            <h3 class="term-name">The Trill (Trillo)</h3>
            <span class="term-phonetic">Rapid Alternation (tr ~~~)</span>
          </div>
          <p class="term-def">
            A <strong>Trill (tr)</strong> is a virtuoso rapid alternation between a principal note and the diatonic scale step above it (whole step or half step), creating vibrant acoustic shimmer and building dramatic tension before a cadence resolution.
          </p>
          <canvas id="trillCanvas" class="term-canvas" style="height:120px;"></canvas>
          <div class="canvas-caption">
            <span>High-Speed Alternation Waveform</span>
            <span id="trillTag">10 Hz Rapid Alternating Wave</span>
          </div>
          <div class="experiment-box">
            <span class="experiment-label">Ornamented Shimmer Player</span>
            <div class="exp-controls">
              <button class="exp-btn" onclick="playTrillDemo('whole', this)">Whole-Step Trill (C4 &harr; D4)</button>
              <button class="exp-btn secondary" onclick="playTrillDemo('half', this)">Half-Step Semitone Trill (C4 &harr; C♯4)</button>
              <button class="exp-btn secondary" onclick="playTrillDemo('cadential', this)">Accelerando Trill with Resolution</button>
            </div>
          </div>
        </div>

        <!-- 8. Ornaments: Mordent & Turn (Gruppetto) -->
        <div class="term-card" id="card_ornaments">
          <div class="term-title-row">
            <h3 class="term-name">Mordent & Turn (Gruppetto)</h3>
            <span class="term-phonetic">Single Bite & 4-Note Circle (𝄲 , 𝄳 , ~)</span>
          </div>
          <p class="term-def">
            An <strong>Upper Mordent (𝄲)</strong> bites rapidly to the upper neighbor and back. A <strong>Lower Mordent (𝄳)</strong> dips to the lower neighbor. A <strong>Turn (~, Gruppetto)</strong> executes an elegant 4-note circular rotation: upper neighbor &rarr; principal &rarr; lower neighbor &rarr; principal.
          </p>
          <canvas id="ornamentCanvas" class="term-canvas" style="height:120px;"></canvas>
          <div class="canvas-caption">
            <span>Rotational Ornament Orbit Path</span>
            <span id="ornamentTag">Circular Orbit & Fast Bite Trajectory</span>
          </div>
          <div class="experiment-box">
            <span class="experiment-label">Classical Flourish Generator</span>
            <div class="exp-controls">
              <button class="exp-btn" onclick="playMordentTurnDemo('upper', this)">Upper Mordent (C &rarr; D &rarr; C)</button>
              <button class="exp-btn secondary" onclick="playMordentTurnDemo('lower', this)">Lower Inverted Mordent (C &rarr; B &rarr; C)</button>
              <button class="exp-btn secondary" onclick="playMordentTurnDemo('turn', this)">Turn / Gruppetto (D &rarr; C &rarr; B &rarr; C)</button>
            </div>
          </div>
        </div>

        <!-- 9. Grace Notes: Appoggiatura & Acciaccatura -->
        <div class="term-card" id="card_grace">
          <div class="term-title-row">
            <h3 class="term-name">Appoggiatura & Acciaccatura</h3>
            <span class="term-phonetic">Leaning Note (♪) vs Crushed Note (♪\\)</span>
          </div>
          <p class="term-def">
            An <strong>Acciaccatura</strong> (slashed stem <strong>♪\\</strong>) is an ultra-fast "crushed note" played in ~25ms immediately on or before the beat without metric duration. An <strong>Appoggiatura</strong> (unslashed <strong>♪</strong>) is an expressive "leaning note" taking 50% of the main note's time, creating a rich dissonance that resolves smoothly down.
          </p>
          <canvas id="graceNoteCanvas" class="term-canvas" style="height:120px;"></canvas>
          <div class="canvas-caption">
            <span>Leaning Gravitational Suspension</span>
            <span id="graceTag">Lightning Spark vs Emotional Dissonance Resolution</span>
          </div>
          <div class="experiment-box">
            <span class="experiment-label">Grace Note Demonstration</span>
            <div class="exp-controls">
              <button class="exp-btn" onclick="playGraceDemo('acciaccatura', this)">Acciaccatura (Crushed Micro-Note)</button>
              <button class="exp-btn secondary" onclick="playGraceDemo('appoggiatura', this)">Appoggiatura (Leaning Suspension)</button>
            </div>
          </div>
        </div>

        <!-- 10. String Articulations: Pizzicato vs. Arco & Con Sordino -->
        <div class="term-card" id="card_strings">
          <div class="term-title-row">
            <h3 class="term-name">Pizzicato, Arco & Con Sordino</h3>
            <span class="term-phonetic">Plucked (pizz.), Bowed & Muted</span>
          </div>
          <p class="term-def">
            <strong>Pizzicato (pizz.)</strong> plucks the string with fingertips for an acoustic transient snap. <strong>Arco</strong> uses continuous horsehair bow friction to sustain lush overtones. <strong>Con Sordino</strong> fits a rubber/wood mute onto the bridge to dampen upper harmonics into a velvety veiled glow.
          </p>
          <canvas id="stringsCanvas" class="term-canvas" style="height:120px;"></canvas>
          <div class="canvas-caption">
            <span>Acoustic Harmonic Spectrum Envelope</span>
            <span id="stringsTag">Plucked Snap vs Bowed Body vs Veiled Mute</span>
          </div>
          <div class="experiment-box">
            <span class="experiment-label">String Expression Comparison</span>
            <div class="exp-controls">
              <button class="exp-btn" onclick="playStringsDemo('pizzicato', this)">Pizzicato (Plucked Pop)</button>
              <button class="exp-btn secondary" onclick="playStringsDemo('arco', this)">Arco (Bowed Sustained Swell)</button>
              <button class="exp-btn secondary" onclick="playStringsDemo('sordino', this)">Con Sordino (Veiled Warm Mute)</button>
            </div>
          </div>
        </div>

        <!-- 11. Fermata & Tempo Rubato -->
        <div class="term-card" id="card_rubato">
          <div class="term-title-row">
            <h3 class="term-name">Fermata & Tempo Rubato</h3>
            <span class="term-phonetic">Grand Pause (𝄐) & Elastic Time</span>
          </div>
          <p class="term-def">
            <strong>Fermata (𝄐)</strong> (the "bird's eye") instructs the conductor or soloist to prolong a note or rest indefinitely beyond its written value. <strong>Tempo Rubato</strong> (Italian for "stolen time") is expressive rhythmic elasticity where notes borrow and pay back tempo, speeding up and lingering with human breath.
          </p>
          <canvas id="rubatoCanvas" class="term-canvas" style="height:120px;"></canvas>
          <div class="canvas-caption">
            <span>Elastic Breathing Time Grid</span>
            <span id="rubatoTag">Suspended Hold & Romantic Push-Pull</span>
          </div>
          <div class="experiment-box">
            <span class="experiment-label">Metric Elasticity Laboratory</span>
            <div class="exp-controls">
              <button class="exp-btn" onclick="playRubatoDemo('fermata', this)">Phrase with Dramatic Fermata Pause</button>
              <button class="exp-btn secondary" onclick="playRubatoDemo('rubato', this)">Phrase with Romantic Rubato Wave</button>
              <button class="exp-btn secondary" onclick="playRubatoDemo('strict', this)">Strict Metronomic Baseline</button>
            </div>
          </div>
        </div>

      </div>
    </section>"""

# Replace existing Section 9 in HTML
sec9_pattern = r'<!-- ============================================================\s*SECTION 9: ARTICULATION & EXPRESSION.*?<\/section>'
html = re.sub(sec9_pattern, new_section_9_html, html, flags=re.DOTALL)

# 3. Position the Floating Dock HTML properly BEFORE <script>
dock_html = """  <!-- Floating Draggable Light-Up Playable Piano Keyboard Dock -->
  <div class="floating-keyboard-dock" id="floatingKeyboardDock">
    <div class="dock-header" id="dockDragHeader">
      <div class="dock-drag-handle">
        <svg class="dock-drag-icon" viewBox="0 0 24 24"><path d="M10 9h4V5h-4v4zm0 6h4v-4h-4v4zm0 6h4v-4h-4v4zM4 9h4V5H4v4zm0 6h4v-4H4v4zm0 6h4v-4H4v4zm12-12v4h4V5h-4zm0 10h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>
        <span>Light-Up Playable Piano</span>
        <span class="dock-chord-badge" id="dockChordDisplay">C Major</span>
      </div>
      <div class="dock-controls">
        <button class="dock-btn" onclick="shiftDockOctave(-1)" title="Lower Octave">&minus; Oct</button>
        <span id="dockOctaveLabel" style="font-size:0.8rem; font-weight:800; color:var(--accent-cyan);">C4&ndash;B5</span>
        <button class="dock-btn" onclick="shiftDockOctave(1)" title="Raise Octave">+ Oct</button>
        <button class="dock-btn active" onclick="toggleDockSound(this)" id="dockSoundToggleBtn" title="Toggle Sound">Sound ON</button>
        <button class="dock-btn" onclick="toggleDockMinimize()" id="dockMinBtn" title="Minimize / Expand Dock">&minus;</button>
      </div>
    </div>
    <div class="dock-body" id="dockBody">
      <div class="dock-piano-wrap" id="dockPianoWrap">
        <!-- Octave 1 White Keys -->
        <div class="dock-white-key" data-note="C4" data-semitone="0">C4</div>
        <div class="dock-white-key" data-note="D4" data-semitone="2">D</div>
        <div class="dock-white-key" data-note="E4" data-semitone="4">E</div>
        <div class="dock-white-key" data-note="F4" data-semitone="5">F</div>
        <div class="dock-white-key" data-note="G4" data-semitone="7">G</div>
        <div class="dock-white-key" data-note="A4" data-semitone="9">A</div>
        <div class="dock-white-key" data-note="B4" data-semitone="11">B</div>

        <!-- Octave 2 White Keys -->
        <div class="dock-white-key" data-note="C5" data-semitone="12">C5</div>
        <div class="dock-white-key" data-note="D5" data-semitone="14">D</div>
        <div class="dock-white-key" data-note="E5" data-semitone="16">E</div>
        <div class="dock-white-key" data-note="F5" data-semitone="17">F</div>
        <div class="dock-white-key" data-note="G5" data-semitone="19">G</div>
        <div class="dock-white-key" data-note="A5" data-semitone="21">A</div>
        <div class="dock-white-key" data-note="B5" data-semitone="23">B</div>

        <!-- Octave 1 Black Keys -->
        <div class="dock-black-key" style="left: 5.1%;" data-note="C#4" data-semitone="1"></div>
        <div class="dock-black-key" style="left: 12.2%;" data-note="D#4" data-semitone="3"></div>
        <div class="dock-black-key" style="left: 26.5%;" data-note="F#4" data-semitone="6"></div>
        <div class="dock-black-key" style="left: 33.6%;" data-note="G#4" data-semitone="8"></div>
        <div class="dock-black-key" style="left: 40.7%;" data-note="A#4" data-semitone="10"></div>

        <!-- Octave 2 Black Keys -->
        <div class="dock-black-key" style="left: 55.1%;" data-note="C#5" data-semitone="13"></div>
        <div class="dock-black-key" style="left: 62.2%;" data-note="D#5" data-semitone="15"></div>
        <div class="dock-black-key" style="left: 76.5%;" data-note="F#5" data-semitone="18"></div>
        <div class="dock-black-key" style="left: 83.6%;" data-note="G#5" data-semitone="20"></div>
        <div class="dock-black-key" style="left: 90.7%;" data-note="A#5" data-semitone="22"></div>
      </div>
    </div>
  </div>"""

# Remove dock from after script if present
html = re.sub(
    r'\s*<!-- Floating Draggable Light-Up Playable Piano Keyboard Dock -->\s*<div class="floating-keyboard-dock"[^>]*>.*?<\/div>\s*<\/div>\s*',
    '\n',
    html,
    flags=re.DOTALL
)

# Insert dock right after </footer> and before <script>
footer_idx = html.find('</footer>')
if footer_idx != -1:
    after_footer = footer_idx + len('</footer>')
    html = html[:after_footer] + "\n\n" + dock_html + "\n" + html[after_footer:]

with open("terminology.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Stage 1 complete: HTML & CSS updated")
