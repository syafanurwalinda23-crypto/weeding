"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMusicPlayer } from "./app-shell";

const weddingDate = "2026-04-12T08:00:00+07:00";

const weddingDetails = {
  groom: "Uut Kusfendi ",
  bride: "Nabila Avira Fitri",
  brideLines: ["Nabila", "Avira Fitri"],
  dateLabel: "Minggu, 12 April 2026",
  venueTitle: "Kediaman Mempelai Wanita",
  venueAddress: "Jl. Plumpang B V No.49c, RT.3/RW.4, Rawabadak Sel., Kec. Koja, Jkt Utara, Daerah Khusus Ibukota Jakarta 14230",
};

const storyMoments = [
  {
    title: "Pertemuan Pertama",
    year: "2021",
    description:
      "Kami bertemu dalam suasana sederhana, lalu tumbuh menjadi kisah yang selalu ingin kami jaga.",
  },
  {
    title: "Lamaran",
    year: "2025",
    description:
      "Dengan restu keluarga, kami memutuskan melangkah lebih jauh menuju ibadah terpanjang.",
  },
  {
    title: "Hari Bahagia",
    year: "2026",
    description:
      "Kini kami mengundang Anda untuk menjadi bagian dari momen yang akan kami kenang seumur hidup.",
  },
];

const events = [
  {
    label: "Akad Nikah",
    time: "08.00 WIB - selesai",
    date: weddingDetails.dateLabel,
  },
  {
    label: "Resepsi",
    time: "11.00 WIB - 15.00 WIB",
    date: weddingDetails.dateLabel,
  },
];

const bankAccounts = [
  {
    bank: "BCA",
    number: "1234567890",
    name: "Nabila Avira Fitri",
  },
];

const quranQuote = {
  arabic: "وَمِنْ كُلِّ شَيْءٍ خَلَقْنَا زَوْجَيْنِ لَعَلَّكُمْ تَذَكَّرُونَ",
  translation: "Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat kebesaran Allah.",
  source: "QS. Adz-Dzariyat: 49",
};

const navItems = [
  { id: "home", short: "Home", icon: "solar:home-2-bold" },
  { id: "couple", short: "Couple", icon: "solar:users-group-rounded-bold" },
  { id: "story", short: "Story", icon: "solar:hearts-bold" },
  { id: "event", short: "Acara", icon: "solar:calendar-mark-bold" },
  { id: "comment", short: "Ucapan", icon: "solar:chat-round-dots-bold" },
];

const emptyCountdown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  finished: false,
};

function formatCountdown(target) {
  const diff = new Date(target).getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    finished: false,
  };
}

