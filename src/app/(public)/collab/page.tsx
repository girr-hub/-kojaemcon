"use client";

import { useState, FormEvent } from "react";
import styles from "./collab.module.css";

// /collab 페이지
// 디자인 출처: KOGEMCON_Collab_1.png (소개+협업유형+통계), KOGEMCON-Collab_2.png (문의 폼)
//
// 폼 제출은 아직 실제 엔드포인트에 연결되어 있지 않습니다.
// handleSubmit 안의 TODO 부분에 기존 CS 문의(/cs) 페이지에서 쓰는 방식이나
// Resend(RESEND_API_KEY) 를 이용한 API 라우트(/api/collab-proposal) 를 연결해주세요.

const COLLAB_TYPES = [
  {
    heading: ["Event Hosting", "& Co-hosting"],
    body: "Planning an event for foreigners in Korea? Partner with us to reach thousands of potential attendees. We handle promotion, ticketing, and community outreach.",
    tags: [
      "Event listing & promotion",
      "Ticket sales management",
      "Community reach 5,000+",
      "Social media coverage",
    ],
  },
  {
    heading: ["Sponsorship", "& Advertising"],
    body: "Want to reach Korea's international community? KOGEMCON connects your brand with foreigners living in Korea — a highly engaged, spending demographic.",
    tags: [
      "Banner & logo placement",
      "Sponsored event packages",
      "Newsletter features",
      "Social media mentions",
    ],
  },
  {
    heading: ["Business", "Partnership"],
    body: "Restaurants, bars, tour companies, language schools — if your business serves the foreign community in Korea, let's build something together.",
    tags: [
      "Venue partnerships",
      "Service promotions",
      "Package deals",
      "Referral programs",
    ],
  },
  {
    heading: ["Media & Influencer", "Collaboration"],
    body: "Are you a content creator, YouTuber, or media outlet covering life in Korea? Let's create content together and share our audiences.",
    tags: [
      "Content collaboration",
      "Event coverage",
      "Cross-promotion",
      "Interview features",
    ],
  },
];

const STATS = [
  { number: "5,000+", label: "COMMUNITY MEMBERS" },
  { number: "50+", label: "NATIONALITIES" },
  { number: "90%", label: "REPEAT ATTENDEES" },
  { number: "30+", label: "EVENTS HOSTED" },
];

export default function CollabPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    type: "",
    idea: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      // TODO: 실제 제출 엔드포인트로 교체
      const res = await fetch("/api/collab-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("sent");
      setForm({ name: "", email: "", company: "", type: "", idea: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className={styles.page}>
      {/* 1. 인트로 */}
      <section className={styles.intro}>
        <span className={styles.eyebrow}>COLLAB</span>
        <h1 className={styles.heading}>Let&apos;s Work Together</h1>
        <p className={styles.lead}>
          <strong>KOGEMCON</strong> is Korea&apos;s go-to platform for the
          international community.
        </p>
        <p className={styles.lead}>
          We&apos;re open to all kinds of collaborations — from event
          hosting to brand partnerships.
        </p>
      </section>

      {/* 2. 협업 유형 4가지 */}
      <section className={styles.types}>
        {COLLAB_TYPES.map((type) => (
          <div className={styles.typeBlock} key={type.heading.join(" ")}>
            <div>
              <h2 className={styles.typeHeading}>
                {type.heading[0]}
                <br />
                {type.heading[1]}
              </h2>
              <p className={styles.typeBody}>{type.body}</p>
            </div>
            <div className={styles.tagList}>
              {type.tags.map((tag) => (
                <div className={styles.tag} key={tag}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* 3. Why Partner With Us? 통계 */}
      <section className={styles.stats}>
        <h2 className={styles.statsHeading}>
          Why Partner
          <br />
          With Us?
        </h2>
        <div className={styles.statGrid}>
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className={styles.statNumber}>{stat.number}</p>
              <p className={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Get In Touch 폼 */}
      <section className={styles.formSection}>
        <div className={styles.formCard}>
          <h2 className={styles.formHeading}>GET IN TOUCH</h2>
          <p className={styles.formIntro}>
            Tell us about your idea and we&apos;ll get back to you within 48
            hours.
          </p>

          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="name">Your name *</label>
              <input
                id="name"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="company">Company / Organization</label>
              <input
                id="company"
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="type">Type of collaboration *</label>
              <input
                id="type"
                required
                value={form.type}
                onChange={(e) => update("type", e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="idea">Tell us about your idea *</label>
              <textarea
                id="idea"
                required
                value={form.idea}
                onChange={(e) => update("idea", e.target.value)}
              />
            </div>

            <div className={styles.submitRow}>
              <button
                type="submit"
                className={styles.btnSubmit}
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Send Proposal →"}
              </button>
            </div>

            {status === "sent" && (
              <p className={styles.formNote}>
                Thanks! We&apos;ll get back to you within 48 hours.
              </p>
            )}
            {status === "error" && (
              <p className={styles.formNote}>
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
