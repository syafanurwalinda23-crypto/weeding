"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const weddingDate = "2026-12-27T08:00:00+07:00";

const desktopSlides = [
  {
    src: "/images/bride-groom-their-wedding-ceremony.jpg",
    alt: "Latar undangan",
    caption: "Uut Kosfendi & Nabila Afira Fitri"
  },
  {
    src: "/reference/groom.webp",
    alt: "Foto pengantin pria",
    caption: "Minggu, 27 Desember 2026"
  },
  {
    src: "/reference/bride.webp",
    alt: "Foto pengantin wanita",
    caption: "Save our date"
  }
];

const verses = [
  {
    title: "QS. Adh-Dhariyat: 49",
    content: "Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat kebesaran Allah."
  },
  {
    title: "QS. An-Najm: 45",
    content: "Dan sesungguhnya Dialah yang menciptakan pasangan laki-laki dan perempuan."
  }
];

const storyMoments = [
  {
    title: "Pertemuan Pertama",
    year: "2021",
    description: "Kami bertemu dalam suasana yang sederhana, lalu tumbuh menjadi kisah yang selalu ingin kami jaga."
  },
  {
    title: "Lamaran",
    year: "2025",
    description: "Dengan restu keluarga, kami memutuskan melangkah lebih jauh menuju ibadah terpanjang."
  },
  {
    title: "Hari Bahagia",
    year: "2026",
    description: "Kini kami mengundang Anda untuk menjadi bagian dari momen yang akan kami kenang seumur hidup."
  }
];

const events = [
  {
    label: "Akad Nikah",
    time: "08.00 WIB - selesai",
    date: "Minggu, 27 Desember 2026"
  },
  {
    label: "Resepsi",
    time: "11.00 WIB - 15.00 WIB",
    date: "Minggu, 27 Desember 2026"
  }
];

const bankAccounts = [
  {
    bank: "BCA",
    number: "1234567890",
    name: "Nabila Afira Fitri"
  },
  {
    bank: "Mandiri",
    number: "9876543210",
    name: "Uut Kosfendi"
  }
];

const emptyCountdown = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  finished: false
};

const navItems = [
  { id: "home", label: "Home", short: "Home" },
  { id: "couple", label: "Mempelai", short: "Couple" },
  { id: "story", label: "Story", short: "Story" },
  { id: "event", label: "Acara", short: "Acara" },
  { id: "comment", label: "Ucapan", short: "Ucapan" }
];

const initialMessages = [
  {
    name: "Rina & Keluarga",
    attendance: "Hadir",
    message: "MasyaAllah, semoga acara lancar dan menjadi keluarga yang sakinah mawaddah warahmah.",
    createdAt: "Baru saja"
  },
  {
    name: "Bima",
    attendance: "Berhalangan",
    message: "Mohon maaf belum bisa hadir. Semoga cinta kalian selalu dijaga Allah SWT.",
    createdAt: "1 jam lalu"
  }
];

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
    finished: false
  };
}

function Wave({ inverted = false }) {
  return (
    <div className={`wave-wrap${inverted ? " inverted" : ""}`}>
      <svg viewBox="0 0 1440 320" aria-hidden="true" className="wave-shape">
        <path
          fill="currentColor"
          d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,96C960,96,1056,160,1152,154.7C1248,149,1344,75,1392,37.3L1440,0L1440,320L0,320Z"
        />
      </svg>
    </div>
  );
}

function HeartCluster() {
  return (
    <div className="heart-cluster" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  );
}

function ClassicInvitationHeading() {
  return (
    <>
      <span className="eyebrow home-eyebrow">Undangan Pernikahan</span>
      <h1 className="script-heading home-title">
        <span className="home-name-line">Uut Kosfendi</span>
        {/* <span className="home-divider" aria-hidden="true">
          <span className="home-divider-line" />
          <span className="home-divider-badge">&amp;</span>
          <span className="home-divider-line" />
        </span> */}
          <span className="home-divider-line" />
                  <span className="home-divider-badge">&amp;</span>
          <span className="home-divider-line" />

        <span className="home-name-line">
          <span>Nabila</span>
          <span>Afira Fitri</span>
        </span>
      </h1>
      <p className="hero-date home-date">Minggu, 12 April 2026</p>
    </>
  );
}

