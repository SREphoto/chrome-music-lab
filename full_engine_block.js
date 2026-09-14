    // ============================================================
    // SECTION 9: COMPLETE ARTICULATION & EXPRESSION ENGINE
    // ============================================================
    let artAnimTime = 0;

    // 1. Staccato & Staccatissimo
    const staccatoCanvas = document.getElementById('staccatoCanvas');
    const stCtx = staccatoCanvas ? staccatoCanvas.getContext('2d') : null;
    let staccatoActiveStyle = 'staccato';
    let staccatoStrikePhase = 0;

    function renderStaccatoCanvas() {
      if (!stCtx || !staccatoCanvas) return;
      stCtx.clearRect(0, 0, staccatoCanvas.width, staccatoCanvas.height);
      const w = staccatoCanvas.width;
      const h = staccatoCanvas.height;
      const isStaccatissimo = (staccatoActiveStyle === 'staccatissimo');
      const isNormal = (staccatoActiveStyle === 'normal');

      stCtx.strokeStyle = isStaccatissimo ? '#f43f5e' : (isNormal ? '#38bdf8' : '#f59e0b');
      stCtx.lineWidth = 3;

      const numNotes = 5;
      const step = (w - 60) / numNotes;
      for (let i = 0; i < numNotes; i++) {
        const xStart = 30 + i * step;
        const pulseWidth = isNormal ? (step * 0.85) : (isStaccatissimo ? (step * 0.2) : (step * 0.45));
        const pulseHeight = h * 0.55 + Math.sin(artAnimTime * 4 + i) * 6;

        stCtx.fillStyle = isStaccatissimo ? 'rgba(244, 63, 94, 0.25)' : (isNormal ? 'rgba(56, 189, 248, 0.22)' : 'rgba(245, 158, 11, 0.22)');
        stCtx.fillRect(xStart, h * 0.85 - pulseHeight, pulseWidth, pulseHeight);
        stCtx.strokeRect(xStart, h * 0.85 - pulseHeight, pulseWidth, pulseHeight);

        // Notation mark
        stCtx.fillStyle = '#fff';
        stCtx.font = 'bold 12px Outfit';
        stCtx.textAlign = 'center';
        if (isStaccatissimo) {
          stCtx.fillText('▼', xStart + pulseWidth / 2, h * 0.85 - pulseHeight - 8);
        } else if (!isNormal) {
          stCtx.fillText('•', xStart + pulseWidth / 2, h * 0.85 - pulseHeight - 8);
        } else {
          stCtx.fillText('–', xStart + pulseWidth / 2, h * 0.85 - pulseHeight - 8);
        }
      }
    }

    window.playStaccatoDemo = function(style, btn) {
      const ctx = getCtx();
      if (!ctx) return;
      pulseCardFeedback(btn, 2200);
      staccatoActiveStyle = style;
      const tag = document.getElementById('staccatoTag');
      if (tag) tag.textContent = style === 'staccatissimo' ? 'Ultra-Crisp Spiky Pulses (25% Duration)' : (style === 'staccato' ? 'Detached Pulses (50% Duration)' : 'Full Length Tenuto Reference (100%)');

      const notes = [261.63, 293.66, 329.63, 349.23, 392.00]; // C D E F G
      const stepDuration = 0.38;
      const noteDuration = style === 'staccatissimo' ? 0.08 : (style === 'staccato' ? 0.18 : 0.36);

      notes.forEach((f, idx) => {
        const time = ctx.currentTime + idx * stepDuration;
        playPianoTone(f, time, noteDuration, style === 'staccatissimo' ? 0.38 : 0.32);
        setTimeout(() => {
          highlightKey(getNoteFromFreq(f), Math.round(noteDuration * 1000));
        }, idx * stepDuration * 1000);
      });
    };

    // 2. Legato & Slur
    const legatoCanvas = document.getElementById('legatoCanvas');
    const lgCtx = legatoCanvas ? legatoCanvas.getContext('2d') : null;
    let legatoActiveStyle = 'legato';

    function renderLegatoCanvas() {
      if (!lgCtx || !legatoCanvas) return;
      lgCtx.clearRect(0, 0, legatoCanvas.width, legatoCanvas.height);
      const w = legatoCanvas.width;
      const h = legatoCanvas.height;

      lgCtx.beginPath();
      lgCtx.lineWidth = 3.5;
      lgCtx.strokeStyle = legatoActiveStyle === 'legato' ? '#10b981' : '#f59e0b';

      if (legatoActiveStyle === 'legato') {
        // Continuous flowing liquid ribbon
        for (let x = 20; x < w - 20; x++) {
          const y = h / 2 + Math.sin((x / 55) + artAnimTime * 2.5) * (h * 0.28);
          if (x === 20) lgCtx.moveTo(x, y);
          else lgCtx.lineTo(x, y);
        }
        lgCtx.stroke();
      } else {
        // Detached chunks
        for (let i = 0; i < 5; i++) {
          const x1 = 30 + i * ((w - 60) / 5);
          const x2 = x1 + ((w - 60) / 5) * 0.6;
          lgCtx.beginPath();
          lgCtx.moveTo(x1, h / 2 + Math.sin(i + artAnimTime * 2) * 15);
          lgCtx.lineTo(x2, h / 2 + Math.sin(i + artAnimTime * 2) * 15);
          lgCtx.stroke();
        }
      }
    }

    window.playLegatoDemo = function(style, btn) {
      const ctx = getCtx();
      if (!ctx) return;
      pulseCardFeedback(btn, 2400);
      legatoActiveStyle = style;
      const tag = document.getElementById('legatoTag');
      if (tag) tag.textContent = style === 'legato' ? 'Slurred Overlapping Voice-Leading (Continuous Ribbon)' : 'Detached Re-articulated Phrases';

      const notes = [261.63, 329.63, 392.00, 440.00, 523.25]; // C E G A C
      const stepDuration = 0.42;
      const noteDuration = style === 'legato' ? 0.55 : 0.22; // Overlap for legato

      notes.forEach((f, idx) => {
        const time = ctx.currentTime + idx * stepDuration;
        playPianoTone(f, time, noteDuration, 0.32);
        setTimeout(() => {
          highlightKey(getNoteFromFreq(f), Math.round(noteDuration * 1000));
        }, idx * stepDuration * 1000);
      });
    };

    // 3. Tenuto & Portato
    const tenutoCanvas = document.getElementById('tenutoCanvas');
    const tnCtx = tenutoCanvas ? tenutoCanvas.getContext('2d') : null;
    let tenutoActiveStyle = 'tenuto';

    function renderTenutoCanvas() {
      if (!tnCtx || !tenutoCanvas) return;
      tnCtx.clearRect(0, 0, tenutoCanvas.width, tenutoCanvas.height);
      const w = tenutoCanvas.width;
      const h = tenutoCanvas.height;

      const numBars = 4;
      const step = (w - 60) / numBars;
      for (let i = 0; i < numBars; i++) {
        const x = 30 + i * step;
        const barW = tenutoActiveStyle === 'tenuto' ? (step * 0.94) : (step * 0.72);
        const barH = h * 0.48;
        tnCtx.fillStyle = tenutoActiveStyle === 'tenuto' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(168, 85, 247, 0.25)';
        tnCtx.fillRect(x, (h - barH) / 2, barW, barH);
        tnCtx.strokeStyle = tenutoActiveStyle === 'tenuto' ? '#38bdf8' : '#c084fc';
        tnCtx.lineWidth = 2.5;
        tnCtx.strokeRect(x, (h - barH) / 2, barW, barH);

        // Tenuto / Portato mark
        tnCtx.fillStyle = '#fff';
        tnCtx.font = 'bold 13px Outfit';
        tnCtx.textAlign = 'center';
        tnCtx.fillText(tenutoActiveStyle === 'tenuto' ? '–' : '._.', x + barW / 2, (h - barH) / 2 - 8);
      }
    }

    window.playTenutoDemo = function(style, btn) {
      const ctx = getCtx();
      if (!ctx) return;
      pulseCardFeedback(btn, 2400);
      tenutoActiveStyle = style;
      const tag = document.getElementById('tenutoTag');
      if (tag) tag.textContent = style === 'tenuto' ? 'Tenuto (–): Full Weighted Duration with Broad Resonance' : 'Portato (._.): Pulsing Mezzo-Staccato with Gentle Breath';

      const notes = [261.63, 329.63, 392.00, 523.25];
      const stepDuration = 0.52;
      const noteDuration = style === 'tenuto' ? 0.50 : 0.35;

      notes.forEach((f, idx) => {
        const time = ctx.currentTime + idx * stepDuration;
        playPianoTone(f, time, noteDuration, style === 'tenuto' ? 0.36 : 0.28);
        setTimeout(() => {
          highlightKey(getNoteFromFreq(f), Math.round(noteDuration * 1000));
        }, idx * stepDuration * 1000);
      });
    };

    // 4. Accents, Marcato & Sforzando
    const accentCanvas = document.getElementById('accentCanvas');
    const acCtx = accentCanvas ? accentCanvas.getContext('2d') : null;
    let accentActiveStyle = 'accent';
    let accentShockwave = 0;

    function renderAccentCanvas() {
      if (!acCtx || !accentCanvas) return;
      acCtx.clearRect(0, 0, accentCanvas.width, accentCanvas.height);
      const w = accentCanvas.width;
      const h = accentCanvas.height;

      // Shockwave circle
      if (accentShockwave > 0) {
        acCtx.beginPath();
        acCtx.arc(w / 2, h / 2, accentShockwave * (w * 0.4), 0, Math.PI * 2);
        acCtx.strokeStyle = `rgba(244, 63, 94, ${1 - accentShockwave})`;
        acCtx.lineWidth = 4;
        acCtx.stroke();
        accentShockwave += 0.035;
        if (accentShockwave > 1) accentShockwave = 0;
      }

      // Attack Envelope Profile
      acCtx.beginPath();
      acCtx.moveTo(40, h * 0.85);
      if (accentActiveStyle === 'sforzando') {
        acCtx.lineTo(60, h * 0.1); // Explosive peak
        acCtx.lineTo(90, h * 0.7); // Sudden drop to p
        acCtx.lineTo(w - 40, h * 0.85);
      } else if (accentActiveStyle === 'marcato') {
        acCtx.lineTo(60, h * 0.15); // Spike
        acCtx.lineTo(120, h * 0.85); // Immediate staccato cut
        acCtx.lineTo(w - 40, h * 0.85);
      } else if (accentActiveStyle === 'accent') {
        acCtx.lineTo(60, h * 0.22); // Accent peak
        acCtx.lineTo(w - 40, h * 0.85);
      } else {
        acCtx.lineTo(100, h * 0.45); // Normal
        acCtx.lineTo(w - 40, h * 0.85);
      }
      acCtx.strokeStyle = '#f43f5e';
      acCtx.lineWidth = 3;
      acCtx.stroke();
    }

    window.playAccentDemo = function(type, btn) {
      const ctx = getCtx();
      if (!ctx) return;
      pulseCardFeedback(btn, 1800);
      accentActiveStyle = type;
      accentShockwave = 0.05;
      const tag = document.getElementById('accentTag');
      if (tag) tag.textContent = type === 'sforzando' ? 'Sforzando (sfz -> p): Sudden Explosive Crash Dropping to Whisper' : (type === 'marcato' ? 'Marcato (^): Hammered Heavy Attack with Staccato Cut' : (type === 'accent' ? 'Accent (>): Attack Velocity Punch' : 'Normal Unaccented Reference'));

      const now = ctx.currentTime;
      const f = 261.63; // C4
      highlightKey('C4', 1200, 'lit-pink');

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now);

      if (type === 'sforzando') {
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.55, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.06, now + 0.14);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);
      } else if (type === 'marcato') {
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.48, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      } else if (type === 'accent') {
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.42, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
      } else {
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.22, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
      }

      osc.connect(gain);
      gain.connect(masterCompressor || ctx.destination);
      osc.start(now);
      osc.stop(now + 1.5);
      triggerAudioActivity(f);
    };

    // 5. Glissando & Portamento
    const glissCanvas = document.getElementById('glissCanvas');
    const glCtx = glissCanvas ? glissCanvas.getContext('2d') : null;
    let glissActiveType = 'glissando';

    function renderGlissCanvas() {
      if (!glCtx || !glissCanvas) return;
      glCtx.clearRect(0, 0, glissCanvas.width, glissCanvas.height);
      const w = glissCanvas.width;
      const h = glissCanvas.height;

      glCtx.beginPath();
      glCtx.strokeStyle = '#38bdf8';
      glCtx.lineWidth = 3;

      if (glissActiveType === 'fall') {
        glCtx.moveTo(40, h * 0.25);
        glCtx.quadraticCurveTo(w * 0.5, h * 0.3, w - 40, h * 0.88);
      } else if (glissActiveType === 'portamento') {
        glCtx.moveTo(40, h * 0.75);
        glCtx.bezierCurveTo(w * 0.4, h * 0.75, w * 0.6, h * 0.25, w - 40, h * 0.25);
      } else {
        glCtx.moveTo(40, h * 0.8);
        glCtx.lineTo(w - 40, h * 0.2);
      }
      glCtx.stroke();

      // Moving laser bead
      const beadX = 40 + (w - 80) * (Math.sin(artAnimTime * 2) * 0.5 + 0.5);
      const beadY = h * 0.5 + Math.cos(artAnimTime * 2) * (h * 0.25);
      glCtx.beginPath();
      glCtx.arc(beadX, beadY, 6, 0, Math.PI * 2);
      glCtx.fillStyle = '#38bdf8';
      glCtx.fill();
      glCtx.strokeStyle = '#fff';
      glCtx.lineWidth = 2;
      glCtx.stroke();
    }

    window.playGlissDemo = function(type, btn) {
      const ctx = getCtx();
      if (!ctx) return;
      pulseCardFeedback(btn, 1800);
      glissActiveType = type;
      const tag = document.getElementById('glissTag');
      if (tag) tag.textContent = type === 'glissando' ? 'Glissando: Continuous Frequency Slide (C4 -> C5)' : (type === 'portamento' ? 'Portamento: Lyrical Vocal Scoop (G4 ~> E5)' : 'Jazz Brass Fall-Off: Rapid Pitch Drop');

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';

      if (type === 'glissando') {
        osc.frequency.setValueAtTime(261.63, now); // C4
        osc.frequency.exponentialRampToValueAtTime(523.25, now + 1.2); // C5
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
        highlightKey('C4', 600);
        setTimeout(() => highlightKey('C5', 800), 1000);
      } else if (type === 'portamento') {
        osc.frequency.setValueAtTime(392.00, now); // G4
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.9); // E5
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.3);
        highlightKey('G4', 500);
        setTimeout(() => highlightKey('E5', 700), 700);
      } else {
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(130.81, now + 0.6);
        gain.gain.setValueAtTime(0.38, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
        highlightKey('C5', 400);
      }

      osc.connect(gain);
      gain.connect(masterCompressor || ctx.destination);
      osc.start(now);
      osc.stop(now + 1.6);
      triggerAudioActivity(392);
    };

    // 6. Vibrato vs Tremolo
    const vtCanvas = document.getElementById('vibratoTremoloCanvas');
    const vtCtx = vtCanvas ? vtCanvas.getContext('2d') : null;
    let vtActiveType = 'vibrato';

    function renderVibratoTremoloCanvas() {
      if (!vtCtx || !vtCanvas) return;
      vtCtx.clearRect(0, 0, vtCanvas.width, vtCanvas.height);
      const w = vtCanvas.width;
      const h = vtCanvas.height;

      vtCtx.beginPath();
      vtCtx.lineWidth = 2.5;

      if (vtActiveType === 'vibrato') {
        vtCtx.strokeStyle = '#ec4899';
        // Frequency modulation wobble
        for (let x = 30; x < w - 30; x++) {
          const lfo = Math.sin((x / 30) + artAnimTime * 5.5) * 8;
          const y = h / 2 + Math.sin((x / 14)) * (h * 0.28 + lfo);
          if (x === 30) vtCtx.moveTo(x, y);
          else vtCtx.lineTo(x, y);
        }
      } else {
        vtCtx.strokeStyle = '#34d399';
        // Amplitude envelope modulation beats
        for (let x = 30; x < w - 30; x++) {
          const mod = Math.abs(Math.sin((x / 40) + artAnimTime * 8));
          const y = h / 2 + Math.sin(x / 6) * (mod * (h * 0.38));
          if (x === 30) vtCtx.moveTo(x, y);
          else vtCtx.lineTo(x, y);
        }
      }
      vtCtx.stroke();
    }

    window.playVibratoTremoloDemo = function(type, btn) {
      const ctx = getCtx();
      if (!ctx) return;
      pulseCardFeedback(btn, 2200);
      vtActiveType = type;
      const tag = document.getElementById('vibratoTag');
      if (tag) tag.textContent = type === 'vibrato' ? 'Singing Vibrato (5.5 Hz Pitch Wobble LFO)' : (type === 'amp_tremolo' ? 'Volume Tremolo (8 Hz Amplitude Modulation LFO)' : 'Bowed String Tremolo (Rapid Re-striking at 14 Hz)');

      const now = ctx.currentTime;
      highlightKey('A4', 1800, 'lit-pink');

      if (type === 'vibrato') {
        const carrier = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const masterGain = ctx.createGain();

        carrier.frequency.setValueAtTime(440, now);
        lfo.frequency.setValueAtTime(5.5, now);
        lfoGain.gain.setValueAtTime(14, now); // 14 Hz pitch depth

        lfo.connect(lfoGain);
        lfoGain.connect(carrier.frequency);

        masterGain.gain.setValueAtTime(0.35, now);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

        carrier.connect(masterGain);
        masterGain.connect(masterCompressor || ctx.destination);

        lfo.start(now);
        carrier.start(now);
        lfo.stop(now + 2.0);
        carrier.stop(now + 2.0);
      } else if (type === 'amp_tremolo') {
        const carrier = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        const vGain = ctx.createGain();

        carrier.frequency.setValueAtTime(440, now);
        lfo.frequency.setValueAtTime(8, now); // 8 Hz volume flutter
        lfoGain.gain.setValueAtTime(0.3, now);

        vGain.gain.setValueAtTime(0.25, now);
        lfo.connect(vGain.gain);

        carrier.connect(vGain);
        vGain.connect(masterCompressor || ctx.destination);

        lfo.start(now);
        carrier.start(now);
        setTimeout(() => {
          try { carrier.stop(); lfo.stop(); } catch(e) {}
        }, 2000);
      } else {
        // String tremolo: rapid re-striking 32nd notes
        for (let i = 0; i < 14; i++) {
          const t = now + i * 0.09;
          playPianoTone(440, t, 0.08, 0.28);
        }
      }
      triggerAudioActivity(440);
    };

    // 7. Ornaments: Trill
    const trillCanvas = document.getElementById('trillCanvas');
    const trCtx = trillCanvas ? trillCanvas.getContext('2d') : null;

    function renderTrillCanvas() {
      if (!trCtx || !trillCanvas) return;
      trCtx.clearRect(0, 0, trillCanvas.width, trillCanvas.height);
      const w = trillCanvas.width;
      const h = trillCanvas.height;

      trCtx.beginPath();
      trCtx.strokeStyle = '#f59e0b';
      trCtx.lineWidth = 3;

      for (let x = 30; x < w - 30; x++) {
        const alt = (Math.sin(x * 0.25 + artAnimTime * 12) > 0) ? (h * 0.3) : (h * 0.7);
        if (x === 30) trCtx.moveTo(x, alt);
        else trCtx.lineTo(x, alt);
      }
      trCtx.stroke();
    }

    window.playTrillDemo = function(type, btn) {
      const ctx = getCtx();
      if (!ctx) return;
      pulseCardFeedback(btn, 2200);
      const tag = document.getElementById('trillTag');
      if (tag) tag.textContent = type === 'whole' ? 'Whole-Step Trill: Rapid Alternation C4 <-> D4' : (type === 'half' ? 'Half-Step Trill: Semitone Alternation C4 <-> C#4' : 'Accelerando Cadential Trill with Turn Resolution');

      const now = ctx.currentTime;
      const rootF = 261.63; // C4
      const upperF = (type === 'half') ? 277.18 : 293.66; // C#4 or D4
      const reps = 14;

      for (let i = 0; i < reps; i++) {
        const f = (i % 2 === 0) ? rootF : upperF;
        const delay = (type === 'cadential') ? (0.16 - Math.min(0.09, i * 0.007)) : 0.09;
        const t = now + i * delay;
        playPianoTone(f, t, delay * 0.95, 0.26);
        setTimeout(() => {
          highlightKey(getNoteFromFreq(f), Math.round(delay * 900), (i % 2 === 0) ? 'lit-gold' : 'lit-cyan');
        }, i * delay * 1000);
      }
    };

    // 8. Ornaments: Mordent & Turn
    const ornCanvas = document.getElementById('ornamentCanvas');
    const orCtx = ornCanvas ? ornCanvas.getContext('2d') : null;
    let ornAngle = 0;

    function renderOrnamentCanvas() {
      if (!orCtx || !ornCanvas) return;
      orCtx.clearRect(0, 0, ornCanvas.width, ornCanvas.height);
      const w = ornCanvas.width;
      const h = ornCanvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const radius = 38;

      // Orbit ring
      orCtx.beginPath();
      orCtx.arc(cx, cy, radius, 0, Math.PI * 2);
      orCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      orCtx.lineWidth = 2;
      orCtx.stroke();

      // Orbiting bead
      ornAngle += 0.05;
      const bx = cx + Math.cos(ornAngle) * radius;
      const by = cy + Math.sin(ornAngle) * radius;
      orCtx.beginPath();
      orCtx.arc(bx, by, 7, 0, Math.PI * 2);
      orCtx.fillStyle = '#ec4899';
      orCtx.fill();
      orCtx.strokeStyle = '#fff';
      orCtx.lineWidth = 2;
      orCtx.stroke();

      // Central principal pitch
      orCtx.beginPath();
      orCtx.arc(cx, cy, 10, 0, Math.PI * 2);
      orCtx.fillStyle = '#38bdf8';
      orCtx.fill();
      orCtx.fillStyle = '#fff';
      orCtx.font = 'bold 10px Outfit';
      orCtx.textAlign = 'center';
      orCtx.fillText('C4', cx, cy + 3);
    }

    window.playMordentTurnDemo = function(type, btn) {
      const ctx = getCtx();
      if (!ctx) return;
      pulseCardFeedback(btn, 1800);
      const tag = document.getElementById('ornamentTag');
      if (tag) tag.textContent = type === 'upper' ? 'Upper Mordent: C4 -> D4 -> C4 (Quick Bite Up)' : (type === 'lower' ? 'Lower Mordent: C4 -> B3 -> C4 (Inverted Bite Down)' : 'Turn (Gruppetto): D4 -> C4 -> B3 -> C4 (4-Note Circular Flourish)');

      const now = ctx.currentTime;
      let seq = [];
      if (type === 'upper') {
        seq = [ { f: 261.63, d: 0.08 }, { f: 293.66, d: 0.08 }, { f: 261.63, d: 0.55 } ];
      } else if (type === 'lower') {
        seq = [ { f: 261.63, d: 0.08 }, { f: 246.94, d: 0.08 }, { f: 261.63, d: 0.55 } ];
      } else {
        // Turn: upper, principal, lower, principal
        seq = [ { f: 293.66, d: 0.08 }, { f: 261.63, d: 0.08 }, { f: 246.94, d: 0.08 }, { f: 261.63, d: 0.65 } ];
      }

      let accTime = 0;
      seq.forEach(item => {
        const t = now + accTime;
        playPianoTone(item.f, t, item.d * 1.2, 0.32);
        setTimeout(() => {
          highlightKey(getNoteFromFreq(item.f), Math.round(item.d * 1000));
        }, accTime * 1000);
        accTime += item.d;
      });
    };

    // 9. Grace Notes: Appoggiatura & Acciaccatura
    const graceCanvas = document.getElementById('graceNoteCanvas');
    const grCtx = graceCanvas ? graceCanvas.getContext('2d') : null;

    function renderGraceCanvas() {
      if (!grCtx || !graceCanvas) return;
      grCtx.clearRect(0, 0, graceCanvas.width, graceCanvas.height);
      const w = graceCanvas.width;
      const h = graceCanvas.height;

      // Pendulum balance
      const cx = w / 2;
      const topY = 15;
      const angle = Math.sin(artAnimTime * 3) * 0.45;
      const len = h * 0.6;
      const bobX = cx + Math.sin(angle) * len;
      const bobY = topY + Math.cos(angle) * len;

      grCtx.beginPath();
      grCtx.moveTo(cx, topY);
      grCtx.lineTo(bobX, bobY);
      grCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      grCtx.lineWidth = 2;
      grCtx.stroke();

      grCtx.beginPath();
      grCtx.arc(bobX, bobY, 12, 0, Math.PI * 2);
      grCtx.fillStyle = '#f59e0b';
      grCtx.fill();
      grCtx.strokeStyle = '#fff';
      grCtx.lineWidth = 2;
      grCtx.stroke();
    }

    window.playGraceDemo = function(type, btn) {
      const ctx = getCtx();
      if (!ctx) return;
      pulseCardFeedback(btn, 1800);
      const tag = document.getElementById('graceTag');
      if (tag) tag.textContent = type === 'acciaccatura' ? 'Acciaccatura: Crushed Grace Note (25ms Bite Before Beat)' : 'Appoggiatura: Leaning Dissonance Taking 50% of the Metric Beat';

      const now = ctx.currentTime;
      if (type === 'acciaccatura') {
        // Crushed 25ms grace note
        playPianoTone(293.66, now, 0.05, 0.28); // D4
        highlightKey('D4', 200, 'lit-pink');
        playPianoTone(261.63, now + 0.035, 0.8, 0.35); // C4
        setTimeout(() => highlightKey('C4', 800, 'lit-gold'), 35);
      } else {
        // Appoggiatura: takes 50% of beat with strong emotional tension
        playPianoTone(293.66, now, 0.45, 0.35); // D4
        highlightKey('D4', 450, 'lit-pink');
        playPianoTone(261.63, now + 0.45, 0.75, 0.32); // C4
        setTimeout(() => highlightKey('C4', 750, 'lit-gold'), 450);
      }
    };

    // 10. Strings: Pizzicato vs Arco vs Sordino
    const stringsCanvas = document.getElementById('stringsCanvas');
    const sgCtx = stringsCanvas ? stringsCanvas.getContext('2d') : null;
    let stringActiveStyle = 'pizzicato';

    function renderStringsCanvas() {
      if (!sgCtx || !stringsCanvas) return;
      sgCtx.clearRect(0, 0, stringsCanvas.width, stringsCanvas.height);
      const w = stringsCanvas.width;
      const h = stringsCanvas.height;

      // Draw spectral bars
      const numBars = 16;
      const barW = (w - 60) / numBars;
      for (let i = 0; i < numBars; i++) {
        let barH = 0;
        if (stringActiveStyle === 'pizzicato') {
          barH = Math.max(4, (16 - i) * 3 + Math.sin(artAnimTime * 8 + i) * 4);
        } else if (stringActiveStyle === 'arco') {
          barH = (h * 0.7) * (1 - i / 20) + Math.sin(artAnimTime * 3 + i) * 6;
        } else {
          // Con Sordino: high frequencies cut off
          barH = i > 7 ? 3 : ((8 - i) * 7 + Math.sin(artAnimTime * 2 + i) * 3);
        }
        sgCtx.fillStyle = stringActiveStyle === 'sordino' ? '#a855f7' : (stringActiveStyle === 'arco' ? '#38bdf8' : '#f59e0b');
        sgCtx.fillRect(30 + i * barW + 2, h * 0.9 - barH, barW - 4, barH);
      }
    }

    window.playStringsDemo = function(type, btn) {
      const ctx = getCtx();
      if (!ctx) return;
      pulseCardFeedback(btn, 2200);
      stringActiveStyle = type;
      const tag = document.getElementById('stringsTag');
      if (tag) tag.textContent = type === 'pizzicato' ? 'Pizzicato: Plucked String Acoustic Transient Snap' : (type === 'arco' ? 'Arco: Continuous Horsehair Friction with Rich Harmonics' : 'Con Sordino: Physical Bridge Mute Veiling Higher Frequencies');

      const now = ctx.currentTime;
      const f = 220; // A3
      highlightKey('A3', 1500, 'lit-cyan');

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      if (type === 'pizzicato') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2800, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.45, now + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
      } else if (type === 'arco') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3200, now);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.32, now + 0.18);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
      } else {
        // Con Sordino: damped filter
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, now); // Damped warm tone
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.30, now + 0.22);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
      }

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterCompressor || ctx.destination);
      osc.start(now);
      osc.stop(now + 2.0);
      triggerAudioActivity(f);
    };

    // 11. Fermata & Tempo Rubato
    const rubatoCanvas = document.getElementById('rubatoCanvas');
    const rbCtx = rubatoCanvas ? rubatoCanvas.getContext('2d') : null;

    function renderRubatoCanvas() {
      if (!rbCtx || !rubatoCanvas) return;
      rbCtx.clearRect(0, 0, rubatoCanvas.width, rubatoCanvas.height);
      const w = rubatoCanvas.width;
      const h = rubatoCanvas.height;

      // Dynamic elastic grid lines
      const numLines = 8;
      rbCtx.lineWidth = 2;
      for (let i = 0; i < numLines; i++) {
        const baseNorm = i / (numLines - 1);
        const elasticStretch = Math.sin(artAnimTime * 2 + baseNorm * 3) * (w * 0.05);
        const x = 30 + baseNorm * (w - 60) + elasticStretch;
        rbCtx.beginPath();
        rbCtx.moveTo(x, 15);
        rbCtx.lineTo(x, h - 15);
        rbCtx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        rbCtx.stroke();
      }

      // Fermata symbol
      rbCtx.fillStyle = '#fff';
      rbCtx.font = 'bold 24px Outfit';
      rbCtx.textAlign = 'center';
      rbCtx.fillText('𝄐', w / 2, h / 2 + 8);
    }

    window.playRubatoDemo = function(type, btn) {
      const ctx = getCtx();
      if (!ctx) return;
      pulseCardFeedback(btn, 3200);
      const tag = document.getElementById('rubatoTag');
      if (tag) tag.textContent = type === 'fermata' ? 'Dramatic Fermata Pause: Holding Peak Tone Indefinitely' : (type === 'rubato' ? 'Tempo Rubato: Expressive Elastic Time (Rushing & Lingering)' : 'Strict Metronomic Mechanical Reference');

      const now = ctx.currentTime;
      const notes = [261.63, 293.66, 329.63, 392.00, 523.25]; // C D E G C

      if (type === 'fermata') {
        // Notes play, then top note holds with majestic fermata
        notes.forEach((f, idx) => {
          const isHold = (idx === notes.length - 1);
          const t = now + idx * 0.4;
          const dur = isHold ? 2.2 : 0.35;
          playPianoTone(f, t, dur, isHold ? 0.42 : 0.28);
          setTimeout(() => {
            highlightKey(getNoteFromFreq(f), Math.round(dur * 1000), isHold ? 'lit-gold' : 'lit-cyan');
          }, idx * 0.4 * 1000);
        });
      } else if (type === 'rubato') {
        // Elastic tempo timings
        const timings = [0, 0.45, 0.75, 1.25, 2.0];
        notes.forEach((f, idx) => {
          const t = now + timings[idx];
          playPianoTone(f, t, 0.55, 0.32);
          setTimeout(() => {
            highlightKey(getNoteFromFreq(f), 600, 'lit-pink');
          }, timings[idx] * 1000);
        });
      } else {
        // Strict metronomic
        notes.forEach((f, idx) => {
          const t = now + idx * 0.4;
          playPianoTone(f, t, 0.35, 0.28);
          setTimeout(() => {
            highlightKey(getNoteFromFreq(f), 350);
          }, idx * 0.4 * 1000);
        });
      }
    };

    // ============================================================
    // MOVEABLE / DRAGGABLE LIGHT-UP PLAYABLE PIANO KEYBOARD ENGINE
    // ============================================================
    let dockOctave = 0; // -1: C3-B4, 0: C4-B5, 1: C5-B6
    let dockSoundEnabled = true;

    window.toggleDockMinimize = function() {
      const dock = document.getElementById('floatingKeyboardDock');
      if (!dock) return;
      dock.classList.toggle('minimized');
      const isMin = dock.classList.contains('minimized');
      const btn = document.getElementById('dockMinBtn');
      if (btn) btn.innerHTML = isMin ? '+' : '&minus;';
    };

    window.shiftDockOctave = function(delta) {
      dockOctave = Math.max(-1, Math.min(1, dockOctave + delta));
      const labels = { '-1': 'C3–B4', '0': 'C4–B5', '1': 'C5–B6' };
      const labelEl = document.getElementById('dockOctaveLabel');
      if (labelEl) labelEl.textContent = labels[dockOctave.toString()] || 'C4–B5';

      const whiteNotesBase = [
        ['C', 0, 4], ['D', 2, 4], ['E', 4, 4], ['F', 5, 4], ['G', 7, 4], ['A', 9, 4], ['B', 11, 4],
        ['C', 12, 5], ['D', 14, 5], ['E', 16, 5], ['F', 17, 5], ['G', 19, 5], ['A', 21, 5], ['B', 23, 5]
      ];
      const blackNotesBase = [
        ['C#', 1, 4], ['D#', 3, 4], ['F#', 6, 4], ['G#', 8, 4], ['A#', 10, 4],
        ['C#', 13, 5], ['D#', 15, 5], ['F#', 18, 5], ['G#', 20, 5], ['A#', 22, 5]
      ];

      const whiteKeys = document.querySelectorAll('.dock-white-key');
      whiteKeys.forEach((k, idx) => {
        if (whiteNotesBase[idx]) {
          const [name, st, baseOct] = whiteNotesBase[idx];
          const actualOct = baseOct + dockOctave;
          const noteKey = `${name}${actualOct}`;
          k.dataset.note = noteKey;
          k.textContent = (name === 'C') ? noteKey : name;
        }
      });
      const blackKeys = document.querySelectorAll('.dock-black-key');
      blackKeys.forEach((k, idx) => {
        if (blackNotesBase[idx]) {
          const [name, st, baseOct] = blackNotesBase[idx];
          const actualOct = baseOct + dockOctave;
          k.dataset.note = `${name}${actualOct}`;
        }
      });
    };

    window.toggleDockSound = function(btn) {
      dockSoundEnabled = !dockSoundEnabled;
      const b = btn || document.getElementById('dockSoundToggleBtn');
      if (b) {
        b.textContent = dockSoundEnabled ? 'Sound ON' : 'Sound OFF';
        b.classList.toggle('active', dockSoundEnabled);
      }
    };

    function initFloatingDock() {
      const dockEl = document.getElementById('floatingKeyboardDock');
      const dockDragHeader = document.getElementById('dockDragHeader');
      if (!dockEl || !dockDragHeader) return;

      let isDraggingDock = false;
      let dockStartX = 0, dockStartY = 0;
      let dockInitLeft = 0, dockInitTop = 0;

      dockDragHeader.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.dock-btn')) return;
        isDraggingDock = true;
        try { dockDragHeader.setPointerCapture(e.pointerId); } catch(err) {}
        const rect = dockEl.getBoundingClientRect();
        dockStartX = e.clientX;
        dockStartY = e.clientY;
        dockInitLeft = rect.left;
        dockInitTop = rect.top;
        dockEl.style.bottom = 'auto';
        dockEl.style.right = 'auto';
        dockEl.style.left = `${dockInitLeft}px`;
        dockEl.style.top = `${dockInitTop}px`;
      });

      dockDragHeader.addEventListener('pointermove', (e) => {
        if (!isDraggingDock) return;
        const dx = e.clientX - dockStartX;
        const dy = e.clientY - dockStartY;
        const maxLeft = Math.max(10, window.innerWidth - dockEl.offsetWidth - 10);
        const maxTop = Math.max(10, window.innerHeight - dockEl.offsetHeight - 10);
        let newLeft = Math.max(10, Math.min(maxLeft, dockInitLeft + dx));
        let newTop = Math.max(10, Math.min(maxTop, dockInitTop + dy));
        dockEl.style.left = `${newLeft}px`;
        dockEl.style.top = `${newTop}px`;
      });

      const stopDrag = (e) => {
        if (!isDraggingDock) return;
        isDraggingDock = false;
        try { dockDragHeader.releasePointerCapture(e.pointerId); } catch(err) {}
      };

      dockDragHeader.addEventListener('pointerup', stopDrag);
      dockDragHeader.addEventListener('pointercancel', stopDrag);

      // Playable Keys on Floating Dock
      document.querySelectorAll('.dock-white-key, .dock-black-key').forEach(key => {
        const trigger = (e) => {
          e.preventDefault();
          const semitone = parseInt(key.dataset.semitone, 10);
          const baseFreq = 261.63 * Math.pow(2, dockOctave); // C4 in active octave
          const freq = baseFreq * Math.pow(2, semitone / 12);
          const note = key.dataset.note;

          if (dockSoundEnabled) {
            playPianoTone(freq, getCtx().currentTime, 1.4, 0.35);
          }
          triggerAudioActivity(freq);

          const badge = document.getElementById('dockChordDisplay');
          if (badge) badge.textContent = `${note} (${Math.round(freq)} Hz)`;

          key.classList.remove('lit-gold', 'lit-pink', 'lit-emerald');
          key.classList.add('active', 'lit-cyan');
          setTimeout(() => key.classList.remove('active', 'lit-cyan'), 450);

          // Highlight matching key on main piano if in range
          const mainKeys = Array.from(document.querySelectorAll('.white-key, .black-key'));
          const mainKey = mainKeys.find(k => k.dataset.note === note);
          if (mainKey) {
            mainKey.classList.add('active');
            setTimeout(() => mainKey.classList.remove('active'), 450);
          }
        };
        key.addEventListener('mousedown', trigger);
        key.addEventListener('touchstart', trigger, { passive: false });
      });
    }
