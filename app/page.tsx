"use client";

import { useState, useEffect } from 'react';
import './style.css';

// --- DATA ---
const UNITS = [
    {
      id:1, name:'Syntax & Structure',
      levels:[
        {id:1,title:'Hello World',sub:'Your first line of Python',q:'Which built-in outputs text to the terminal?',code:'<span class="cb">___</span>(<span class="cs">"Hello, World!"</span>)',opts:['echo','print','write','log'],correct:1,reward:10},
        {id:2,title:'Variables',sub:'Binding names to values',q:'What operator assigns 42 to the variable score?',code:'score <span class="cb">___</span> 42',opts:['==',':=','=','->'],correct:2,reward:15},
        {id:3,title:'Conditionals',sub:'Branching logic',q:'Fill in the blank to make a valid if-statement.',code:'<span class="cb">___</span> score > 0:\n    <span class="cf">print</span>(<span class="cs">"Positive"</span>)',opts:['if','when','check','then'],correct:0,reward:20},
        {id:4,title:'For Loops',sub:'Repeating with range',q:'Which argument makes range() loop exactly 5 times?',code:'<span class="ck">for</span> i <span class="ck">in</span> <span class="cf">range</span>(<span class="cb">___</span>):\n    <span class="cf">print</span>(i)',opts:['1,5','5','0,4','item'],correct:1,reward:25},
        {id:5,title:'Functions',sub:'Reusable blocks',q:'Which keyword defines a function in Python?',code:'<span class="cb">___</span> <span class="cf">greet</span>():\n    <span class="ck">return</span> <span class="cs">"Hello"</span>',opts:['func','define','def','fn'],correct:2,reward:50},
      ]
    },
    {
      id:2, name:'Data Structures',
      levels:[
        {id:6,title:'Lists',sub:'Ordered collections',q:'Which syntax creates an empty list?',code:'items <span class="ck">=</span> <span class="cb">___</span>',opts:['{}','()','[]','<>'],correct:2,reward:20},
        {id:7,title:'Indexing',sub:'Access by position',q:'How do you access the first element of a list?',code:'first <span class="ck">=</span> items[<span class="cb">___</span>]',opts:['1','-1','0','first'],correct:2,reward:20},
        {id:8,title:'Dictionaries',sub:'Key-value pairs',q:'Which syntax creates a dictionary?',code:'user <span class="ck">=</span> <span class="cb">{ }</span> <span class="cs">"name"</span><span class="ck">:</span> <span class="cs">"Ada"</span>',opts:['[ ]','( )','{ }','< >'],correct:2,reward:25},
        {id:9,title:'Append',sub:'Adding to lists',q:'Which method adds an item to the end of a list?',code:'items.<span class="cb">___</span>(<span class="cs">"new"</span>)',opts:['add','insert','push','append'],correct:3,reward:25},
        {id:10,title:'Length',sub:'Measuring collections',q:'Which function returns the number of items in a list?',code:'count <span class="ck">=</span> <span class="cb">___</span>(items)',opts:['size','count','length','len'],correct:3,reward:30},
      ]
    },
    {
      id:3, name:'String Mastery',
      levels:[
        {id:11,title:'f-Strings',sub:'Interpolating values',q:'Which prefix creates an f-string?',code:'msg <span class="ck">=</span> <span class="cb">___</span><span class="cs">"Score: {score}"</span>',opts:['s"','f"','t"','r"'],correct:1,reward:25},
        {id:12,title:'Upper',sub:'Changing case',q:'What converts a string to all uppercase?',code:'result <span class="ck">=</span> name.<span class="cb">___</span>()',opts:['capitalize','upper','toUpper','toUpperCase'],correct:1,reward:20},
        {id:13,title:'Split',sub:'Breaking strings apart',q:'Which method splits a string into a list of words?',code:'words <span class="ck">=</span> sentence.<span class="cb">___</span>()',opts:['divide','cut','split','slice'],correct:2,reward:20},
        {id:14,title:'Strip',sub:'Removing whitespace',q:'Which removes leading and trailing whitespace?',code:'clean <span class="ck">=</span> text.<span class="cb">___</span>()',opts:['clean','trim','remove','strip'],correct:3,reward:25},
        {id:15,title:'Join',sub:'Combining strings',q:'Which method joins a list into a single string?',code:'result <span class="ck">=</span> <span class="cs">", "</span>.<span class="cb">___</span>(words)',opts:['combine','merge','concat','join'],correct:3,reward:30},
      ]
    }
  ];
  
  const ALL = UNITS.flatMap(u => u.levels.map(l => ({...l,unit:u})))
  const TOTAL = ALL.length;
  
  const BOTS=[{name:'Aiko',xp:38000,av:'bot1'},{name:'Renz',xp:25000,av:'bot2'},{name:'Nova',xp:14000,av:'bot3'},{name:'Zuko',xp:8000,av:'bot4'}];
  
  const OB=[
    {g:'⌘',h:'kill<em>Streak</em>',p:'The most refined way to master Python. One question at a time.'},
    {g:'⌥',h:'Guard Your <em>Streak</em>',p:'Every wrong answer breaks your streak and costs 5 gems. Stay sharp.'},
    {g:'◈',h:'Climb the <em>Rankings</em>',p:'Earn gems and XP for every correct answer. Reach the top.'},
  ];