function formatCommentTime(value) {
  if (!value) {
    return "";
  }

  const diff = Date.now() - new Date(value).getTime();

  if (Number.isNaN(diff) || diff < 0) {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(value));
  }

  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) {
    return "Baru saja";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} menit lalu`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} jam lalu`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} hari lalu`;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function InvitationHeading() {
  return (
    <div className="invitation-heading">
      <span className="eyebrow">Undangan Pernikahan</span>
      <h1 className="script-heading invitation-title">
        <span className="invitation-name">{weddingDetails.groom}</span>
        <span className="invitation-divider" aria-hidden="true">
          <span className="invitation-divider-line" />
          <span className="invitation-divider-badge">&amp;</span>
          <span className="invitation-divider-line" />
        </span>
        <span className="invitation-name invitation-name-bottom">
          {weddingDetails.brideLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </span>
      </h1>
      <p className="invitation-date">{weddingDetails.dateLabel}</p>
    </div>
  );
}

function PersonCard({ name, role, parents }) {
  return (
    <article className="person-card" data-reveal>
      <div className="person-copy">
        <p className="section-kicker person-role">{role}</p>
        <h3>{name}</h3>
        <span className="person-divider" aria-hidden="true" />
        <p className="person-parents">{parents[0]}</p>
        <p className="person-parents">dan {parents[1]}</p>
      </div>
    </article>
  );
}

export default function InvitationClient({ mode = "invite" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { musicEnabled, startMusic, toggleMusic } = useMusicPlayer();
  const [guestName, setGuestName] = useState("Bapak/Ibu/Saudara/i");
  const [countdown, setCountdown] = useState(emptyCountdown);
  const [activeSection, setActiveSection] = useState("home");
  const [storyOpen, setStoryOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(mode === "invite");
  const [commentError, setCommentError] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [form, setForm] = useState({
    name: "",
    attendance: "Hadir",
    message: "",
  });
  const videoRef = useRef(null);

  useEffect(() => {
    const guest = searchParams.get("to");

    if (guest) {
      const decoded = guest.replace(/\+/g, " ");
      setGuestName(decoded);
      setForm((current) => ({ ...current, name: decoded }));
    }

    if (mode !== "invite") {
      return;
    }
  }, [mode, searchParams]);

  useEffect(() => {
    if (mode !== "invite") {
      return;
    }

    setCountdown(formatCountdown(weddingDate));

    const timer = window.setInterval(() => {
      setCountdown(formatCountdown(weddingDate));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [mode]);

  useEffect(() => {
    if (mode !== "invite") {
      return;
    }

    let isMounted = true;

    const loadComments = async () => {
      setCommentsLoading(true);
      setCommentError("");

      try {
        const response = await fetch("/api/comments", { cache: "no-store" });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error || "Gagal memuat ucapan.");
        }

        if (isMounted) {
          setMessages(Array.isArray(payload.comments) ? payload.comments : []);
        }
      } catch (error) {
        if (isMounted) {
          setCommentError(error.message || "Gagal memuat ucapan.");
        }
      } finally {
        if (isMounted) {
          setCommentsLoading(false);
        }
      }
    };

    loadComments();

    return () => {
      isMounted = false;
    };
  }, [mode]);

  useEffect(() => {
    if (mode !== "invite") {
      return;
    }

    const revealElements = document.querySelectorAll("[data-reveal]");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.16 },
    );

    revealElements.forEach((element) => revealObserver.observe(element));

    const sections = document.querySelectorAll("section[data-section]");
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.45 },
    );

    sections.forEach((section) => sectionObserver.observe(section));

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, [mode]);

  useEffect(() => {
    if (mode === "invite") {
      document.body.classList.add("invitation-open");
    } else {
      document.body.classList.remove("invitation-open");
    }

    return () => {
      document.body.classList.remove("invitation-open");
    };
  }, [mode]);

  const openInvitation = async () => {
    await startMusic();
    const params = searchParams.toString();
    router.push(params ? `/undangan?${params}` : "/undangan");
  };

  const openStoryVideo = async () => {
    setStoryOpen(true);

    if (videoRef.current) {
      try {
        await videoRef.current.play();
      } catch {
        return;
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = form.name.trim();
    const trimmedMessage = form.message.trim();

    if (!trimmedName || !trimmedMessage) {
      return;
    }

    setSubmittingComment(true);
    setCommentError("");

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          attendance: form.attendance,
          message: trimmedMessage,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Gagal mengirim ucapan.");
      }

      setMessages((current) => [payload.comment, ...current]);
      setForm((current) => ({
        ...current,
        message: "",
      }));
    } catch (error) {
      setCommentError(error.message || "Gagal mengirim ucapan.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const copyText = async (value) => {
    if (!navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(value);
  };

  const openCalendar = () => {
    const start = "20260412T010000Z";
    const end = "20260412T080000Z";
    const url = new URL("https://calendar.google.com/calendar/render");
    url.search = new URLSearchParams({
      action: "TEMPLATE",
      text: `The Wedding of ${weddingDetails.groom} & ${weddingDetails.bride}`,
      dates: `${start}/${end}`,
      details: `Undangan pernikahan ${weddingDetails.groom} dan ${weddingDetails.bride}.`,
      location: weddingDetails.venueTitle,
    }).toString();

    window.open(url.toString(), "_blank", "noreferrer");
  };

  if (mode === "welcome") {
    return (
      <div className="welcome-screen">
        <div className="welcome-backdrop" aria-hidden="true">
          <Image
            src="/images/bg-welcome.jpg"
            alt=""
            fill
            sizes="100vw"
            priority
          />
        </div>
        <article className="welcome-card">
          <InvitationHeading />
          <div className="cover-guest">
            <small>Kepada Yth.</small>
            <strong>{guestName}</strong>
          </div>
          <button
            type="button"
            className="button button-primary welcome-open-button"
            onClick={openInvitation}
          >
            Buka Undangan
          </button>
        </article>
      </div>
    );
  }

  return (
    <>
      <div className="invitation-layout">
        <aside className="desktop-stage">
          <article className="desktop-card">
            <div className="desktop-photo">
              <Image
                src="/images/Uut-Weeding.png"
                alt="Foto Uut dan Nabila"
                fill
                sizes="420px"
                priority
              />
            </div>
            <InvitationHeading />
            <div className="summary-list">
              <div className="summary-item">
                <span>Tamu</span>
                <strong>{guestName}</strong>
              </div>
              <div className="summary-item">
                <span>Lokasi</span>
                <strong>{weddingDetails.venueTitle}</strong>
              </div>
            </div>
            <div className="desktop-actions">
              <button
                type="button"
                className="button button-primary"
                onClick={openCalendar}
              >
                Save Calendar
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={toggleMusic}
              >
                {musicEnabled ? "Matikan Musik" : "Putar Musik"}
              </button>
            </div>
          </article>
        </aside>

        <div className="phone-column">
          <div className="phone-shell">
            <main className="phone-content">
              <section className="section" id="home" data-section>
                <article className="surface-card hero-card" data-reveal>
                  <div className="hero-photo">
                    <Image
                      src="/images/Uut-Weeding.png"
                      alt="Foto Uut dan Nabila"
                      fill
                      sizes="360px"
                      priority
                    />
                  </div>
                  <InvitationHeading />
                  {/* <div className="hero-meta">
                    <span className="meta-pill">Save the date</span>
                    <span className="meta-pill">{weddingDetails.venueTitle}</span>
                  </div> */}
                  <div className="hero-actions">
                    <button
                      type="button"
                      className="button button-primary"
                      onClick={openCalendar}
                    >
                      Save Calendar
                    </button>
                    <a href="#event" className="button button-secondary">
                      Lihat Acara
                    </a>
                  </div>
                </article>
              </section>

              <section className="section" id="couple" data-section>
                <article className="surface-card" data-reveal>
                  <div className="section-head">
                    <span className="section-kicker">Mempelai</span>
                    <h2 className="section-title">
                      Assalamualaikum Warahmatullahi Wabarakatuh
                    </h2>
                    <p className="section-copy">
                      Dengan memohon rahmat dan ridho Allah SWT, kami mengundang{" "}
                      <strong>{guestName}</strong> untuk hadir dalam acara
                      pernikahan kami.
                    </p>
                  </div>
                  <div className="hadith-card" data-reveal>
                    <p className="hadith-arabic" lang="ar" dir="rtl">
                      {quranQuote.arabic}
                    </p>
                    <p className="hadith-translation">
                      {quranQuote.translation}
                    </p>
                    <small className="hadith-source">{quranQuote.source}</small>
                  </div>
                  <div className="couple-grid">
                    <PersonCard
                      name={weddingDetails.groom}
                      role="Putra pertama"
                      parents={["Bapak Timan", "Ibu Sri Widiyanti"]}
                    />
                    <PersonCard
                      name={weddingDetails.bride}
                      role="Putri Pertama"
                      parents={["Bapak Alm. Mulyono", "Ibu Eny Kismiastuti"]}
                    />
                  </div>
                </article>
              </section>

              {/* <section className="section" id="story" data-section>
                <article className="surface-card" data-reveal>
                  <div className="section-head">
                    <span className="section-kicker">Story</span>
                    <h2 className="section-title">Kisah Cinta</h2>
                    <p className="section-copy">Perjalanan singkat kami menuju hari bahagia.</p>
                  </div>

                  <div className="story-video">
                    {!storyOpen && (
                      <button type="button" className="story-overlay" onClick={openStoryVideo}>
                        <span>Lihat Story</span>
                      </button>
                    )}
                    <video
                      ref={videoRef}
                      src="/reference/story.mp4"
                      className="story-media"
                      controls
                      loop
                      muted
                      playsInline
                      preload="metadata"
                    />
                  </div>

                  <div className="story-timeline">
                    {storyMoments.map((item, index) => (
                      <article key={item.title} className="timeline-item" data-reveal>
                        <div className="timeline-marker">{index + 1}</div>
                        <div className="timeline-body">
                          <small>{item.year}</small>
                          <h3>{item.title}</h3>
                          <p>{item.description}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </article>
              </section> */}

              <section className="section" id="event" data-section>
                <article className="surface-card" data-reveal>
                  <div className="section-head">
                    <span className="section-kicker">Acara</span>
                    <h2 className="section-title">Save The Date</h2>
                    <p className="section-copy">
                      Catat tanggalnya dan pilih cara termudah untuk hadir di
                      hari bahagia kami.
                    </p>
                  </div>

                  <div className="countdown-grid">
                    {["days", "hours", "minutes", "seconds"].map((key) => (
                      <article key={key} className="countdown-card">
                        <strong>{countdown?.[key] ?? 0}</strong>
                        <span>
                          {key === "days"
                            ? "Hari"
                            : key === "hours"
                              ? "Jam"
                              : key === "minutes"
                                ? "Menit"
                                : "Detik"}
                        </span>
                      </article>
                    ))}
                  </div>

                  <div className="event-grid">
                    {events.map((event) => (
                      <article key={event.label} className="event-card">
                        <p className="section-kicker">{event.label}</p>
                        <h3>{event.date}</h3>
                        <strong>{event.time}</strong>
                      </article>
                    ))}
                  </div>

                  <div className="venue-card">
                    <div>
                      <p className="section-kicker">Lokasi</p>
                      <h3>{weddingDetails.venueTitle}</h3>
                      <p>{weddingDetails.venueAddress}</p>
                    </div>
                    <a
                      href="https://maps.app.goo.gl/jkNEmAQ5eU28UVG58?g_st=aw"
                      target="_blank"
                      rel="noreferrer"
                      className="button button-secondary button-inline"
                    >
                      Buka Google Maps
                    </a>
                  </div>

                  {/* <div className="map-card">
                    <iframe
                      title="Lokasi acara"
                      src="https://www.google.com/maps?q=Balai%20Samudra%20Jakarta&z=15&output=embed"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div> */}
                </article>
              </section>

              <section className="section" id="gift" data-section>
                <article className="surface-card" data-reveal>
                  <div className="section-head">
                    <span className="section-kicker">Gift</span>
                    <h2 className="section-title">Love Gift</h2>
                    <p className="section-copy">
                      Jika berhalangan hadir dan ingin mengirim tanda kasih,
                      Anda dapat menggunakan rekening berikut.
                    </p>
                  </div>

                  <div className="gift-stack">
                    {bankAccounts.map((account) => (
                      <article key={account.number} className="gift-card">
                        <div>
                          <p className="section-kicker">{account.bank}</p>
                          <strong>{account.number}</strong>
                          <p>a.n. {account.name}</p>
                        </div>
                        <button
                          type="button"
                          className="button button-secondary copy-icon-button"
                          onClick={() => copyText(account.number)}
                          aria-label={`Copy rekening ${account.bank}`}
                        >
                          <Icon icon="solar:copy-bold" aria-hidden="true" />
                        </button>
                      </article>
                    ))}
                  </div>
                </article>
              </section>

              <section className="section" id="comment" data-section>
                <article className="surface-card" data-reveal>
                  <div className="section-head">
                    <span className="section-kicker">Ucapan</span>
                    <h2 className="section-title">Ucapan &amp; Doa</h2>
                    <p className="section-copy">
                      Silakan kirim ucapan dan konfirmasi kehadiran Anda.
                    </p>
                  </div>

                  <form className="comment-form" onSubmit={handleSubmit}>
                    <label>
                      Nama
                      <input
                        type="text"
                        placeholder="Isikan nama Anda"
                        value={form.name}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                      />
                    </label>

                    <label>
                      Kehadiran
                      <select
                        value={form.attendance}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            attendance: event.target.value,
                          }))
                        }
                      >
                        <option value="Hadir">Hadir</option>
                        <option value="Berhalangan">Berhalangan</option>
                      </select>
                    </label>

                    <label>
                      Ucapan &amp; Doa
                      <textarea
                        rows="4"
                        placeholder="Tulis ucapan terbaik untuk kedua mempelai"
                        value={form.message}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            message: event.target.value,
                          }))
                        }
                      />
                    </label>

                    <button
                      type="submit"
                      className="button button-primary button-full"
                      disabled={submittingComment}
                    >
                      {submittingComment ? "Mengirim..." : "Kirim Ucapan"}
                    </button>
                  </form>

                  {commentsLoading && (
                    <p className="comment-feedback">Memuat ucapan...</p>
                  )}
                  {commentError && (
                    <p className="comment-feedback comment-feedback-error">
                      {commentError}
                    </p>
                  )}

                  <div className="comment-list">
                    {!commentsLoading &&
                      messages.length === 0 &&
                      !commentError && (
                        <p className="comment-feedback">
                          Belum ada ucapan. Jadilah yang pertama mengirim doa.
                        </p>
                      )}

                    {messages.map((item, index) => (
                      <article
                        key={item.id ?? `${item.name}-${index}`}
                        className="comment-card"
                      >
                        <div className="comment-meta">
                          <div>
                            <strong>{item.name}</strong>
                            <small>{formatCommentTime(item.created_at)}</small>
                          </div>
                          <span>{item.attendance}</span>
                        </div>
                        <p>{item.message}</p>
                      </article>
                    ))}
                  </div>
                </article>
              </section>

              <footer className="surface-card page-footer">
                <p>Terima kasih atas doa dan kehadiran Anda.</p>
                <strong>
                  {weddingDetails.groom} &amp; {weddingDetails.bride}
                </strong>
                <button
                  type="button"
                  className={`footer-sound-button${musicEnabled ? " active" : ""}`}
                  onClick={toggleMusic}
                  aria-label={musicEnabled ? "Matikan musik" : "Putar musik"}
                >
                  <Icon
                    icon={
                      musicEnabled
                        ? "solar:volume-loud-bold"
                        : "solar:volume-cross-bold"
                    }
                    className="sound-iconify"
                    aria-hidden="true"
                  />
                </button>
              </footer>
            </main>

            <nav className="bottom-nav">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={activeSection === item.id ? "active" : ""}
                >
                  <span className="nav-icon" aria-hidden="true">
                    <Icon icon={item.icon} />
                  </span>
                  <span className="nav-label">{item.short}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
