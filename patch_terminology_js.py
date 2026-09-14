with open("terminology.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Clean up the bottom: remove any leftover dock html after </script>
script_close_idx = html.rfind("</script>")
if script_close_idx != -1:
    after_script = html[script_close_idx:]
    clean_after_script = "</script>\n</body>\n</html>\n"
    html = html[:script_close_idx] + clean_after_script

# 2. Update highlightKey and add pulseCardFeedback near line 3660
pulse_feedback_code = """    // Universal Visual Feedback for Cards
    window.pulseCardFeedback = function(el, durationMs = 1500) {
      if (!el) return;
      const card = el.closest ? el.closest('.term-card') : el;
      if (card) {
        card.classList.add('card-active');
        setTimeout(() => card.classList.remove('card-active'), durationMs);
      }
      if (el.classList && el.classList.contains('exp-btn')) {
        el.classList.add('playing');
        setTimeout(() => el.classList.remove('playing'), durationMs);
      }
    };

    const activeHighlightTimeouts = new Map();

    function highlightKey(noteName, durationMs = 1000, colorClass = 'lit-gold') {
      if (!noteName || noteName === 'Note') return;

      // 1. Highlight on main piano (C3 to C5)
      const mainKeys = Array.from(document.querySelectorAll('.white-key, .black-key'));
      let mainTarget = mainKeys.find(k => k.dataset.note === noteName);
      if (!mainTarget) {
        const notePitch = noteName.replace(/\\d+/, '');
        mainTarget = mainKeys.find(k => k.dataset.note && k.dataset.note.replace(/\\d+/, '') === notePitch);
      }
      if (mainTarget) {
        mainTarget.classList.add('active');
        clearTimeout(activeHighlightTimeouts.get(mainTarget));
        const t = setTimeout(() => mainTarget.classList.remove('active'), durationMs);
        activeHighlightTimeouts.set(mainTarget, t);
      }

      // 2. Highlight on portable dock piano: exactly ONE key matching note, NEVER duplicate octaves!
      const dockKeys = Array.from(document.querySelectorAll('.dock-white-key, .dock-black-key'));
      let dockTarget = dockKeys.find(k => k.dataset.note === noteName);
      if (!dockTarget) {
        const notePitch = noteName.replace(/\\d+/, '');
        dockTarget = dockKeys.find(k => k.dataset.note && k.dataset.note.replace(/\\d+/, '') === notePitch);
      }
      if (dockTarget) {
        dockTarget.classList.remove('lit-gold', 'lit-cyan', 'lit-pink', 'lit-emerald');
        dockTarget.classList.add('active', colorClass);
        clearTimeout(activeHighlightTimeouts.get(dockTarget));
        const t = setTimeout(() => {
          dockTarget.classList.remove('active', colorClass, 'lit-gold', 'lit-cyan', 'lit-pink', 'lit-emerald');
        }, durationMs);
        activeHighlightTimeouts.set(dockTarget, t);
      }
    }

    function clearKeyHighlights() {
      const mainKeys = document.querySelectorAll('.white-key, .black-key');
      mainKeys.forEach(k => {
        k.classList.remove('active');
        clearTimeout(activeHighlightTimeouts.get(k));
      });
      const dockKeys = document.querySelectorAll('.dock-white-key, .dock-black-key');
      dockKeys.forEach(k => {
        k.classList.remove('active', 'lit-gold', 'lit-cyan', 'lit-pink', 'lit-emerald');
        clearTimeout(activeHighlightTimeouts.get(k));
      });
    }"""

old_target = """    function highlightKey(noteName, durationMs = 1200, colorClass = 'lit-gold') {
      // 1. Highlight on main piano
      const keyEl = Array.from(allKeys).find(k => k.dataset.note === noteName);
      if (keyEl) {
        keyEl.classList.add('active');
        setTimeout(() => keyEl.classList.remove('active'), durationMs);
      }
      // 2. Highlight on floating dock piano
      const dockKeys = document.querySelectorAll('.dock-white-key, .dock-black-key');
      dockKeys.forEach(k => {
        const rawNote = noteName.replace(/\\d/, '');
        const dockRaw = k.dataset.note.replace(/\\d/, '');
        if (k.dataset.note === noteName || dockRaw === rawNote) {
          k.classList.add('active', colorClass);
          setTimeout(() => k.classList.remove('active', colorClass), durationMs);
        }
      });
    }

    function clearKeyHighlights() {
      allKeys.forEach(k => k.classList.remove('active'));
      document.querySelectorAll('.dock-white-key, .dock-black-key').forEach(k => {
        k.classList.remove('active', 'lit-gold', 'lit-cyan', 'lit-pink', 'lit-emerald');
      });
    }"""

if old_target in html:
    html = html.replace(old_target, pulse_feedback_code)
    print("Replaced old highlightKey directly")
else:
    print("old_target not found verbatim, searching by anchor")
    idx1 = html.find("function highlightKey(noteName,")
    idx2 = html.find("let currentRoot = 'C';", idx1)
    if idx1 != -1 and idx2 != -1:
        html = html[:idx1] + pulse_feedback_code + "\n\n    // ============================================================\n    // CHORD & HARMONY ENGINE (ROOTS, INVERSIONS, 12 CHORD TYPES)\n    // ============================================================\n    " + html[idx2:]
        print("Replaced old highlightKey via index slice")

with open("terminology.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Stage 2A finished.")
