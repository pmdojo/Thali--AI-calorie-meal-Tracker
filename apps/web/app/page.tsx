import { WaitlistForm } from './waitlist-form';
import { PhoneMockup } from './phone-mockup';
import { Reveal, RevealStagger, RevealItem } from './reveal';
import s from './page.module.css';

const APP_URL = 'https://thali-ai.vercel.app';

export default function Landing() {
  return (
    <main>
      {/* Nav */}
      <nav className={s.nav}>
        <div className={`container ${s.navInner}`}>
          <div className={s.brand}>
            <span className={s.brandDot}>🍛</span>
            <span>Thali</span>
          </div>
          <a href={APP_URL} className={s.navCta}>Try the app →</a>
        </div>
      </nav>

      {/* Hero */}
      <header className={s.hero}>
        <div className={`container ${s.heroGrid}`}>
          <Reveal className={s.heroCopy}>
            <span className={s.eyebrow}>✨ Meet Thali AI</span>
            <h1 className={s.headline}>
              The nutrition coach<br />that <span className={s.grad}>speaks your food.</span>
            </h1>
            <p className={s.sub}>
              Snap a photo of your thali and Thali reads the whole plate — dal, sabzi, roti, rice —
              then tells you the one small thing to do next. Calibrated for home food, not plated Western meals.
            </p>

            <ul className={s.bullets}>
              <li style={{ animationDelay: '0.15s' }}><span className={s.spark}>✨</span> Knows dal</li>
              <li style={{ animationDelay: '0.3s' }}><span className={s.spark}>✨</span> Understands home food</li>
              <li style={{ animationDelay: '0.45s' }}><span className={s.spark}>✨</span> Learns your habits</li>
            </ul>

            <div className={s.ctaRow}>
              <a href={APP_URL} className={s.ctaPrimary}>Try the app — free</a>
              <a href="#waitlist" className={s.ctaGhost}>Join the waitlist</a>
            </div>
            <p className={s.trust}>No sign-up · No card · Real AI recognition on your own photos.</p>
          </Reveal>

          <Reveal className={s.heroPhone} delay={0.15} y={40}>
            <span className={`${s.floatEmoji} ${s.fe1}`}>🥗</span>
            <span className={`${s.floatEmoji} ${s.fe2}`}>🫓</span>
            <span className={`${s.floatEmoji} ${s.fe3}`}>🥣</span>
            <PhoneMockup />
          </Reveal>
        </div>
      </header>

      {/* Feature trio */}
      <section className={s.section}>
        <div className="container">
          <Reveal><h2 className={s.h2}>Not another calorie app</h2></Reveal>
          <RevealStagger className={s.grid3}>
            <RevealItem className={s.card}>
              <Feature emoji="🍛" title="Calibrated for Indian food"
                body="A curated dish reference with per-portion gram weights — not a global database that guesses on your dal-chawal-sabzi thali." />
            </RevealItem>
            <RevealItem className={s.card}>
              <Feature emoji="📈" title="Ranges, not fake precision"
                body="Every estimate ships with a confidence band. Point estimates on photo-guessed home food are a claim the science can't back." />
            </RevealItem>
            <RevealItem className={s.card}>
              <Feature emoji="🔄" title="One better choice, not a lecture"
                body="If a meal is a lot for what's left in your day, you get a single concrete swap — tap it or ignore it. Never five buttons and a chart." />
            </RevealItem>
          </RevealStagger>
        </div>
      </section>

      {/* How it works */}
      <section className={`${s.section} ${s.sectionAlt}`}>
        <div className="container">
          <Reveal><h2 className={s.h2}>Snap. See. Decide.</h2></Reveal>
          <RevealStagger className={s.steps}>
            <RevealItem className={s.step}>
              <Step n="1" title="Snap the plate" body="Or speak it, or add it manually. Thali recognises the dishes and estimates portions." />
            </RevealItem>
            <RevealItem className={s.step}>
              <Step n="2" title="See it against your day" body="A calibrated range lands against your remaining budget — set once from your goal." />
            </RevealItem>
            <RevealItem className={s.step}>
              <Step n="3" title="Decide, don't just log" body="Over budget? One same-dish swap that saves real calories. Your call." />
            </RevealItem>
          </RevealStagger>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className={s.section}>
        <div className="container">
          <Reveal>
            <div className={s.waitCard}>
              <h2 className={s.waitTitle}>Be first on iOS</h2>
              <p className={s.waitSub}>The web app is live now. Drop your email for a TestFlight invite when the native build ships.</p>
              <WaitlistForm />
            </div>
          </Reveal>
        </div>
      </section>

      <footer className={s.footer}>
        <div className="container">
          <span>© {new Date().getFullYear()} Thali</span>
          <span className={s.footSep}>·</span>
          <a href="https://github.com/pmdojo/Thali--AI-calorie-meal-Tracker">Source on GitHub</a>
          <span className={s.footSep}>·</span>
          <a href={APP_URL}>Open the app</a>
        </div>
      </footer>
    </main>
  );
}

function Feature({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <>
      <div className={s.cardEmoji}>{emoji}</div>
      <h3 className={s.cardTitle}>{title}</h3>
      <p className={s.cardBody}>{body}</p>
    </>
  );
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <>
      <div className={s.stepNum}>{n}</div>
      <div>
        <h3 className={s.stepTitle}>{title}</h3>
        <p className={s.stepBody}>{body}</p>
      </div>
    </>
  );
}
