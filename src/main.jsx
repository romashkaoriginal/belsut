import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ArrowDown, ArrowRight, ArrowUpRight, Check, Code2, Menu, Network, Route, TrainFront, X} from 'lucide-react';
import {programs, source} from './data';
import './styles.css';

const icons = {route: Route, rail: TrainFront, systems: Network, code: Code2};

const External = ({href, children}) => <a href={href} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={17}/></a>;

function App() {
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState('roads');
  const [comparison, setComparison] = useState(false);
  const heroArt = useRef(null);
  const program = programs.find((item) => item.id === active);

  useEffect(() => {
    const close = (event) => {
      if (event.key === 'Escape') {
        setMenu(false);
        document.getElementById('menu-toggle')?.focus();
      }
    };
    if (menu) {
      document.addEventListener('keydown', close);
      document.querySelector('#navigation a')?.focus();
    }
    return () => document.removeEventListener('keydown', close);
  }, [menu]);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('arrived');
        observer.unobserve(entry.target);
      }
    }), {threshold: 0.14});
    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const moveArt = (event) => {
    if (!matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroArt.current.style.transform = `perspective(1400px) rotateY(${x * 3}deg) rotateX(${-y * 2}deg) translate3d(${x * 6}px,${y * 6}px,0)`;
  };

  const chooseProgram = (id) => {
    setActive(id);
    document.getElementById('programs')?.scrollIntoView({behavior: 'smooth'});
  };

  return <>
    <a className="skip-link" href="#main">Перейти к содержанию</a>
    <header className="header">
      <a className="brand" href="#" aria-label="БелГУТ — строительный факультет, начало страницы">
        <img src="/assets/bgut-logo.png" width="145" height="46" alt="БелГУТ"/>
        <span>Строительный<br/>факультет</span>
      </a>
      <nav className={menu ? 'navigation is-open' : 'navigation'} id="navigation" aria-label="Основная навигация">
        {[['#programs', 'Специальности'], ['#experience', 'Как учат'], ['#admission', 'Поступление'], ['#contacts', 'Контакты']].map(([href, title]) => <a key={href} href={href} onClick={() => setMenu(false)}>{title}</a>)}
      </nav>
      <a className="header-cta" href="#programs">Выбрать направление <ArrowUpRight size={16}/></a>
      <button id="menu-toggle" className="menu-toggle" aria-label={menu ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={menu} aria-controls="navigation" onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
    </header>

    <main id="main">
      <section className="hero" onPointerMove={moveArt} onPointerLeave={() => {if (heroArt.current) heroArt.current.style.transform = '';}} aria-labelledby="hero-title">
        <div className="hero-topline"><span>Белорусский государственный университет транспорта</span><span>Гомель, Беларусь</span></div>
        <div className="hero-content">
          <h1 id="hero-title">Создавать то,<br/>что <span>останется.</span></h1>
          <p>Дороги, которые соединяют. Системы, которые работают. Технологии, которые меняют города.</p>
          <a className="button primary" href="#territory">Посмотреть направления <ArrowDown size={19}/></a>
        </div>
        <figure className="hero-art" ref={heroArt}>
          <img src="/assets/bridge.webp" alt="Концептуальная инженерная модель вантового моста" width="1536" height="1024" fetchPriority="high"/>
          <figcaption>Концептуальная инженерная визуализация</figcaption>
        </figure>
      </section>

      <section className="territory" id="territory" aria-labelledby="territory-title">
        <div className="territory-intro" data-reveal>
          <h2 id="territory-title">Город — это<br/>не фон.</h2>
          <p>Это система, которую кто-то рассчитывает, строит и поддерживает. Выбери, за какую её часть будешь отвечать ты.</p>
        </div>
        <div className="territory-routes" aria-label="Четыре направления">
          {programs.map((item, index) => {
            const Icon = icons[item.icon];
            return <button key={item.id} className="territory-route" onClick={() => chooseProgram(item.id)} data-reveal>
              <span className="route-index">0{index + 1}</span><Icon size={30} strokeWidth={1.4}/>
              <span className="route-copy"><strong>{item.label}</strong><small>{item.lead}</small></span><ArrowUpRight size={22}/>
            </button>;
          })}
        </div>
      </section>

      <section className="programs-stage" id="programs" aria-labelledby="programs-title">
        <div className="programs-shell">
          <div className="programs-heading">
            <h2 id="programs-title">Четыре пути.<br/><span>Один масштаб.</span></h2>
            <p>Выбирай не название диплома, а задачи, которыми хочешь заниматься каждый день.</p>
          </div>
          <div className="program-browser">
            <div className="program-rail" role="tablist" aria-label="Направления подготовки">
              {programs.map((item, index) => {
                const Icon = icons[item.icon];
                return <button key={item.id} id={`tab-${item.id}`} role="tab" aria-selected={active === item.id} aria-controls="program-panel" tabIndex={active === item.id ? 0 : -1} onClick={() => setActive(item.id)} onKeyDown={(event) => {
                  const current = programs.findIndex((value) => value.id === active);
                  let next;
                  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (current + 1) % programs.length;
                  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (current + programs.length - 1) % programs.length;
                  if (event.key === 'Home') next = 0;
                  if (event.key === 'End') next = programs.length - 1;
                  if (next !== undefined) {
                    event.preventDefault();
                    setActive(programs[next].id);
                    document.getElementById(`tab-${programs[next].id}`).focus();
                  }
                }}><span>0{index + 1}</span><Icon size={22} strokeWidth={1.4}/><strong>{item.label}</strong></button>;
              })}
            </div>
            <div className="program-scene" id="program-panel" role="tabpanel" aria-labelledby={`tab-${active}`} key={active}>
              <div className="scene-main">
                <span className="program-code">{program.code}</span><h3>{program.lead}</h3><p>{program.description}</p>
                <div className="scene-stats"><div><strong>{program.years}</strong><span>{program.years === 4 ? 'года' : 'лет'} обучения</span></div><div><strong>{program.places}</strong><span>{program.places === 12 ? 'мест' : 'места'} в плане 2026</span></div></div>
              </div>
              <div className="scene-detail">
                <div className="scene-title"><h4>{program.title}</h4><span>{program.qualification}</span></div>
                <ul>{program.tasks.map((task) => <li key={task}><Check size={17}/>{task}</li>)}</ul>
                <div className="scene-career"><span>Где применять знания</span><p>{program.work}</p></div>
              </div>
            </div>
          </div>
          <div className="compare-row"><button aria-expanded={comparison} aria-controls="comparison-table" onClick={() => setComparison(!comparison)}>{comparison ? 'Скрыть сравнение' : 'Сравнить все четыре'}<ArrowRight size={18}/></button><span>Математика · Физика · Русский или белорусский язык</span></div>
          {comparison && <div id="comparison-table" className="comparison-table" role="region" aria-label="Сравнение специальностей" tabIndex="0"><table><caption>Дневная форма. План приёма 2026 года — справочные данные.</caption><thead><tr><th>Что сравниваем</th>{programs.map((item) => <th key={item.id}>{item.label}</th>)}</tr></thead><tbody><tr><th>Специальность</th>{programs.map((item) => <td key={item.id}>{item.title}</td>)}</tr><tr><th>Срок</th>{programs.map((item) => <td key={item.id}>{item.years} {item.years === 4 ? 'года' : 'лет'}</td>)}</tr><tr><th>Мест в плане 2026</th>{programs.map((item) => <td key={item.id}>{item.places}</td>)}</tr><tr><th>Квалификация</th>{programs.map((item) => <td key={item.id}>{item.qualification}</td>)}</tr><tr><th>Тебе может подойти, если интересны</th>{programs.map((item) => <td key={item.id}>{item.interests}</td>)}</tr></tbody></table></div>}
        </div>
      </section>

      <section className="experience" id="experience" aria-labelledby="experience-title">
        <div className="experience-head" data-reveal><h2 id="experience-title">Не пять лет<br/>конспектов.</h2><p>Инженер растёт не от количества лекций. Он учится видеть систему, проверять решение и отвечать за результат.</p></div>
        <div className="experience-track">
          <article className="experience-step theory" data-reveal><span>Младшие курсы</span><h3>Разобраться<br/>в основе.</h3><p>Математика, физика и инженерная база дают язык, на котором устроены реальные объекты.</p></article>
          <article className="experience-step practice-step" data-reveal><span>Практика</span><h3>Проверить<br/>руками.</h3><p>Можно получить рабочую профессию и познакомиться с производством не по презентации.</p></article>
          <article className="experience-step project" data-reveal><span>Старшие курсы</span><h3>Собрать<br/>решение.</h3><p>Курсовые и дипломные проекты связывают расчёт с задачами предприятий и инфраструктуры.</p></article>
        </div>
      </section>

      <section className="outcome" aria-labelledby="outcome-title">
        <div className="outcome-word" aria-hidden="true">ИНЖЕНЕР</div>
        <div className="outcome-content" data-reveal><h2 id="outcome-title">Диплом — не финал.<br/><span>Это право принимать решения.</span></h2><div className="outcome-cases"><p>Проектировать транспортную инфраструктуру.</p><p>Развивать инженерные сети городов.</p><p>Создавать цифровые инструменты для производства.</p><p>Продолжить обучение в магистратуре.</p></div></div>
      </section>

      <section className="admission" id="admission" aria-labelledby="admission-title">
        <div className="admission-header" data-reveal><h2 id="admission-title">Поступление<br/>без квеста.</h2><p>Кампания 2026 года завершилась. Следующий план и даты появятся после официальной публикации БелГУТ.</p></div>
        <ol className="admission-path">
          <li data-reveal><span>01</span><div><h3>Выбери направление</h3><p>Сравни задачи будущей работы, квалификацию и срок обучения.</p><a href="#programs">Вернуться к специальностям <ArrowUpRight size={16}/></a></div></li>
          <li data-reveal><span>02</span><div><h3>Готовь три предмета</h3><p>Математика, физика и русский или белорусский язык — ЦЭ или ЦТ.</p><External href={source.faculty}>Проверить требования</External></div></li>
          <li data-reveal><span>03</span><div><h3>Уточни свой конкурс</h3><p>Документы, целевое обучение и сроки зависят от кампании и твоей ситуации.</p><a href="#contacts">Задать вопрос факультету <ArrowUpRight size={16}/></a></div></li>
        </ol>
      </section>

      <section className="contact" id="contacts" aria-labelledby="contact-title">
        <div className="contact-main" data-reveal><h2 id="contact-title">Начни<br/>с разговора.</h2><a className="contact-phone" href="tel:+375232952192">+375 (232) 95-21-92 <ArrowUpRight size={35}/></a><p>Деканат строительного факультета · кабинет 564</p></div>
        <address className="contact-address"><span>Белорусский государственный университет транспорта</span><strong>Гомель<br/>ул. Кирова, 34</strong><External href={source.official}>Страница факультета на bsut.by</External></address>
      </section>
    </main>

    <footer className="footer"><a href="#" className="footer-name">БелГУТ <span>Строительный факультет</span></a><div><a href="/sources.html">Источники данных</a><span>Информационный проект · 2026</span></div></footer>
  </>;
}

createRoot(document.getElementById('root')).render(<App/>);
