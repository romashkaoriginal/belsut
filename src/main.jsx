import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, ArrowRight, ArrowDown, Plus, Minus, Menu, X, Route, TrainFront, Network, Code2, Check, Phone, MapPin, ExternalLink } from 'lucide-react';
import { programs, questions, source } from './data';
import './styles.css';

const icons = { route: Route, rail: TrainFront, systems: Network, code: Code2 };
const External = ({ href, children, className = '' }) => <a className={className} href={href} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={17} aria-hidden="true" /></a>;

function App() {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState('roads');
  const [comparison, setComparison] = useState(false);
  const [scores, setScores] = useState(['', '', '', '']);
  const [calcOpen, setCalcOpen] = useState(false);
  const heroArt = useRef(null);
  const program = programs.find(p => p.id === active);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('arrived'); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const close = e => { if (e.key === 'Escape') { setMenu(false); document.getElementById('menu-toggle')?.focus(); } };
    if (menu) {
      document.addEventListener('keydown', close);
      document.querySelector('#navigation a')?.focus();
    }
    return () => document.removeEventListener('keydown', close);
  }, [menu]);

  const moveArt = e => {
    if (!matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top) / rect.height - .5;
    heroArt.current.style.transform = `perspective(1400px) rotateY(${x * 3}deg) rotateX(${-y * 2}deg) translate3d(${x * 6}px,${y * 6}px,0)`;
  };
  const resetArt = () => { if (heroArt.current) heroArt.current.style.transform = ''; };
  const validScores = scores.every((v, i) => v !== '' && Number.isFinite(Number(v)) && Number(v) >= (i === 3 ? 1 : 0) && Number(v) <= (i === 3 ? 10 : 100) && (i === 3 || Number.isInteger(Number(v))));
  const total = validScores ? Math.round((+scores[0] + +scores[1] + +scores[2] + +scores[3] * 10) * 10) / 10 : null;

  return <>
    <a className="skip-link" href="#main">Перейти к содержанию</a>
    <header className="header">
      <a className="brand" href="#" aria-label="БелГУТ — строительный факультет, начало страницы"><img src="/assets/bgut-logo.png" width="145" height="46" alt="БелГУТ" /><span>Строительный<br/>факультет</span></a>
      <nav className={menu ? 'navigation is-open' : 'navigation'} id="navigation" aria-label="Основная навигация">
        {[['#programs', 'Специальности'], ['#practice', 'Обучение'], ['#questions', 'Вопросы'], ['#contacts', 'Контакты']].map(([href, title]) => <a key={href} href={href} onClick={() => setMenu(false)}>{title}</a>)}
      </nav>
      <a className="header-cta" href="#admission">Как поступить <ArrowUpRight size={16} /></a>
      <button id="menu-toggle" className="menu-toggle" aria-label={menu ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menu} aria-controls="navigation" onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
    </header>

    <main id="main">
      <section className="hero" onPointerMove={moveArt} onPointerLeave={resetArt} aria-labelledby="hero-title">
        <div className="hero-topline"><span>Белорусский государственный университет транспорта</span><span>Гомель, Беларусь</span></div>
        <div className="hero-content">
          <h1 id="hero-title">Создавать то,<br/>что <span>останется.</span></h1>
          <p>Дороги, которые соединяют. Системы, которые работают. Технологии, которые меняют города.</p>
          <p className="hero-intro">Твоя инженерная профессия начинается<br className="desktop-break"/> на строительном факультете БелГУТ.</p>
          <a className="button primary" href="#programs">Найти своё направление <ArrowUpRight size={20}/></a>
        </div>
        <figure className="hero-art" ref={heroArt}><img src="/assets/bridge.webp" alt="Концептуальная инженерная модель вантового моста" width="1536" height="1024" fetchPriority="high"/><figcaption>Инженерия начинается с идеи.<span>Концептуальная визуализация</span></figcaption></figure>
        <div className="hero-bottom"><a href="#programs" className="explore"><ArrowDown size={18}/> Найди масштаб своей идеи</a><span>Дороги · Железные дороги · Инженерные сети · IT</span></div>
      </section>

      <section className="intro section-wrap" aria-label="О факультете">
        <p className="intro-statement" data-reveal>Город — это тысячи решений.<br/><span>Одно из них будет твоим.</span></p>
        <div className="intro-copy"><p>За привычным маршрутом, водой в кране и цифровой моделью стоят инженеры. На СФ ты выбираешь, какую часть этого мира хочешь создавать.</p><a className="text-link" href="#programs">Четыре способа начать <ArrowDown size={16}/></a></div>
      </section>

      <section className="programs-section section-wrap" id="programs" aria-labelledby="programs-title">
        <div className="section-heading"><h2 id="programs-title">Большой мир.<br/><span>Твоё направление.</span></h2><p>Сначала — то, что тебе интересно.<br/>Затем — специальность и профессия.</p></div>
        <div className="program-tabs" role="tablist" aria-label="Направления подготовки">{programs.map(p => { const Icon = icons[p.icon]; return <button key={p.id} id={`tab-${p.id}`} role="tab" aria-selected={active === p.id} aria-controls="program-panel" tabIndex={active === p.id ? 0 : -1} onClick={() => setActive(p.id)} onKeyDown={e => {
          const index = programs.findIndex(v => v.id === active);
          let next;
          if (e.key === 'ArrowRight') next = (index + 1) % programs.length;
          if (e.key === 'ArrowLeft') next = (index + programs.length - 1) % programs.length;
          if (e.key === 'Home') next = 0;
          if (e.key === 'End') next = programs.length - 1;
          if (next !== undefined) { e.preventDefault(); setActive(programs[next].id); document.getElementById(`tab-${programs[next].id}`).focus(); }
        }}><Icon size={23} strokeWidth={1.5}/><span>{p.label}</span><ArrowUpRight className="tab-arrow" size={18}/></button>; })}</div>
        <div className="program-panel" id="program-panel" role="tabpanel" aria-labelledby={`tab-${active}`}>
          <div className="program-summary" key={active}>
            <span className="program-code">{program.code}</span><h3>{program.lead}</h3><p>{program.description}</p>
            <div className="program-facts"><div><strong>{program.years} {program.years === 4 ? 'года' : 'лет'}</strong><span>дневная форма</span></div><div><strong>{program.places} {program.places === 12 ? 'мест' : 'места'}</strong><span>план приёма 2026</span></div></div>
            <a className="button light" href="#admission">Что нужно для поступления <ArrowUpRight size={18}/></a>
          </div>
          <div className="program-detail"><h4>{program.title}</h4><p className="profile">Профилизация: {program.profile.toLowerCase()}</p><div className="detail-rule"/><p className="small-label">Примеры профессиональных задач</p><ul>{program.tasks.map(t => <li key={t}><Check size={18}/>{t}</li>)}</ul><div className="career"><span>Квалификация</span><strong>{program.qualification}</strong></div><div className="career"><span>Где применять знания</span><p>{program.work}</p></div></div>
        </div>
        <div className="comparison-control"><p>Выбираешь между несколькими направлениями?</p><button className="text-link" aria-expanded={comparison} aria-controls="comparison-table" onClick={() => setComparison(!comparison)}>{comparison ? 'Скрыть сравнение' : 'Сравнить все специальности'}{comparison ? <Minus size={18}/> : <Plus size={18}/>}</button></div>
        {comparison && <div id="comparison-table" className="comparison-table" role="region" aria-label="Сравнение специальностей" tabIndex="0"><table><caption>Дневная форма. План приёма 2026 года — справочные данные.</caption><thead><tr><th scope="col">Что сравниваем</th>{programs.map(p => <th scope="col" key={p.id}>{p.label}</th>)}</tr></thead><tbody><tr><th scope="row">Специальность</th>{programs.map(p => <td key={p.id}>{p.title}</td>)}</tr><tr><th scope="row">Срок</th>{programs.map(p => <td key={p.id}>{p.years} {p.years === 4 ? 'года' : 'лет'}</td>)}</tr><tr><th scope="row">Мест в плане 2026</th>{programs.map(p => <td key={p.id}>{p.places}</td>)}</tr><tr><th scope="row">Квалификация</th>{programs.map(p => <td key={p.id}>{p.qualification}</td>)}</tr><tr><th scope="row">Экзамены</th><td colSpan="4">Математика, физика, русский или белорусский язык (ЦЭ / ЦТ)</td></tr><tr><th scope="row">Тебе может подойти, если интересны</th>{programs.map(p => <td key={p.id}>{p.interests}</td>)}</tr></tbody></table></div>}
        <div className="source-line">Данные: <External href={source.faculty}>ABITURIENT.BY</External><span>·</span><External href={source.plan}>План приёма 2026</External><span>Следующий набор уточняйте в университете.</span></div>
      </section>

      <section className="practice" id="practice" aria-labelledby="practice-title">
        <div className="practice-inner"><div className="practice-lead"><h2 id="practice-title">Идея.<br/>Расчёт.<br/><span>Реальный мир.</span></h2><p>Инженерное образование имеет смысл,<br/>когда знания становятся решением.</p></div>
        <div className="learning-path"><article><span className="step-number">01</span><div><h3>Понять, как всё устроено</h3><p>Математика, физика и инженерная база — чтобы не просто повторять решение, а понимать, почему оно работает.</p></div></article><article><span className="step-number">02</span><div><h3>Попробовать своими руками</h3><p>На младших курсах есть возможность получить рабочую профессию. Учебная и практическая подготовка помогает познакомиться с производством.</p></div></article><article><span className="step-number">03</span><div><h3>Решать инженерные задачи</h3><p>Курсовые и дипломные проекты связывают с задачами производства. Работа с расчётами и проектными решениями становится частью подготовки.</p></div></article></div></div>
        <div className="practice-footer"><span>На факультете с 1954 года</span><span>Проектирование · Строительство · Эксплуатация</span></div>
      </section>

      <section className="possibility section-wrap"><h2 data-reveal>Профессия —<br/>больше одного маршрута.</h2><div className="possibility-list"><article><h3>Работать в инженерии</h3><p>Развивать инфраструктуру в проектных, транспортных, строительных и коммунальных организациях.</p></article><article><h3>Соединять технологии</h3><p>Применять программирование к задачам проектирования и производства на направлении ИСиТ.</p></article><article><h3>Продолжить образование</h3><p>Рассмотреть магистратуру по направлениям «Транспорт» и «Строительство». Программу и условия приёма уточнить отдельно.</p></article></div></section>

      <section className="admission section-wrap" id="admission" aria-labelledby="admission-title"><div className="section-heading"><h2 id="admission-title">Первый шаг<br/><span>уже можно сделать.</span></h2><p>Определиться с направлением.<br/>Разобраться в условиях. Подготовиться.</p></div><div className="admission-note"><span>О следующем наборе</span><p>Кампания 2026 года завершилась. Сроки и план следующего приёма проверяйте после официальной публикации БелГУТ.</p></div><ol className="admission-steps"><li><span>01</span><h3>Выбери специальность</h3><p>Сравни не только названия, но и задачи будущей работы, квалификацию и срок обучения.</p><a href="#programs">К направлениям <ArrowUpRight size={16}/></a></li><li><span>02</span><h3>Проверь испытания</h3><p>В текущих карточках программ: математика, физика и русский или белорусский язык.</p><External href={source.faculty}>Проверить требования</External></li><li><span>03</span><h3>Обсуди условия</h3><p>Уточни конкурс, целевое обучение, документы и сроки для своей ситуации.</p><a href="#contacts">Связаться с факультетом <ArrowUpRight size={16}/></a></li></ol>
      <div className="calculator"><div><h3>Собери свои баллы в одну сумму.</h3><p>Три сертификата и средний балл аттестата × 10.<br/>Ориентир для подготовки, а не прогноз зачисления.</p></div><button className="button outline" onClick={() => setCalcOpen(!calcOpen)} aria-expanded={calcOpen} aria-controls="score-calculator">{calcOpen ? 'Закрыть расчёт' : 'Посчитать баллы'}{calcOpen ? <Minus size={18}/> : <Plus size={18}/>}</button>
      {calcOpen && <div id="score-calculator" className="calculator-fields">{['Математика', 'Физика', 'Русский / белорусский', 'Средний балл аттестата'].map((label, i) => <label key={label}>{label}<input type="number" inputMode="decimal" min={i === 3 ? 1 : 0} max={i === 3 ? 10 : 100} step={i === 3 ? .1 : 1} value={scores[i]} placeholder={i === 3 ? '1–10' : '0–100'} onChange={e => setScores(scores.map((v, j) => j === i ? e.target.value : v))}/></label>)}<output aria-live="polite">{validScores ? <><strong>{total}</strong> из 400</> : 'Укажи три результата от 0 до 100 и средний балл от 1 до 10.'}</output><p className="calc-disclaimer">Расчёт не учитывает минимальные пороги, льготы, отдельные конкурсы и специальные условия приёма.</p></div>}</div></section>

      <section className="questions section-wrap" id="questions"><div className="faq-intro"><h2>Важное.<br/><span>Без мелкого шрифта.</span></h2><p>Вопросы, которые стоит обсудить<br/>дома и в приёмной комиссии.</p></div><div className="faq-list">{questions.map(([q, a, url]) => <details key={q}><summary>{q}<Plus className="faq-plus" size={20}/></summary><div className="faq-answer"><p>{a}</p><External href={url}>Проверить условия</External></div></details>)}</div></section>

      <section className="contact section-wrap" id="contacts"><div><h2>Твой следующий<br/>маршрут — <span>БелГУТ.</span></h2><p>Необязательно знать все ответы сейчас.<br/>Начни с разговора о том, что тебе интересно.</p><a className="button primary" href="tel:+375232952192"><Phone size={18}/> Позвонить в деканат</a></div><address className="contact-details"><div><span>Строительный факультет</span><a href="tel:+375232952192">+375 (232) 95-21-92</a><p>Деканат · кабинет 564</p></div><div><span>Белорусский государственный<br/>университет транспорта</span><p>Гомель, ул. Кирова, 34</p><External href={source.official}>Факультет на сайте университета</External></div></address></section>
    </main>
    <footer className="footer"><div className="footer-main"><a href="#" className="footer-name">БелГУТ <span>Строительный факультет</span></a><a href="#programs">Выбрать направление <ArrowUpRight size={17}/></a></div><div className="footer-bottom"><span>Информационный проект · 2026</span><a href="/sources.html">Источники и актуальность данных</a><span>Проверено {source.checked}</span></div></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);

