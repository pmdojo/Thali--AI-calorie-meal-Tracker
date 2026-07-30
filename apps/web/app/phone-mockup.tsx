import s from './phone-mockup.module.css';

// A static, animated preview of the Thali dashboard rendered as a phone mockup.
// Pure CSS/SVG — no app dependency.
export function PhoneMockup() {
  return (
    <div className={s.phone}>
      <div className={s.notch} />
      <div className={s.screen}>
        {/* Status row */}
        <div className={s.statusRow}>
          <span>9:41</span>
          <span className={s.signal}>••• 📶 🔋</span>
        </div>

        {/* Greeting */}
        <div className={s.greetRow}>
          <div>
            <div className={s.greetSmall}>🌅 Good morning</div>
            <div className={s.greetBig}>How are we doing?</div>
          </div>
          <div className={s.streak}>🔥 4-day</div>
        </div>

        {/* Ring card */}
        <div className={s.ringCard}>
          <svg viewBox="0 0 200 200" className={s.ring} width="150" height="150">
            <defs>
              <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7a5af8" />
                <stop offset="100%" stopColor="#f26b3a" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(122,90,248,0.12)" strokeWidth="18" />
            <circle
              className={s.ringProgress}
              cx="100" cy="100" r="85" fill="none"
              stroke="url(#rg)" strokeWidth="18" strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
          </svg>
          <div className={s.ringInner}>
            <div className={s.ringLabel}>REMAINING</div>
            <div className={s.ringNum}>2067</div>
            <div className={s.ringUnit}>of 2400 kcal</div>
          </div>
        </div>

        {/* Macros */}
        <div className={s.macros}>
          <Macro label="Protein" pct={38} color="#7a5af8" val="53g" />
          <Macro label="Carbs" pct={52} color="#e5a72b" val="61g" />
          <Macro label="Fat" pct={44} color="#f26b3a" val="30g" />
        </div>

        {/* Today's Focus */}
        <div className={s.focusCard}>
          <div className={s.focusHead}>TODAY&apos;S FOCUS</div>
          <div className={s.focusRow}>
            <span className={s.check}>✓</span>
            <span>Eat <b>20g more protein</b></span>
          </div>
        </div>

        {/* AI Insight */}
        <div className={s.insight}>
          <div className={s.insightSheen} />
          <div className={s.insightTag}>✨ AI INSIGHT</div>
          <div className={s.insightBody}>
            “Yesterday you skipped breakfast. Today, try eating before 9&nbsp;AM.”
          </div>
        </div>

        {/* Quick actions */}
        <div className={s.qaHead}>QUICK ACTIONS</div>
        <div className={s.qaRow}>
          <div className={`${s.qa} ${s.qaPrimary}`}><span>📸</span>Scan</div>
          <div className={s.qa}><span>🎙️</span>Speak</div>
          <div className={s.qa}><span>✍️</span>Log</div>
        </div>
      </div>
    </div>
  );
}

function Macro({ label, pct, color, val }: { label: string; pct: number; color: string; val: string }) {
  return (
    <div className={s.macro}>
      <div className={s.macroTop}>
        <span className={s.macroDot} style={{ background: color }} />
        <span className={s.macroLabel}>{label}</span>
      </div>
      <div className={s.macroVal}>{val}</div>
      <div className={s.macroTrack}>
        <span className={s.macroFill} style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