export default function Page() {
    const [S, setS] = useState({
        streak: 0, gems: 100,
        xp: 0, qi: 0,
        best: 0, sel: null
      });
      const [onboarded, setOnboarded] = useState(false);
      const [obStep, setObStep] = useState(0);
      const [view, setView] = useState('learn'); // learn | rank
      const [challenge, setChallenge] = useState(null);
      const [feedback, setFeedback] = useState(null); // {type: 'ok' | 'err', em: '', body: '', act: ''}
      const [done, setDone] = useState(false);
    
      useEffect(() => {
        if (localStorage.getItem('ks_ob') === '1') {
          setOnboarded(true);
          boot();
        }
      }, []);
    
      const boot = () => {
        const savedState = {
          streak: +localStorage.getItem('ks_s')||0,
          gems: +localStorage.getItem('ks_g')||100,
          xp: +localStorage.getItem('ks_x')||0,
          qi: +localStorage.getItem('ks_q')||0,
          best: +localStorage.getItem('ks_b')||0,
          sel: null
        };
        setS(savedState);
        if (savedState.qi >= TOTAL) {
          setDone(true);
        }
      };
    
      const save = (newState) => {
        localStorage.setItem('ks_s', newState.streak);
        localStorage.setItem('ks_g', newState.gems);
        localStorage.setItem('ks_x', newState.xp);
        localStorage.setItem('ks_q', newState.qi);
        localStorage.setItem('ks_b', newState.best);
      };
    
      const handleObNext = () => {
        const nextStep = obStep + 1;
        if (nextStep >= OB.length) {
          localStorage.setItem('ks_ob', '1');
          setOnboarded(true);
          boot();
        } else {
          setObStep(nextStep);
        }
      };
    
      const openChallenge = (lv) => {
        setChallenge(lv);
        setS(prev => ({ ...prev, sel: null }));
      };
    
      const onCheck = () => {
        const lv = ALL[S.qi];
        if (!lv || S.sel === null) return;
    
        if (S.sel === lv.correct) {
          const newState = {
            ...S,
            gems: S.gems + lv.reward,
            xp: S.xp + lv.reward * 10,
            streak: S.streak + 1,
            best: Math.max(S.best, S.streak + 1),
            qi: S.qi + 1
          };
          setS(newState);
          save(newState);
    
          setFeedback({
            type: 'ok',
            em: 'Correct.',
            body: `+${lv.reward} gems earned. Streak: ${newState.streak}`,
            act: newState.qi >= TOTAL ? 'View Results →' : 'Next Level →'
          });
        } else {
          const newState = {
            ...S,
            gems: Math.max(0, S.gems - 5),
            streak: 0
          };
          setS(newState);
          save(newState);
    
          setFeedback({
            type: 'err',
            em: 'Wrong.',
            body: 'Streak lost. −5 gems. Study the code and try again.',
            act: 'Try Again'
          });
        }
        setChallenge(null);
      };
    
      const handleFeedbackAck = () => {
        if (feedback.type === 'ok' && S.qi >= TOTAL) {
          setDone(true);
        }
        setFeedback(null);
      };
    
      const handleRestart = () => {
        const newState = {
          streak: 0, gems: 100, xp: 0, qi: 0, best: 0, sel: null
        };
        setS(newState);
        save(newState);
        setDone(false);
      };

      if (!onboarded) {
        const o = OB[obStep];
        return (
          <div className="ob">
            <div className="ob-body">
              <div className="ob-glyph" dangerouslySetInnerHTML={{ __html: o.g }}></div>
              <div className="ob-h" dangerouslySetInnerHTML={{ __html: o.h }}></div>
              <div className="ob-p">{o.p}</div>
            </div>
            <div className="ob-foot">
              <div className="ob-dots">
                {OB.map((_, i) => <div key={i} className={`ob-dot ${i === obStep ? 'on' : ''}`}></div>)}
              </div>
              <button className="ob-btn" onClick={handleObNext}>
                {obStep === OB.length - 1 ? 'Start Learning →' : 'Continue'}
              </button>
            </div>
          </div>
        );
      }
    
      if (done) {
        return (
          <div className="done-screen on">
            <div className="done-glyph">✦</div>
            <div className="done-h">All Levels Complete.</div>
            <div className="done-sub">You've finished all 3 units. More content arriving soon.</div>
            <div className="done-stats">
              <div className="done-stat"><div className="done-val">{S.gems}</div><div className="done-lbl">Gems</div></div>
              <div className="done-stat"><div className="done-val">{S.best}</div><div className="done-lbl">Best</div></div>
              <div className="done-stat"><div className="done-val">{S.xp}</div><div className="done-lbl">XP</div></div>
            </div>
            <button className="done-restart" onClick={handleRestart}>Restart Journey</button>
          </div>
        );
      }
    
      const pct = Math.round((S.qi / TOTAL) * 100);

    return (
        <div className="shell on">
            <header className="topbar">
                <div className="wordmark">Skill<em>Streak</em></div>
                <div className="chips">
                <div className="chip"><div className="cdot f"></div><span>{S.streak}</span></div>
                <div className="chip"><div className="cdot g"></div><span>{S.gems}</span></div>
                </div>
            </header>
        
            <div className="main">
                {view === 'learn' && (
                <div className="view on">
                    <div className="path-view">
                    <div className="unit-hd">
                        <div className="unit-label">Python · Beginner</div>
                        <div className="unit-name">Syntax &amp; <em>Structure</em></div>
                        <div className="prog-row">
                        <div className="prog-track"><div className="prog-bar" style={{width: `${pct}%`}}></div></div>
                        <div className="prog-num">{S.qi}/{TOTAL}</div>
                        </div>
                    </div>
                    <div className="levels">
                        {UNITS.map(unit => (
                        <>
                            <div className="unit-sep" key={unit.id}>
                            <span className="sep-label">Unit {unit.id}</span><span className="sep-name">{unit.name}</span><div className="sep-line"></div>
                            </div>
                            {unit.levels.map((lv, i) => {
                            const gi = ALL.findIndex(l => l.id === lv.id);
                            const state = gi < S.qi ? 'done' : gi === S.qi ? 'active' : 'locked';
                            const tag = state === 'done' ? 'complete' : state === 'active' ? 'current' : 'locked';
                            return (
                                <div className={`level-item ${state}`} key={lv.id}>
                                <div className="spine">
                                    <div className="s-dot"></div><div className="s-line"></div>
                                </div>
                                <div className={`lv-card ${state === 'active' ? 'tap' : ''}`} onClick={() => state === 'active' && openChallenge(lv)}>
                                    <div className="lv-top">
                                    <div className="lv-num">Level {i + 1}</div>
                                    <div className="lv-tag">{tag}</div>
                                    </div>
                                    <div className="lv-title">{lv.title}</div>
                                    <div className="lv-sub">{lv.sub}</div>
                                    {state !== 'locked' && (
                                    <div className="lv-footer">
                                        <div className="lv-gems"><div className="lv-gd"></div>{lv.reward} gems</div>
                                        {state === 'active' && <div className="lv-arrow">→</div>}
                                    </div>
                                    )}
                                </div>
                                </div>
                            );
                            })}
                        </>
                        ))}
                    </div>
                    </div>
                </div>
                )}
        
                {view === 'rank' && (
                <div className="view on">
                    <Leaderboard xp={S.xp} />
                </div>
                )}
            </div>
        
            <nav className="botnav">
                <button className={`nav-btn ${view === 'learn' ? 'on' : ''}`} onClick={() => setView('learn')}> 
                <div className="nav-ic">⊞</div><span>Learn</span>
                </button>
                <button className={`nav-btn ${view === 'rank' ? 'on' : ''}`} onClick={() => setView('rank')}> 
                <div className="nav-ic">◈</div><span>Rank</span>
                </button>
            </nav>

            {challenge && (
                <div className="overlay on">
                    <div className="sheet">
                        <div className="sh-handle"><div className="sh-bar"></div></div>
                        <div className="sh-hd">
                        <div className="sh-fname">level_{challenge.id}.py</div>
                        <div className="sh-reward">+{challenge.reward} gems</div>
                        <button className="sh-close" onClick={() => setChallenge(null)}>✕</button>
                        </div>
                        <div className="sh-body">
                        <div><div className="brief-lbl">Mission</div><div className="brief-q">{challenge.q}</div></div>
                        <div className="code-wrap">
                            <div className="code-bar"><div className="d r"></div><div className="d y"></div><div className="d g"></div><div className="code-tag">python</div></div>
                            <div className="code-inner" dangerouslySetInnerHTML={{ __html: challenge.code }}></div>
                        </div>
                        <div>
                            <div className="opts-lbl">Pick the correct answer</div>
                            <div className="opts-grid">
                            {challenge.opts.map((o, i) => (
                                <button key={i} className={`opt ${S.sel === i ? 'on' : ''}`} onClick={() => setS(prev => ({...prev, sel: i}))}>
                                {o}
                                </button>
                            ))}
                            </div>
                        </div>
                        </div>
                        <div className="sh-ft"><button className="check-btn" disabled={S.sel === null} onClick={onCheck}>Check Answer</button></div>
                    </div>
                </div>
            )}

            {feedback && (
                <div className="fb-ov on">
                    <div className={`fb-sheet ${feedback.type}`}>
                        <div className="fb-em">{feedback.em}</div>
                        <div className="fb-body">{feedback.body}</div>
                        <button className="fb-act" onClick={handleFeedbackAck}>{feedback.act}</button>
                    </div>
                </div>
            )}
    </div>
    )
}

const Leaderboard = ({ xp }) => {
    const me = { name: 'You', xp, av: 'Alpha', me: true };
    const all = [...BOTS, me].sort((a, b) => b.xp - a.xp);
    const rank = all.findIndex(u => u.me) + 1;
    const rc = ['g', 's', 'b'];
  
    return (
      <div className="lb-view">
        <div className="lb-title">Rankings</div>
        <div className="lb-sub">Weekly · Global</div>
        <div className="lb-you">
          <div className="lb-you-rank">#{rank}</div>
          <img className="lb-av" src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=You" alt="" />
          <div className="lb-you-name">You</div>
          <div className="lb-you-xp">{xp.toLocaleString()} XP</div>
        </div>
        <div className="lb-rows">
          {all.map((u, i) => (
            <div className="lb-row" key={u.name}>
              <div className={`lb-rrank ${rc[i] || ''}`}>{['①', '②', '③'][i] || `#${i + 1}`}</div>
              <img className="lb-av" src={`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${u.av || u.name}`} alt="" />
              <div className="lb-rname">{u.name}</div>
              <div className="lb-rxp">{u.xp.toLocaleString()} XP</div>
            </div>
          ))}
        </div>
      </div>
    );
  };