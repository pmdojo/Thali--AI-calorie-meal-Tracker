import { WaitlistForm } from './waitlist-form';
import styles from './page.module.css';

export default function LandingPage() {
  return (
    <main>
      <header className={styles.hero}>
        <div className="container">
          <p className={styles.wordmark}>Thali</p>
          <h1 className={styles.headline}>
            The nutrition coach<br />that speaks your food.
          </h1>
          <p className={styles.sub}>
            Calorie tracking calibrated for mixed home-cooked Indian meals — dal, sabzi, roti,
            biryani. Not just plated Western photography. One better choice at a time, not a lecture.
          </p>
          <div className={styles.ctaRow}>
            <WaitlistForm />
          </div>
          <p className={styles.trust}>
            No app store yet. Join the waitlist — we'll email you a TestFlight invite when the iOS build is ready.
          </p>
        </div>
      </header>

      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.h2}>Why we're not another calorie app</h2>
          <div className={styles.grid3}>
            <Card
              badge="1"
              title="Calibrated for Indian food"
              body="A curated ~100-dish reference table with per-portion gram weights — not a global database that guesses on your dal-chawal-sabzi thali."
            />
            <Card
              badge="2"
              title="Ranges, not fake precision"
              body="Every estimate ships with a confidence band. Point estimates on photo-estimated home-cooked food are a claim the underlying science can't support."
            />
            <Card
              badge="3"
              title="One better choice, not a lecture"
              body="If a meal exceeds 40% of the remaining daily budget, we surface one concrete swap before you log — not five buttons and a chart."
            />
          </div>
        </div>
      </section>

      <section className={styles.section} style={{ background: 'var(--surface-alt)' }}>
        <div className="container">
          <h2 className={styles.h2}>How it works</h2>
          <ol className={styles.steps}>
            <li>
              <strong>Snap the plate.</strong>{' '}
              Or add it manually from the dish library. Portion picker lets you calibrate small / medium / large.
            </li>
            <li>
              <strong>See it against your day.</strong>{' '}
              We compute a range against your remaining calorie budget — set once at onboarding from your goal.
            </li>
            <li>
              <strong>Decide, don't just log.</strong>{' '}
              If it's a lot for what's left in the day, you get one same-dish swap that saves a real number of calories. Tap it or ignore it.
            </li>
          </ol>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.h2}>What's not in v1 — deliberately</h2>
          <p className={styles.small}>
            No global food database. No barcode scanner. No chat coach. No micronutrients. No streak
            shaming. Narrow scope is what lets the accuracy claim stand up.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className="container">
          <p>© {new Date().getFullYear()} Thali · <a href="https://github.com/pmdojo/Thali--AI-calorie-meal-Tracker">source on GitHub</a></p>
        </div>
      </footer>
    </main>
  );
}

function Card({ badge, title, body }: { badge: string; title: string; body: string }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardBadge}>{badge}</div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardBody}>{body}</p>
    </div>
  );
}