export default function InvitationClient() {
  const [guestName, setGuestName] = useState("Bapak/Ibu/Saudara/i");
  const [isOpened, setIsOpened] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [countdown, setCountdown] = useState(emptyCountdown);
  const [activeSection, setActiveSection] = useState("home");
  const [storyOpen, setStoryOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [form, setForm] = useState({
    name: "",
    attendance: "Hadir",
    message: ""
  });

  const audioRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const guest = params.get("to");

    if (guest) {
      const decoded = guest.replace(/\+/g, " ");
      setGuestName(decoded);
      setForm((current) => ({ ...current, name: decoded }));
    }

    const savedMessages = window.localStorage.getItem("wedding-comments");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch {
        window.localStorage.removeItem("wedding-comments");
      }
    }
  }, []);

  useEffect(() => {
    setCountdown(formatCountdown(weddingDate));

    const timer = window.setInterval(() => {
      setCountdown(formatCountdown(weddingDate));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("wedding-comments", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const slider = window.setInterval(() => {
      setCurrentSlide((current) => (current + 1) % desktopSlides.length);
    }, 5500);

    return () => window.clearInterval(slider);
  }, []);

  useEffect(() => {
    const revealElements = document.querySelectorAll("[data-reveal]");
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.18 }
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
      { threshold: 0.5 }
    );

    sections.forEach((section) => sectionObserver.observe(section));

    return () => {
      revealObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    return () => {
      document.body.classList.remove("invitation-open");
    };
  }, []);

  const toggleMusic = async () => {
    const player = audioRef.current;
    if (!player) {
      return;
    }

    if (musicEnabled) {
      player.pause();
      setMusicEnabled(false);
      return;
    }

    try {
      await player.play();
      setMusicEnabled(true);
    } catch {
      setMusicEnabled(false);
    }
  };

  const openInvitation = async () => {
    setIsOpened(true);
    document.body.classList.add("invitation-open");

    const player = audioRef.current;
    if (player) {
      try {
        await player.play();
        setMusicEnabled(true);
      } catch {
        setMusicEnabled(false);
      }
    }
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

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedName = form.name.trim();
    const trimmedMessage = form.message.trim();

    if (!trimmedName || !trimmedMessage) {
      return;
    }

    setMessages((current) => [
      {
        name: trimmedName,
        attendance: form.attendance,
        message: trimmedMessage,
        createdAt: "Baru saja"
      },
      ...current
    ]);

    setForm((current) => ({
      ...current,
      message: ""
    }));
  };

  const copyText = async (value) => {
    if (!navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(value);
  };

  const openCalendar = () => {
    const start = "20261227T010000Z";
    const end = "20261227T080000Z";
    const url = new URL("https://calendar.google.com/calendar/render");
    url.search = new URLSearchParams({
      action: "TEMPLATE",
      text: "The Wedding of Uut Kosfendi & Nabila Afira Fitri",
      dates: `${start}/${end}`,
      details: "Undangan pernikahan Uut Kosfendi dan Nabila Afira Fitri.",
      location: "Balai Samudra, Jakarta"
    }).toString();

    window.open(url.toString(), "_blank", "noreferrer");
  };

  return (
    <>
      <audio ref={audioRef} src="/reference/theme-song.mp3" loop preload="auto" />

      {!isOpened && (
        <div className="welcome-screen">
          <div className="welcome-card">
            <div className="welcome-card-frame">
              <div className="welcome-photo">
                <Image
                  src="/images/Uut-Weeding.png"
                  alt="Foto Uut dan Nabila"
                  fill
                  sizes="320px"
                  priority
                />
              </div>
              <ClassicInvitationHeading />
              <div className="welcome-guest">
                <small>Kepada Yth.</small>
                <strong>{guestName}</strong>
              </div>
              <button type="button" className="button button-primary" onClick={openInvitation}>
                Buka Undangan
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="invitation-layout">
        <aside className="desktop-stage">
          {desktopSlides.map((slide, index) => (
            <div
              key={slide.src}
              className={`desktop-slide${index === currentSlide ? " active" : ""}`}
            >
              <Image src={slide.src} alt={slide.alt} fill sizes="60vw" priority={index === 0} />
            </div>
          ))}
          <div className="desktop-stage-overlay" />
          <div className="desktop-stage-copy" data-reveal>
            <span className="eyebrow">Undangan Pernikahan</span>
            <h2>Uut Kosfendi & Nabila Afira Fitri</h2>
            <p>27 Desember 2026</p>
            <small>{desktopSlides[currentSlide].caption}</small>
          </div>
        </aside>

        <div className="phone-column">
          <div className="phone-shell">
            <main className="phone-content">
              <section className="section home-section" id="home" data-section>
                <div className="home-bg">
                  <Image
                    src="/images/bride-groom-their-wedding-ceremony.jpg"
                    alt="Background home"
                    fill
                    sizes="420px"
                    priority
                  />
                </div>
                <div className="hero-glow hero-glow-left" />
                <div className="hero-glow hero-glow-right" />
                <div className="section-inner home-inner">
                  <div className="home-card-frame">
                    <ClassicInvitationHeading />
                    <button
                      type="button"
                      className="button button-ghost hero-calendar-button"
                      onClick={openCalendar}
                    >
                      Save Google Calendar
                    </button>
                  </div>
                  <div className="scroll-cue">
                    <div className="scroll-mouse">
                      <div className="scroll-dot" />
                    </div>
                    <span className="scroll-label">Scroll Down</span>
                  </div>
                </div>
              </section>

              <Wave />

              <section className="section panel-section" id="couple" data-section>
                <div className="section-inner text-center">
                  <p className="arabic-text">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
                  <h2 className="script-heading section-title">Assalamualaikum Warahmatullahi Wabarakatuh</h2>
                  <p className="section-copy">
                    Dengan memohon rahmat dan ridho Allah SWT, kami mengundang <strong>{guestName}</strong>{" "}
                    untuk hadir dalam acara pernikahan kami.
                  </p>

                  <div className="couple-stack">
                    <article className="couple-card reveal-right" data-reveal>
                      <HeartCluster />
                      <div className="portrait-frame">
                        <Image src="/reference/groom.webp" alt="Pengantin pria" fill sizes="220px" />
                      </div>
                      <h3>Uut Kosfendi</h3>
                      <p className="couple-role">Putra pertama</p>
                      <p className="couple-parent">Bapak Ahmad Prasetyo</p>
                      <p className="couple-parent">dan Ibu Siti Rahma</p>
                    </article>

                    <div className="ampersand">&amp;</div>

                    <article className="couple-card reveal-left" data-reveal>
                      <HeartCluster />
                      <div className="portrait-frame">
                        <Image src="/reference/bride.webp" alt="Pengantin wanita" fill sizes="220px" />
                      </div>
                      <h3>Nabila Afira Fitri</h3>
                      <p className="couple-role">Putri kedua</p>
                      <p className="couple-parent">Bapak Mulyono</p>
                      <p className="couple-parent">dan Ibu Nurhayati</p>
                    </article>
                  </div>
                </div>
              </section>

              <Wave inverted />

              {/* <section className="section soft-section" id="verse" data-section>
                <div className="section-inner">
                  <h2 className="script-heading section-title text-center">Firman Allah</h2>
                  <div className="verse-grid">
                    {verses.map((verse) => (
                      <article key={verse.title} className="verse-card reveal-up" data-reveal>
                        <p>{verse.content}</p>
                        <strong>{verse.title}</strong>
                      </article>
                    ))}
                  </div>
                </div>
              </section> */}

              <section className="section soft-section" id="story" data-section>
                <div className="section-inner">
                  <div className="story-panel">
                    <h2 className="script-heading section-title text-center">Kisah Cinta</h2>
                    <div className="story-video reveal-up" data-reveal>
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
                        <article key={item.title} className="timeline-item reveal-up" data-reveal>
                          <div className="timeline-marker">{index + 1}</div>
                          <div className="timeline-body">
                            <small>{item.year}</small>
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="section panel-section" id="event" data-section>
                <div className="section-inner">
                  <h2 className="script-heading section-title text-center">Save The Date</h2>
                  <div className="countdown-grid">
                    {["days", "hours", "minutes", "seconds"].map((key) => (
                      <article key={key} className="countdown-card reveal-up" data-reveal>
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
                      <article key={event.label} className="event-card reveal-up" data-reveal>
                        <h3>{event.label}</h3>
                        <p>{event.date}</p>
                        <strong>{event.time}</strong>
                        
                      </article>
                    ))}
                  </div>

                  <div className="venue-card reveal-up" data-reveal>
                    <h3>Balai Samudra, Jakarta</h3>
                    <p>Jl. Boulevard Barat Raya, Kelapa Gading, Jakarta Utara</p>
                    <a
                      href="https://maps.google.com/?q=Balai+Samudra+Jakarta"
                      target="_blank"
                      rel="noreferrer"
                      className="button button-ghost button-inline"
                    >
                      Buka Google Maps
                    </a>
                  </div>
                </div>
              </section>

              <section className="section soft-section" id="gift" data-section>
                <div className="section-inner">
                  <h2 className="script-heading section-title text-center">Love Gift</h2>
                  <p className="section-copy text-center">
                    Jika berhalangan hadir dan ingin mengirim tanda kasih, Anda dapat menggunakan rekening atau
                    QR sample berikut.
                  </p>

                  <div className="gift-stack">
                    <article className="gift-card reveal-up" data-reveal>
                      <p className="gift-heading">Transfer</p>
                      {bankAccounts.slice(0, 1).map((account) => (
                        <div key={account.number} className="bank-card">
                          <div>
                            <small>{account.bank}</small>
                            <strong>{account.number}</strong>
                            <p>a.n. {account.name}</p>
                          </div>
                          <button
                            type="button"
                            className="button button-copy"
                            onClick={() => copyText(account.number)}
                          >
                            Copy
                          </button>
                        </div>
                      ))}
                    </article>

                    {/* <article className="gift-card reveal-up" data-reveal>
                      <p className="gift-heading">QR / Gift</p>
                      <div className="gift-qr">
                        <Image src="/reference/gift-qr.png" alt="QR sample gift" fill sizes="250px" />
                      </div>
                      <button
                        type="button"
                        className="button button-ghost button-inline"
                        onClick={() => copyText("QRIS SAMPLE - GANTI DENGAN QR ASLI")}
                      >
                        Copy Keterangan QR
                      </button>
                    </article> */}
                  </div>
                </div>
              </section>

              <section className="section panel-section" id="comment" data-section>
                <div className="section-inner">
                  <div className="comment-panel">
                    <h2 className="script-heading section-title text-center">Ucapan &amp; Doa</h2>
                    <div className="info-banner">
                      <strong>Bestie note</strong>
                      <p>Versi saat ini masih demo lokal. Ucapan tersimpan di browser yang sama.</p>
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
                              name: event.target.value
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
                              attendance: event.target.value
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
                              message: event.target.value
                            }))
                          }
                        />
                      </label>

                      <button type="submit" className="button button-primary button-full">
                        Kirim Ucapan
                      </button>
                    </form>

                    <div className="comment-list">
                      {messages.map((item, index) => (
                        <article key={`${item.name}-${index}`} className="comment-card">
                          <div className="comment-meta">
                            <div>
                              <strong>{item.name}</strong>
                              <small>{item.createdAt}</small>
                            </div>
                            <span>{item.attendance}</span>
                          </div>
                          <p>{item.message}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <footer className="page-footer">
                <div className="footer-sound-wrap">
                  <button
                    type="button"
                    className={`footer-sound-button${musicEnabled ? " active" : ""}`}
                    onClick={toggleMusic}
                    aria-label={musicEnabled ? "Matikan musik" : "Putar musik"}
                  >
                    <Icon
                      icon={musicEnabled ? "solar:volume-loud-bold" : "solar:volume-cross-bold"}
                      className="sound-iconify"
                      aria-hidden="true"
                    />
                  </button>
                </div>
                <p>Terima kasih atas doa dan kehadiran Anda.</p>
                <strong>Uut Kosfendi &amp; Nabila Afira Fitri</strong>
              </footer>
            </main>

            <nav className="bottom-nav">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={activeSection === item.id ? "active" : ""}
                >
                  <span className="nav-indicator" />
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
