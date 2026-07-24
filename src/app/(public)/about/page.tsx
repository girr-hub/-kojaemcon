import Image from "next/image";
import Link from "next/link";
import styles from "./about.module.css";
import {
  GlobeIcon,
  MapPinIcon,
  TicketIcon,
  HandshakeIcon,
} from "@/components/InfoIcons";

// 코잼컨 About 페이지
// 디자인 출처: KOGEMCON-About.png 목업
// 로고 이미지는 /public/images/kogemcon-logo.png 로 저장해서 사용하세요.
// (업로드하신 코잼컨_로고.png 그대로 복사하면 됩니다)

export default function AboutPage() {
  return (
    <main className={styles.page}>
      {/* 1. 인트로 */}
      <section className={styles.intro}>
        <div className={styles.introInner}>
          <Image
            src="/images/kogemcon-logo.png"
            alt="KOGEMCON"
            width={180}
            height={260}
            className={styles.logo}
          />
          <div>
            <span className={styles.eyebrow}>About</span>
            <p className={styles.greeting}>안녕!</p>
            <p className={styles.lead}>
              <strong>KOGEMCON</strong> is your go-to platform for finding the
              best events, experiences, and meetups in Korea — made
              specifically for foreigners.
            </p>
            <p className={styles.lead}>
              Whether you just landed in Seoul or have been living here for
              years, we bring you the most exciting things happening around
              you — all in one place.
            </p>
          </div>
        </div>
      </section>

      {/* 2. 옐로 섹션: 이름 유래 + What We Do */}
      <section className={styles.yellow}>
        <div className={styles.yellowInner}>
          <h2 className={styles.stackHeading}>
            Korea
            <br />
            Gem
            <br />
            Contents
          </h2>

          <div className={styles.badgeRow}>
            <div className={styles.badge}>
              <div className={styles.badgeCircle}>
                <strong>KO — Korea</strong>
                <span>Everything happens right here in Korea</span>
              </div>
              <p className={styles.badgeLabel}>KO</p>
            </div>
            <div className={styles.badge}>
              <div className={styles.badgeCircle}>
                <strong>GEM — Fun (재미)</strong>
                <span>We only do things worth your time</span>
              </div>
              <p className={styles.badgeLabel}>GEM</p>
            </div>
            <div className={styles.badge}>
              <div className={styles.badgeCircle}>
                <strong>CON — Contents</strong>
                <span>Real experiences, not just content</span>
              </div>
              <p className={styles.badgeLabel}>CON</p>
            </div>
          </div>

          <p className={styles.body}>
            The name says it all.
            <br />
            Korea + Jaemi (재미, meaning &ldquo;fun&rdquo; in Korean) +
            Contents.
            <br />
            We believe Korea is one of the most exciting places in the world
            — and we want everyone to experience it fully.
          </p>

          <hr className={styles.divider} />

          <h3 className={styles.heading}>What We Do</h3>
          <p className={styles.body}>
            Korea&apos;s #1 platform for the international community. From
            wild parties to cultural deep-dives — we&apos;ve got you.
          </p>

          <div className={styles.grid2x2}>
            <div className={styles.card}>
              <h4>PARTY</h4>
              <p>
                The best nightlife and social events, curated for the
                international crowd.
              </p>
            </div>
            <div className={styles.card}>
              <h4>TOUR</h4>
              <p>
                Explore Korea beyond the tourist spots. Real experiences,
                real locals.
              </p>
            </div>
            <div className={styles.card}>
              <h4>MEETUP</h4>
              <p>
                Language exchanges, networking, community gatherings. Make
                friends here.
              </p>
            </div>
            <div className={styles.card}>
              <h4>LANGUAGE</h4>
              <p>
                한국어 배우고 싶어? Korean culture &amp; language events for
                all levels.
              </p>
            </div>
          </div>

          <Link href="/events" className={styles.btnDark}>
            Check out Events
          </Link>
        </div>
      </section>

      {/* 3. 크림 섹션: For Foreigners, By People Who Get It */}
      <section className={styles.cream}>
        <h3 className={styles.heading}>
          For Foreigners,
          <br />
          By People
          <br />
          Who Get It
        </h3>
        <p className={styles.body}>
          Language barriers, not knowing where to look, missing out on
          amazing things happening right around the corner — KOGEMCON was
          built to fix that.
        </p>

        <div className={styles.iconGrid}>
          <div className={styles.iconCard}>
            <GlobeIcon />
            <p>EVENTS IN ENGLISH (AND MORE)</p>
          </div>
          <div className={styles.iconCard}>
            <MapPinIcon />
            <p>SEOUL, BUSAN &amp; BEYOND</p>
          </div>
          <div className={styles.iconCard}>
            <TicketIcon />
            <p>EASY BOOKING, NO HASSLE</p>
          </div>
          <div className={styles.iconCard}>
            <HandshakeIcon />
            <p>30+ NATIONALITIES</p>
          </div>
        </div>
      </section>

      {/* 4. 다크 CTA: Got something going on? */}
      <section className={styles.dark}>
        <h3 className={styles.headingLight}>
          GOT SOMETHING
          <br />
          GOING ON?
        </h3>
        <p className={styles.bodyLight}>
          Running events for the international community in Korea? List
          your event on KOGEMCON and reach thousands of foreigners looking
          for exactly what you&apos;re offering.
        </p>
        <Link href="/collab" className={styles.btnAccent}>
          Launch Your Event
        </Link>
      </section>
    </main>
  );
}
