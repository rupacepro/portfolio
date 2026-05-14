import "./App.css";
import { IoIosMenu, IoMdClose } from "react-icons/io";
import { LuFacebook, LuLinkedin, LuInstagram, LuGithub } from "react-icons/lu";
import { useState, useEffect, useRef } from "react";

/* ── Uptime counter ── */
function useUptime() {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

/* ── Intersection observer ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ── Data ── */
const MARQUEE = ["C#", "JavaScript", "Java", "Python", "ReactJs", "ASP.NET", "JQuery", "MySQL", "SQL Server", "Git", "Docker", "CI/CD"];

const PROJECTS = [
  { num:"001", title:"Inventory & Par Level Management System", tag:"Full-stack", desc:"real-time dashboards, low-stock alerts, and multi-store architecture so each location runs independently. ASP.NET Core APIs on the backend, React on the front, SQL Server + Azure keeping it reliable in production.", stack:["ReactJs","ASP.NET","SQL Server"] },
  { num:"002", title:"JanSport E-Commerce", tag:"Full-Stack", desc:"Full-stack e-commerce clone built with Django and Bootstrap — auth, product management, search, and a responsive UI that doesn't make your eyes bleed. Kept it simple, kept it functional.", stack:["Django","Bootstrap"] },
  ];

const EXP = [
  {year:"2026 ->", co:"Unknown", role:"Loading", desc: "Searchig", note:"..."},  
  { year:"2023", co:"Lambton College, Toronto",  role:"Post-grad · Full Stack Development",     note:"Front-end, back-end, cloud, databases. The whole thing. Still standing." },
  { year:"2021",   co:"Evolve Asia",                role:"Front-End Developer",                    note:"Where I learned that 'it looks fine on my screen' is never acceptable." },
  { year:"2017",   co:"Tribhuwan University",       role:"B.Sc. Information Management",           note:"Graduated. Got the degree. Immediately started forgetting the theory." },
];

/* ── Terminal widget ── */
const COMMANDS = {
  help:    'Available commands: help · whoami · stack · contact · joke · exit',
  whoami:  'Rupesh — Full-stack Developer, Thinker, API Whisperer.',
  stack:   'ASP.NET· ReactJs · Python · Java · Docker · MYSQL · JQuery',
  contact: 'rup.ace.pasa@gmail.com  ·  github.com/rupacepro  ·  linkedin.com/in/rupacepro',
  joke:    "Plot twist: you're here to hire me",
  exit:    "Nice try. You can't exit my website.",
};

function Terminal() {
  const [history, setHistory] = useState([{ type:"out", text:'Welcome. Type "help" to get started.' }]);
  const [input, setInput]     = useState("");
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [history]);

  const run = (e) => {
    if (e.key !== "Enter" || !input.trim()) return;
    const cmd = input.trim().toLowerCase();
    const res = COMMANDS[cmd] || `command not found: ${cmd}. Try "help".`;
    setHistory(h => [...h, { type:"in", text:input }, { type:"out", text:res }]);
    setInput("");
  };

  return (
    <div className="terminal">
      <div className="term-bar">
        <span className="tdot" style={{background:"#ff5f57"}}/>
        <span className="tdot" style={{background:"#febc2e"}}/>
        <span className="tdot" style={{background:"#28c840"}}/>
        <span className="term-title">rupesh@portfolio:~</span>
      </div>
      <div className="term-body">
        {history.map((l, i) => (
          <div key={i} className={`tline t-${l.type}`}>
            {l.type === "in" && <span className="tprompt">❯ </span>}
            {l.text}
          </div>
        ))}
        <div className="tinput-row">
          <span className="tprompt">❯ </span>
          <input
            className="tinput"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={run}
            placeholder="type a command..."
            spellCheck={false}
          />
        </div>
        <div ref={bottomRef}/>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════ */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const uptime = useUptime();

  const [heroRef,  heroInView]  = useInView(0.1);
  const [projRef,  projInView]  = useInView(0.05);
  const [expRef,   expInView]   = useInView(0.1);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const close = () => setMenuOpen(false);

  const handleMail = (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.user_name.value;
    const email = form.user_email.value;
    const message = form.message.value;

    const subject = encodeURIComponent(`Message from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage:\n${message}`);

    // Create a temporary link
    const mailtoLink = document.createElement("a");
    mailtoLink.href = `https://mail.google.com/mail/?view=cm&to=rup.ace.pasa@gmail.com&su=${subject}&body=${body}`;
    mailtoLink.target = "_blank"; // open in new tab/window
    mailtoLink.click(); // simulate click

    form.reset();
  };

  return (
    <div className="app">

      {/* ── NAVBAR ── */}
      <nav className={`navbar ${scrolled ? "nb-solid" : ""}`}>
        <div className="nb-inner">
          <a className="nb-logo" href="#home" onClick={close}>rupesh<span>.dev</span></a>

          <div className="nb-uptime" title="Live page uptime. Because backend devs care.">
            <span className="up-dot"/>
            {uptime}
          </div>

          <ul className="nb-links">
            {["about","projects","experience","contact"].map(l => (
              <li key={l}><a href={`#${l}`}>{l}</a></li>
            ))}
          </ul>

          <div className="nb-socials">
            <a href="https://github.com/rupacepro"      target="_blank" rel="noopener noreferrer" aria-label="GitHub"><LuGithub/></a>
            <a href="https://linkedin.com/in/rupacepro" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LuLinkedin/></a>
          </div>

          <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            {menuOpen ? <IoMdClose/> : <IoIosMenu/>}
          </button>
        </div>

        <div className={`mobile-drawer ${menuOpen ? "open" : ""}`}>
          {["about","projects","experience","contact"].map(l => (
            <a key={l} href={`#${l}`} onClick={close}>{l}</a>
          ))}
          <div className="mob-soc">
            <a href="https://github.com/rupacepro"      target="_blank" rel="noopener noreferrer"><LuGithub/></a>
            <a href="https://linkedin.com/in/rupacepro" target="_blank" rel="noopener noreferrer"><LuLinkedin/></a>
            <a href="https://instagram.com/rupacepro"   target="_blank" rel="noopener noreferrer"><LuInstagram/></a>
            <a href="https://facebook.com/rupacepro"    target="_blank" rel="noopener noreferrer"><LuFacebook/></a>
          </div>
        </div>
      </nav>

      {menuOpen && <div className="overlay" onClick={close}/>}

      {/* ── HERO ── */}
      <section id="home" className="hero">
        <span className="hero-bg-word" aria-hidden="true">BACKEND</span>
        <div className="hero-inner" ref={heroRef}>
          <div className={`hero-content ${heroInView ? "revealed" : ""}`}>
            <div className="chip-row">
              <span className="chip chip-lime">● open to work</span>
              <span className="chip chip-ghost">frontend · backend · apis</span>
            </div>

            <h1 className="hero-h1">
              <em className="h1-line">I make</em>
              <strong className="h1-line lime">Websites</strong>
              <em className="h1-line">Work.</em>
            </h1>

            <p className="hero-sub">
              Hi, I'm <strong>Rupesh</strong> — a full-stack developer specializing in React.js and C# (.NET Core)
              who thinks in data flows, and writes <em>README</em> files that people actually read.
            </p>

            <div className="hero-btns">
              <a href="#projects" className="btn-lime">See my work ↓</a>
              <a href="#contact"  className="btn-ghost-lime">Let's talk</a>
            </div>

            <div className="hero-stats">
              <div className="hstat"><b>2+</b><span>yrs coding</span></div>
              <div className="hstat-sep"/>
              <div className="hstat"><b>5+</b><span>real projects</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="marquee-wrap" aria-hidden="true">
        <div className="marquee-track">
          {[...MARQUEE,...MARQUEE,...MARQUEE].map((t,i) => (
            <span key={i} className="mq-item">{t} <span className="mq-sep">✦</span></span>
          ))}
        </div>
      </div>

      {/* ── ABOUT ── */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-left">
              <p className="eyebrow">// about.me</p>
              <h2 className="sec-h2">Early in my journey<br/><span className="lime">serious about growth.</span></h2>
              <p className="body-text">
                I'm an entry-level developer with a postgraduate background and about a year of practical experience in software development. I'm focused on building solid fundamentals and writing clean, readable code.
              </p>

              <p className="body-text">
                I enjoy solving problems, learning new technologies, and contributing to projects where I can grow as a developer. I'm especially interested in full-stack development and creating meaningful user experiences.
              </p>

              <p className="body-text">
                Outside work: I enjoy music, nature, and experimenting with new ideas in side projects.
              </p>
              <a href="/resume.pdf" className="btn-lime" download style={{marginTop:"2rem",display:"inline-flex"}}>
                Download CV →
              </a>
            </div>
            <div className="about-right">
              <Terminal/>
              <p className="term-hint">← try typing "joke" or "stack"</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="projects-sec">
        <div className="container">
          <p className="eyebrow">// things i've built</p>
          <h2 className="sec-h2">Real work.<br/><span className="lime">Real results.</span></h2>
          <div className="proj-grid" ref={projRef}>
            {PROJECTS.map((p,i) => (
              <div key={p.num} className={`proj-card ${projInView ? "card-in" : ""}`} style={{animationDelay:`${i*0.1}s`}}>
                <div className="proj-top">
                  <span className="proj-num">{p.num}</span>
                  <span className="proj-tag">{p.tag}</span>
                </div>
                <h3 className="proj-title">{p.title}</h3>
                <p className="proj-desc">{p.desc}</p>
                <div className="proj-stack">
                  {p.stack.map(s => <span key={s} className="proj-chip">{s}</span>)}
                </div>
                <a href="#" className="proj-link">view project →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="exp-sec">
        <div className="container">
          <p className="eyebrow">// experience.jsx</p>
          <h2 className="sec-h2">Where I've been<br/><span className="lime">deployed.</span></h2>
          <div className="exp-list" ref={expRef}>
            {EXP.map((e,i) => (
              <div key={i} className={`exp-row ${expInView ? "exp-in" : ""}`} style={{animationDelay:`${i*0.12}s`}}>
                <span className="exp-year">{e.year}</span>
                <div className="exp-body">
                  <div className="exp-hdr">
                    <span className="exp-role">{e.role}</span>
                    <span className="exp-co">@ {e.co}</span>
                  </div>
                  <p className="exp-note">{e.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="contact-sec">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-left">
              <p className="eyebrow">// contact.me</p>
              <h2 className="sec-h2">Got a system<br/>that needs<br/><span className="lime">fixing?</span></h2>
              <p className="body-text">
                Open to full-time roles, contracts, and interesting conversations.
              </p>
              <div className="clinks">
                <a className="clink"
                  href="https://mail.google.com/mail/?view=cm&to=rup.ace.pasa@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ✉ rup.ace.pasa@gmail.com
                </a>
                <a href="https://github.com/rupacepro"      target="_blank" rel="noopener noreferrer" className="clink"><LuGithub/> rupacepro</a>
                <a href="https://linkedin.com/in/rupacepro" target="_blank" rel="noopener noreferrer" className="clink"><LuLinkedin/> rupacepro</a>
              </div>
            </div>
            <form className="contact-form" onSubmit={handleMail}>
              <div className="ff">
                <label>name</label>
                <input type="text" name="user_name" placeholder="Your name" required />
              </div>
              <div className="ff">
                <label>email</label>
                <input type="email" name="user_email" placeholder="your@email.com" required />
              </div>
              <div className="ff">
                <label>what's up</label>
                <textarea name="message" rows={5} placeholder="Tell me about the project, the problem, or just say hi." required />
              </div>
              <button type="submit" className="btn-lime">Send it →</button>
            </form>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <p className="footer-copy">
            © 2026 rupesh.dev. All rights reserved.
          </p>
          <div className="footer-soc">
            <a href="https://github.com/rupacepro"      target="_blank" rel="noopener noreferrer" aria-label="GitHub"><LuGithub/></a>
            <a href="https://linkedin.com/in/rupacepro" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><LuLinkedin/></a>
            <a href="https://instagram.com/rupacepro"   target="_blank" rel="noopener noreferrer" aria-label="Instagram"><LuInstagram/></a>
            <a href="https://facebook.com/rupacepro"    target="_blank" rel="noopener noreferrer" aria-label="Facebook"><LuFacebook/></a>
          </div>
        </div>
      </footer>

    </div>
  );
}