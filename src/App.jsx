import React, { useState, useEffect } from 'react';

const FOCUS_AREAS = [
  {
    id: 'all-systems',
    label: 'Gbogbo è',
    english: 'Everything mixed',
    sub: 'Aspect, pronouns, register, negation — all together',
    detail: 'ń · ti · máa · máa ń · pronouns · ìkíni · negation',
  },
  {
    id: 'aspect',
    label: 'Àkókò àti ìṣe',
    english: 'Aspect markers',
    sub: 'The engine of Yorùbá time — what receptive bilinguals miss',
    detail: 'ń (progressive) · ti (perfect) · máa / yóò (future) · máa ń (used to) · ti ń (was -ing)',
  },
  {
    id: 'pronouns',
    label: 'Ọ̀rọ̀-arọ́pò',
    english: 'Pronouns & tone',
    sub: 'mo / èmi, o / ìwọ — short vs emphatic',
    detail: 'subject (mo, o, ó, à, ẹ, wọ́n) vs emphatic (èmi, ìwọ, òun, àwa, ẹ̀yin, àwọn)',
  },
  {
    id: 'greetings',
    label: 'Ìkíni',
    english: 'Greetings & register',
    sub: 'When to use ẹ vs o — the social fluency gap',
    detail: 'ẹ kú àárọ̀ · káàárọ̀ · ẹ kú ọ̀sán · ẹ kú ìṣẹ́ · ẹ jọ̀wọ́ · ẹ ṣé · address forms',
  },
  {
    id: 'questions-negation',
    label: 'Ìbéèrè & ìkọ̀',
    english: 'Questions & negation',
    sub: 'Pairing the right negator with the right aspect',
    detail: 'ṣé · ǹjẹ́ · tani · kí · níbo · báwo · kò · kì í · kò ní',
  },
];

const FLAVORS = [
  { id: 'mixed', label: 'Mixed contexts' },
  { id: 'family', label: 'Family & home' },
  { id: 'casual', label: 'Friends & casual' },
  { id: 'work', label: 'Work & formal' },
  { id: 'narrative', label: 'Storytelling' },
];

const ASPECT_MARKERS = [
  { marker: 'ø', meaning: 'simple past / general', example: 'Mo lọ', gloss: 'I went / I go' },
  { marker: 'ń', meaning: 'progressive / habitual', example: 'Mo ń jẹun', gloss: 'I am eating' },
  { marker: 'ti', meaning: 'perfect — already done', example: 'Mo ti jẹun', gloss: 'I have eaten' },
  { marker: 'máa', meaning: 'future — will', example: 'Mo máa jẹun', gloss: 'I will eat' },
  { marker: 'yóò', meaning: 'future — formal/written', example: 'Mo yóò jẹun', gloss: 'I will eat' },
  { marker: 'máa ń', meaning: 'habitual past — used to', example: 'Mo máa ń jẹun', gloss: 'I used to eat' },
  { marker: 'ti ń', meaning: 'past progressive — was -ing', example: 'Mo ti ń jẹun', gloss: 'I had been eating' },
];

const NEGATIONS = [
  { form: 'kò / mi ò', use: 'general "not"', example: 'Mi ò jẹun', gloss: "I'm not / I didn't" },
  { form: 'kì í', use: 'habitual "doesn\'t usually"', example: 'Mi kì í jẹun', gloss: "I don't usually eat" },
  { form: 'kò ní / ò ní', use: 'future "won\'t"', example: 'Mi ò ní jẹun', gloss: "I won't eat" },
  { form: 'kò tíì', use: '"hasn\'t yet"', example: 'Mi ò tíì jẹun', gloss: "I haven't eaten yet" },
];

const PRONOUNS = [
  { person: '1sg', subj: 'mo', emph: 'èmi', en: 'I' },
  { person: '2sg', subj: 'o', emph: 'ìwọ', en: 'you (sg)' },
  { person: '3sg', subj: 'ó', emph: 'òun', en: 'he/she/it' },
  { person: '1pl', subj: 'à / a', emph: 'àwa', en: 'we' },
  { person: '2pl', subj: 'ẹ', emph: 'ẹ̀yin', en: 'you (pl/formal)' },
  { person: '3pl', subj: 'wọ́n', emph: 'àwọn', en: 'they' },
];

const SpeakerIcon = ({ size = 16, playing = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3z"/>
    {playing && <path d="M14 7c1.5 1 2.5 2.8 2.5 5s-1 4-2.5 5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/>}
    {playing && <path d="M17 4c2.5 1.5 4 4.5 4 8s-1.5 6.5-4 8" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/>}
  </svg>
);

const SpeakerOffIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3z"/>
    <path d="M16 9l5 5M21 9l-5 5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
  </svg>
);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sample(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function sampleN(arr, n) { return shuffle(arr).slice(0, n); }

// ============ VARIETY POOLS — seed the model so it doesn't pattern-match ============
const VERB_POOL = [
  // speech / cognition
  'sọ', 'sọ̀rọ̀', 'pe', 'kígbe', 'dáhùn', 'bi', 'jẹ́wọ́', 'jíròrò', 'parọ́',
  'rò', 'rántí', 'gbàgbé', 'mọ̀', 'fura', 'nírètí', 'yẹ̀wò', 'gbàgbọ́',
  // motion
  'lọ', 'wá', 'gbé', 'rìn', 'sá', 'fò', 'kúrò', 'padà', 'gòkè', 'sọ̀kalẹ̀', 'kọjá', 'wọ',
  // manipulation
  'mú', 'fún', 'gbà', 'ya', 'pa', 'gé', 'kọ́', 'kọ', 'jù', 'ti', 'fà', 'pamọ́', 'ṣí',
  // domestic / cooking
  'sè', 'jẹ', 'mu', 'pòn', 'fọ̀', 'gbá', 'pèsè', 'tà', 'rà', 'wọn',
  // perception / feeling
  'rí', 'wò', 'gbọ́', 'fọwọ́kàn', 'gbóòórùn', 'fẹ́ràn', 'kórìíra', 'bẹ̀rù', 'dùn', 'banújẹ́',
  // social / relational
  'bá', 'fẹ́', 'bí', 'kí', 'gba', 'fọwọ́sí', 'ranni',
  // states
  'dára', 'burú', 'tóbi', 'kéré', 'gùn', 'lágbára', 'rẹ̀wà', 'sàn', 'rọrùn', 'ṣòro', 'pé',
  // money / commerce
  'náwó', 'fipamọ́', 'gbówó', 'pin', 'lò',
];

const TOPIC_POOL = [
  'bargaining over yams or pepper at the market',
  'buying aṣọ ẹbí for an upcoming wedding',
  'naming ceremony — debating which name suits the baby',
  'Super Eagles vs another team — replaying a missed goal',
  'a phone call from Lagos to a relative abroad',
  'gossip about a cousin\'s new partner',
  'a parent reprimanding a child about school',
  'a grandmother telling a story about long ago',
  'cousins arguing whose jollof is the best',
  'cooking ẹ̀wà or ẹ̀fọ́ for unexpected visitors',
  'an argument about who left the gate open',
  'catching the danfo to work in Lagos traffic',
  'rainy season flooding the compound',
  'harmattan and dusty mornings',
  'power outage interrupting a Nollywood film',
  'school run chaos in the morning',
  'WhatsApp messages between friends about a party',
  'funeral arrangements for an elder',
  'an aunty asking when you\'ll get married',
  'negotiating with a mechanic over a repair',
  'praising a friend\'s new outfit at owambe',
  'older sibling teasing the younger one',
  'a teacher correcting a stubborn student',
  'a grandfather reminiscing about the village',
  'pastor praying over a congregation',
  'children playing suwe or oga in the yard',
  'a Nollywood plot twist',
  'ordering at a buka — ẹ̀wà àgòyín, pounded yam, ọbẹ̀',
  'two old classmates running into each other at a wedding',
  'convincing a stubborn friend to come to an event',
  'a market woman defending her prices',
  'a customer complaining politely to an elder vendor',
  'a child explaining why they came home late',
  'a couple deciding what to cook for sunday rice',
  'someone realizing they forgot something important',
  'a misunderstanding being cleared up over the phone',
  'someone teasing about a friend\'s English vs Yoruba accent',
  'an elder giving advice about marriage',
  'discussing fuel prices and queues',
  'an okada rider negotiating a fare',
];

const STRUCTURE_POOL = [
  'serial verb construction — V1 V2 working together (gbé wá, mú lọ, sá padà)',
  'relative clause with tí — "the X who/which..."',
  'cleft / focus sentence with ni — "It is X that..."',
  'conditional with bí ... bá — "if X, then Y"',
  'reported speech with pé — "she said that..."',
  'reason clause with nítorí pé — "because..."',
  'time clause with nígbà tí — "when..."',
  'before-clause with kí ... tó — "before X happened"',
  'comparative with ju ... lọ — "more than..."',
  'embedded question — "I don\'t know what/where/when..."',
  'sequential narration — ní àkọ́kọ́ ... lẹ́yìn náà ... ("first... then...")',
  'existential with wà — "X exists / X is at Y"',
  'possessive with ti — "the X of Y"',
  'imperative — a direct command or polite request',
  'emphatic / topicalization — "as for me / as for that..."',
  'negative habitual — kì í + verb ("doesn\'t usually...")',
  'simultaneous action — "while X was happening, Y..."',
  'purpose clause with kí ó lè — "so that he can..."',
  'idiomatic expression natural to a fluent speaker',
  'rhetorical question expecting agreement',
];

const REGISTER_NUANCES = [
  'a teasing tone between peers',
  'a slightly exasperated parent',
  'formal deference to an elder',
  'mock-formal between friends, almost ironic',
  'gentle correction',
  'genuine surprise or shock',
  'sympathetic / consoling',
  'matter-of-fact / informational',
  'playful / joking',
  'firm but respectful',
  'urgency — something needs to happen now',
  'reflective / reminiscing',
];

// Generate every acceptable answer string by including/excluding each occurrence of
// an optional tile. Order of required tiles is preserved; only optional tiles toggle.
function generateAcceptableVariants(correctTiles, optionalTiles) {
  if (!correctTiles || correctTiles.length === 0) return [];
  const optionalSet = new Set(optionalTiles || []);
  // Indices in correctTiles that are optional (by position, so duplicates are handled)
  const optionalPositions = [];
  correctTiles.forEach((tile, i) => {
    if (optionalSet.has(tile)) optionalPositions.push(i);
  });
  const n = optionalPositions.length;
  // Cap at 2^8 = 256 to be safe; n is realistically 0-3
  const maxMask = 1 << Math.min(n, 8);
  const variants = new Set();
  for (let mask = 0; mask < maxMask; mask++) {
    const skipIdx = new Set();
    optionalPositions.forEach((pos, i) => {
      if (!(mask & (1 << i))) skipIdx.add(pos);
    });
    const variant = correctTiles
      .filter((_, idx) => !skipIdx.has(idx))
      .join(' ')
      .trim();
    if (variant.length > 0) variants.add(variant);
  }
  return [...variants];
}

export default function App() {
  const [screen, setScreen] = useState('setup');
  const [focus, setFocus] = useState(null);
  const [flavor, setFlavor] = useState(FLAVORS[0]);
  const [difficulty, setDifficulty] = useState(68);
  const [question, setQuestion] = useState(null);
  const [bankTiles, setBankTiles] = useState([]);
  const [answerTiles, setAnswerTiles] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState({ correct: 0, total: 0, streak: 0, mistakes: [] });
  const [recentQs, setRecentQs] = useState([]); // [{prompt, yoruba}] last few
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoPlay, setAutoPlay] = useState(true);
  const [voiceState, setVoiceState] = useState({ checked: false, hasYoruba: false, voice: null });
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  // ElevenLabs integration — key persisted in browser localStorage only
  const [elevenLabsKey, setElevenLabsKey] = useState(() => {
    if (typeof window === 'undefined') return '';
    try { return window.localStorage.getItem('yo_elevenlabs_key') || ''; } catch { return ''; }
  });
  const [showKey, setShowKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState(null); // null | 'ok' | 'error' | 'checking'
  // Olufunmilola — African Female with Nigerian Accent (Yoruba)
  const ELEVENLABS_VOICE_ID = '9Dbo4hEvXQ5l7MXGZFQA';
  const ELEVENLABS_MODEL = 'eleven_v3';

  // Cache generated audio per text+rate so repeats don't burn credits
  const audioCacheRef = React.useRef(new Map());
  const currentAudioRef = React.useRef(null);

  const persistKey = (key) => {
    setElevenLabsKey(key);
    try {
      if (key) window.localStorage.setItem('yo_elevenlabs_key', key);
      else window.localStorage.removeItem('yo_elevenlabs_key');
    } catch {}
    setKeyStatus(null);
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setVoiceState({ checked: true, hasYoruba: false, voice: null });
      return;
    }
    const detect = () => {
      const voices = window.speechSynthesis.getVoices();
      const yo = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('yo'));
      setVoiceState({ checked: true, hasYoruba: !!yo, voice: yo || null });
    };
    detect();
    window.speechSynthesis.onvoiceschanged = detect;
    return () => { if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // Stop any currently playing audio (ElevenLabs <audio> or browser TTS)
  const stopSpeaking = () => {
    if (currentAudioRef.current) {
      try { currentAudioRef.current.pause(); } catch {}
      currentAudioRef.current = null;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  // Browser TTS fallback (used when no ElevenLabs key)
  const speakBrowser = (text, rate = 0.85) => {
    if (!text || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'yo-NG';
      if (voiceState.voice) u.voice = voiceState.voice;
      u.rate = rate;
      u.pitch = 1.0;
      u.onstart = () => setIsPlaying(true);
      u.onend = () => setIsPlaying(false);
      u.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(u);
    } catch {
      setIsPlaying(false);
    }
  };

  // ElevenLabs TTS — fetches MP3, caches by text+rate, plays via <audio>
  const speakElevenLabs = async (text, rate = 0.85) => {
    if (!text || !elevenLabsKey) return false;
    stopSpeaking();
    const cacheKey = `${rate}::${text}`;
    let url = audioCacheRef.current.get(cacheKey);
    try {
      if (!url) {
        setIsPlaying(true); // show loading state immediately
        const resp = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
          {
            method: 'POST',
            headers: {
              'xi-api-key': elevenLabsKey,
              'Content-Type': 'application/json',
              'Accept': 'audio/mpeg',
            },
            body: JSON.stringify({
              text,
              model_id: ELEVENLABS_MODEL,
              voice_settings: { stability: 0.5, similarity_boost: 0.75 },
            }),
          }
        );
        if (!resp.ok) {
          setIsPlaying(false);
          const errText = await resp.text().catch(() => '');
          if (resp.status === 401) {
            setKeyStatus('error');
            console.error('ElevenLabs: invalid API key');
          } else if (resp.status === 402) {
            setKeyStatus('error');
            console.error('ElevenLabs: payment required (probably a paid library voice)', errText);
          } else if (resp.status === 429) {
            console.error('ElevenLabs: rate limited or out of credits', errText);
          } else {
            console.error('ElevenLabs error:', resp.status, errText);
          }
          return false;
        }
        const blob = await resp.blob();
        url = URL.createObjectURL(blob);
        audioCacheRef.current.set(cacheKey, url);
        if (keyStatus !== 'ok') setKeyStatus('ok');
      }
      const audio = new Audio(url);
      currentAudioRef.current = audio;
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => { setIsPlaying(false); currentAudioRef.current = null; };
      audio.onerror = () => { setIsPlaying(false); currentAudioRef.current = null; };
      await audio.play();
      return true;
    } catch (e) {
      console.error('ElevenLabs playback error:', e);
      setIsPlaying(false);
      return false;
    }
  };

  // Unified entry point — prefers ElevenLabs if key present, else browser TTS
  const speak = (text, rate = 0.85) => {
    if (!text) return;
    if (elevenLabsKey) {
      speakElevenLabs(text, rate).then(ok => {
        if (!ok && voiceState.hasYoruba) speakBrowser(text, rate);
      });
    } else if (voiceState.hasYoruba) {
      speakBrowser(text, rate);
    }
  };

  // Audio is available if EITHER ElevenLabs key is set OR browser has a Yorùbá voice
  const audioAvailable = !!elevenLabsKey || voiceState.hasYoruba;

  useEffect(() => {
    if (!feedback || !question || !autoPlay || !audioAvailable) return;
    const t = setTimeout(() => speak(question.correctAnswer), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback]);

  const startLesson = () => {
    setStats({ correct: 0, total: 0, streak: 0, mistakes: [] });
    setRecentQs([]);
    setScreen('lesson');
    fetchQuestion(difficulty, []);
  };

  const buildTilesForQuestion = (q) => {
    const correct = (q.correctTiles || []).map((text, i) => ({ id: `c${i}-${Math.random().toString(36).slice(2, 7)}`, text }));
    const distractors = (q.distractorTiles || []).map((text, i) => ({ id: `d${i}-${Math.random().toString(36).slice(2, 7)}`, text }));
    return shuffle([...correct, ...distractors]);
  };

  const fetchQuestion = async (currentDifficulty, recentMistakes) => {
    setLoading(true);
    setError(null);
    setFeedback(null);
    setBankTiles([]);
    setAnswerTiles([]);
    stopSpeaking();

    const focusInstruction = {
      'all-systems': 'Mix freely across aspect markers (ń, ti, máa, máa ń, ti ń), pronouns (short vs emphatic), greetings/register, negation, focus, and question forms. Each item must hinge on a real grammatical choice forced by meaning.',
      'aspect': 'Every prompt must hinge on aspect: ń (progressive), ti (perfect "already"), máa or yóò (future), máa ń (habitual "used to"), ti ń (past progressive). The English must clearly force one specific marker via temporal/aspectual cues — but the cues should sometimes be implicit in the discourse rather than always lexical ("already", "used to"). E.g., a sentence like "By the time you arrived, we had finished cooking" forces ti or ti ń without saying "already".',
      'pronouns': 'Test pronoun choice — short forms (mo, o, ó, à, ẹ, wọ́n) vs emphatic forms (èmi, ìwọ, òun, àwa, ẹ̀yin, àwọn). Use prompts forcing emphatic ("It is I who...", "As for me...", "Me, I...", "Even her..."), or contrasting register. Also test pronoun + tone interactions — `ó` (he/she/it, high tone) vs `o` (you sg, mid tone) vs object `ọ́`.',
      'greetings': 'Test greetings, register choice (ẹ formal/elder/plural vs o peer/younger), address forms — ẹ kú àárọ̀, ẹ kú ọ̀sán, ẹ kú alẹ́, ẹ kú ìṣẹ́ (greeting someone working), ẹ kú ọjọ́, ẹ jọ̀wọ́, ẹ ṣé / o ṣé, ẹ káàbọ̀, ẹ kú àbọ̀, pẹ̀lẹ́, ẹ jọ̀wọ́. Include layered greetings — greeting + follow-up question, or greeting + condolence, or greeting + congratulation.',
      'questions-negation': 'Test question particles (ṣé, ǹjẹ́, tani, kí, níbo, báwo, mélòó, kí ló dé) and negation matched to aspect (kò/mi ò general, kì í habitual, kò ní future, kò tíì "not yet"). Also include negative questions, embedded questions, and rhetorical questions.',
    }[focus.id];

    const flavorInstruction = {
      'mixed': 'Vary contexts naturally — pull from the topic seed below.',
      'family': 'Family/home: parent-child, siblings, spouses, in-laws. Realistic Yoruba family dynamics — naming ceremonies, owambe, who is cooking, who came home late.',
      'casual': 'Friends/casual: peers gossiping, social plans, banter, opinions, teasing. Use casual register with o.',
      'work': 'Workplace/formal: meetings, requests to elders, professional context, formal letters or messages. Use ẹ register.',
      'narrative': 'Short narrative: anecdotes, descriptions of past events, sequenced actions. Good for aspect contrast within a sentence.',
    }[flavor.id];

    // Variety seeds — sampled fresh per call so the model can't pattern-match on training defaults
    const seedVerbs = sampleN(VERB_POOL, 6);
    const seedTopic = sample(TOPIC_POOL);
    const seedStructure = sample(STRUCTURE_POOL);
    const seedRegisterNuance = sample(REGISTER_NUANCES);

    // Recent-question avoidance list
    const recentBlocked = (recentQs || []).slice(0, 6);

    const prompt = `Generate ONE Yorùbá WORD-BANK exercise. The user TAPS TILES (with all tone marks pre-loaded) to assemble a Yorùbá sentence — no typing.

THE LEARNER PROFILE — IMPORTANT: This is a HERITAGE SPEAKER who grew up listening to Yorùbá. They understand the language fluently and have native-speaker intuitions on rhythm and lexicon. What they're bridging is PRODUCTIVE GRAMMAR — choosing the right particles, pronouns, register, and aspect when constructing on demand. Therefore:
- DO NOT generate beginner sentences ("I am eating", "She is going to school"). Those waste their time.
- DO generate sentences a real Yorùbá speaker would actually say in the target situation, with idiomatic flavor and natural complexity.
- Vary the verb, the topic, the structure, and the register from one question to the next. Repetition kills this practice.
- The grammatical "trick" of the question should be subtle, embedded in a real-world sentence — not a textbook example.

CRITICAL TONE RULE: Always write Yorùbá with correct tone marks and underdotted letters: à á è é ì í ò ó ù ú, ẹ ẹ́ ẹ̀, ọ ọ́ ọ̀, ṣ. Tones distinguish meaning. Never omit them.

LEARNER'S ACTIVE GRAMMAR:
- Aspect markers (BEFORE the verb): ń (progressive/habitual), ti (perfect "already"), máa or yóò (future "will"), máa ń (habitual "used to"), ti ń (past progressive)
- Subject pronouns (short): mo, o, ó, à/a, ẹ, wọ́n
- Emphatic pronouns: èmi, ìwọ, òun, àwa, ẹ̀yin, àwọn
- Negation matched to aspect: kò / mi ò, kì í, kò ní / ò ní, kò tíì
- Focus marker: ni
- Question words: ṣé, ǹjẹ́, tani, kí, níbo, báwo, mélòó, kí ló dé
- Register: ẹ (formal/elder/plural) vs o (peer/younger)
- Connectors and clause-linkers: tí, pé, nítorí pé, nígbà tí, kí ... tó, bí ... bá, ju ... lọ, lẹ́yìn náà
- Serial verbs: V1 V2 working as one event (gbé wá, mú lọ, sá padà, kọ́ jọ)

TODAY'S FOCUS: ${focus.english}
${focusInstruction}

CONTEXT FLAVOR: ${flavorInstruction}

═══ VARIETY SEEDS — use these to break out of default patterns ═══
- VERBS to consider drawing from (pick one or two, do not use all): ${seedVerbs.join(', ')}
- TOPIC / SCENE for this question: ${seedTopic}
- SENTENCE STRUCTURE to work with: ${seedStructure}
- TONE / REGISTER NUANCE: ${seedRegisterNuance}

You do NOT have to use every seed literally — they are inspiration. But the resulting sentence must feel meaningfully different from a generic textbook example. If the topic is "bargaining over yams," the sentence should sound like a market interaction, not "I am buying yams."

DIFFICULTY: ${currentDifficulty}/100 (heritage-speaker calibrated)
- 40-55: a meaningful, natural sentence with one core grammar point. 4-6 tiles. Real-world topic. NEVER a "Mo ń jẹun"-level toy sentence.
- 56-70: a meaningful sentence with one grammatical contrast or one connector/embedded element. 5-8 tiles, 3-4 distractors.
- 71-85: idiomatic register, embedded clause, serial verb, OR multi-clause structure. 6-9 tiles, 4-5 distractors including tone variants.
- 86-100: literary / proverbial / multi-clause / oríkì-flavored. 7-12 tiles, dense distractors. Allow Yoruba-as-Yoruba-people-actually-speak-it complexity.

${recentBlocked.length > 0 ? `═══ STRICTLY AVOID — RECENT QUESTIONS ═══
The user has just done these. DO NOT repeat them, near-duplicates, or sentences with the same verb + same aspect + same subject combination. Pick a different verb, different topic, different sentence shape:
${recentBlocked.map((q, i) => `${i + 1}. EN: "${q.prompt}" → YO: "${q.yoruba}"`).join('\n')}
` : ''}
${recentMistakes.length > 0 ? `\nRECENT MISTAKES TO REINFORCE (test the SAME CONCEPT in a COMPLETELY DIFFERENT sentence — different verb, different scene, different sentence shape): ${recentMistakes.slice(-3).map(m => m.concept).join('; ')}\n` : ''}

═══ CRITICAL WORD-ORDER TEMPLATES — DO NOT VIOLATE ═══
Multi-word aspect/negation particles always come AFTER the subject pronoun, never before. The shape is fixed:

  HABITUAL NEGATIVE (kì í — "doesn't usually"):
    Subject + kì í + Verb + (rest) + (mọ́)
    ✓ Ó kì í ṣeré lóde mọ́
    ✗ Kì í ó ṣeré lóde mọ́    ← NEVER. Subject must precede kì í.

  FUTURE NEGATIVE (kò ní / ò ní — "won't"):
    Subject + ò ní + Verb + (rest)
    ✓ Mi ò ní lọ          ✓ Wọn ò ní wá
    ✗ Ò ní mi lọ          ← NEVER

  PERFECT NEGATIVE (kò tíì — "hasn't yet"):
    Subject + ò tíì + Verb + (rest)
    ✓ Mi ò tíì jẹun       ✓ Ó tíì kò dé   — wrong order
    ✗ Tíì kò ó jẹun       ← NEVER

  PAST PROGRESSIVE (ti ń — "was -ing"):
    Subject + ti ń + Verb + (rest)
    ✓ Wọ́n ti ń jẹun nígbà tí mo dé
    ✗ Ti ń wọ́n jẹun       ← NEVER

  HABITUAL PAST (máa ń — "used to"):
    Subject + máa ń + Verb + (rest)
    ✓ Ó máa ń lọ síbẹ̀

  PERFECT (ti — "already"):
    Subject + ti + Verb + (rest)
    ✓ Mo ti jẹun
    For ti + "already" with adverbial: Subject + ti + Verb + tán/parí (or use "ti...tán" frame)

  FOCUS (ni — "it is X that"):
    [Focused element] + ni + (rest of clause)
    ✓ Èmi ni mo ṣe é     ("It is I who did it")
    ✓ Lọ́la ni màá lọ     ("It is tomorrow that I'll go")
    NOTE: when subject is focused, the resumptive pronoun follows ni.

These shapes are ALWAYS correct. Violating them produces ungrammatical sentences. Before finalizing, scan your correctTiles array and verify the subject pronoun appears BEFORE any aspect/negation particle.

WORD-BANK RULES:

1. The English prompt must be a sentence whose Yorùbá translation has UNAMBIGUOUS aspect/pronoun/register requirements driven by meaning. The English does not have to be simple — it can be naturalistic ("She wouldn't have come if you hadn't called", "Tell him not to wait", "By the time we got there, the food was already finished").

2. TILE GRANULARITY:
   - Single words → single tiles
   - Inseparable multi-word particles stay TOGETHER as one tile: "máa ń", "ti ń", "kò tíì", "kò ní", "ẹ kú", "kì í", "nítorí pé", "nígbà tí"
   - Each tile must include all tone marks and underdotted letters
   - Tiles do NOT contain punctuation

3. CORRECT TILES: in CORRECT ORDER. When joined with single spaces they form a natural Yorùbá sentence.

4. DISTRACTOR TILES: realistic errors a heritage speaker might make:
   - Wrong aspect marker (ń when answer needs ti; máa when answer needs máa ń; ti when answer needs ti ń)
   - Wrong pronoun (ó when answer needs mo; o when answer needs ẹ for register)
   - Tone-stripped variant of a real word (maa alongside correct máa; lo alongside lọ; ko alongside kọ́)
   - Wrong negation form for the aspect (kò when kì í is needed; kò when kò ní is needed)
   - Wrong connector (pé when tí is needed; nígbà when nítorí is needed)
   - Extra word that doesn't belong

5. UNIQUENESS: Every tile string must be unique (no exact duplicates between correct and distractor tiles, and no duplicate distractors).

6. The "explanation" must teach: name the English TRIGGER, state what Yorùbá form it requires and why, and briefly state what the most likely distractor would have meant.

7. The "concept" must be precise: e.g., "ti — perfect aspect", "máa ń — habitual past", "kò ní — future negation", "ẹ-register for elder", "emphatic pronoun after ni", "tí — relative clause", "nígbà tí + perfect — by the time".

8. OPTIONAL TILES. Some Yorùbá particles are grammatically OPTIONAL — appearing in the canonical form but a native speaker would accept the sentence without them, especially in speech. Candidates: "náà" (definite/anaphoric), "ni" (focus, sometimes), address tags like "sir/ma/ọ̀gá", emphatic particles like "lóòótọ́", "gan-an". In "optionalTiles", list ONLY tiles from correctTiles whose omission would still produce a fully grammatical sentence with substantively the same meaning. BE CONSERVATIVE. Most questions should have optionalTiles: []. Never mark required elements (subject pronoun, aspect marker, main verb, negation, question word, connector) as optional.

Respond with VALID JSON ONLY. No markdown fences. No preamble.

{
  "type": "word-bank",
  "prompt": "the English prompt sentence",
  "correctTiles": ["tile1", "tile2", "tile3"],
  "optionalTiles": [],
  "distractorTiles": ["distractor1", "distractor2"],
  "correctAnswer": "joined correct tiles with single spaces",
  "explanation": "Identify the English trigger. State what Yorùbá form it requires and why. Briefly state what the most likely distractor would have meant. If any tile is optional, note what it adds.",
  "concept": "specific tag",
  "trigger": "the English word/phrase that signals the required form",
  "vocabulary": [{"word":"...","translation":"..."}]
}`;

    try {
      const resp = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1400,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await resp.json();
      const raw = data.content.map(c => c.text || '').join('').trim();
      const cleaned = raw.replace(/```json|```/g, '').trim();
      const q = JSON.parse(cleaned);
      setQuestion(q);
      setBankTiles(buildTilesForQuestion(q));
      setAnswerTiles([]);
      // Track recent questions (keep last 6) so the model can avoid repeating
      setRecentQs(prev => {
        const entry = { prompt: q.prompt || '', yoruba: q.correctAnswer || '' };
        return [entry, ...prev].slice(0, 6);
      });
    } catch (e) {
      console.error(e);
      setError('Question generation hiccupped. Tap "Try again" below.');
    } finally {
      setLoading(false);
    }
  };

  const tapBankTile = (tile) => {
    if (feedback) return;
    setBankTiles(prev => prev.filter(t => t.id !== tile.id));
    setAnswerTiles(prev => [...prev, tile]);
  };

  const tapAnswerTile = (tile) => {
    if (feedback) return;
    setAnswerTiles(prev => prev.filter(t => t.id !== tile.id));
    setBankTiles(prev => [...prev, tile]);
  };

  const clearAnswer = () => {
    if (feedback) return;
    setBankTiles(prev => shuffle([...prev, ...answerTiles]));
    setAnswerTiles([]);
  };

  const submitAnswer = () => {
    if (!question || answerTiles.length === 0) return;
    const userAnswer = answerTiles.map(t => t.text).join(' ').trim();
    const canonical = (question.correctAnswer || question.correctTiles.join(' ')).trim();
    const optional = question.optionalTiles || [];

    const variants = generateAcceptableVariants(question.correctTiles, optional);
    const isCorrect = variants.includes(userAnswer) || userAnswer === canonical;
    const usedCanonical = userAnswer === canonical;

    // Which optional tiles did the user include vs. omit?
    const userTiles = answerTiles.map(t => t.text);
    const optionalUsed = optional.filter(o => userTiles.includes(o));
    const optionalOmitted = optional.filter(o => !userTiles.includes(o));

    setFeedback({
      correct: isCorrect,
      userAnswer,
      usedCanonical,
      canonical,
      optionalUsed,
      optionalOmitted,
    });

    const newMistakes = isCorrect
      ? stats.mistakes
      : [...stats.mistakes, {
          concept: question.concept,
          prompt: question.prompt,
          correct: canonical,
          trigger: question.trigger,
          attempted: userAnswer,
        }];

    const newStreak = isCorrect ? stats.streak + 1 : 0;
    setStats({
      correct: stats.correct + (isCorrect ? 1 : 0),
      total: stats.total + 1,
      streak: newStreak,
      mistakes: newMistakes,
    });

    setDifficulty(prev => {
      if (isCorrect) {
        const bump = newStreak >= 3 ? 5 : newStreak >= 1 ? 3 : 2;
        return Math.min(100, prev + bump);
      }
      return Math.max(35, prev - 4);
    });
  };

  const nextQuestion = () => fetchQuestion(difficulty, stats.mistakes);

  // ============ STYLES ============
  const palette = {
    paper: '#F0E9D5',
    ink: '#1A2845',
    inkSoft: '#445574',
    accent: '#9C3E2C',
    accentSoft: '#C4955A',
    success: '#4C6B43',
    cream: '#E3DAC2',
    creamDark: '#D5CBAF',
    rule: '#2A3858',
    indigoDeep: '#0F1A30',
  };

  const fontDisplay = "'Fraunces', 'Charter', serif";
  const fontBody = "'Inter', system-ui, sans-serif";
  const fontMono = "'JetBrains Mono', monospace";

  // ============ TILE COMPONENT ============
  const Tile = ({ tile, onTap, variant = 'bank' }) => {
    const isAnswer = variant === 'answer';
    const isCorrectTile = feedback && question.correctTiles.includes(tile.text);
    const isWrongInAnswer = feedback && isAnswer && !isCorrectTile;
    const isCorrectInAnswer = feedback && isAnswer && isCorrectTile;

    let bg = palette.paper;
    let color = palette.ink;
    let border = palette.rule;
    let shadowColor = palette.creamDark;

    if (isCorrectInAnswer) {
      bg = palette.success; color = palette.paper; border = palette.success;
      shadowColor = '#3a5234';
    } else if (isWrongInAnswer) {
      bg = palette.accent; color = palette.paper; border = palette.accent;
      shadowColor = '#7a3023';
    } else if (isAnswer) {
      bg = palette.ink; color = palette.paper; border = palette.ink;
      shadowColor = palette.indigoDeep;
    }

    const hasAudio = audioAvailable && !feedback;
    const baseShadow = feedback ? 'none' : `0 2px 0 ${shadowColor}`;

    return (
      <span style={{ display: 'inline-flex', alignItems: 'stretch', marginRight: '0.4rem', marginBottom: '0.4rem' }}>
        <button
          onClick={() => onTap(tile)}
          disabled={!!feedback}
          style={{
            padding: '0.55rem 0.85rem',
            background: bg,
            color,
            border: `1px solid ${border}`,
            borderRight: hasAudio ? 'none' : `1px solid ${border}`,
            cursor: feedback ? 'default' : 'pointer',
            fontFamily: fontDisplay,
            fontSize: '1.05rem',
            fontWeight: 500,
            letterSpacing: '0.01em',
            boxShadow: baseShadow,
            transition: 'transform 0.08s, box-shadow 0.08s',
            borderRadius: hasAudio ? '4px 0 0 4px' : '4px',
          }}
          onMouseDown={e => { if (!feedback) { e.currentTarget.style.transform = 'translateY(2px)'; e.currentTarget.style.boxShadow = `0 0 0 ${shadowColor}`; }}}
          onMouseUp={e => { if (!feedback) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = baseShadow; }}}
          onMouseLeave={e => { if (!feedback) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = baseShadow; }}}
        >
          {tile.text}
        </button>
        {hasAudio && (
          <button
            onClick={(e) => { e.stopPropagation(); speak(tile.text); }}
            title="Hear this word"
            style={{
              padding: '0 0.55rem',
              background: bg,
              color,
              border: `1px solid ${border}`,
              borderLeft: `1px solid ${isAnswer ? 'rgba(244,239,213,0.25)' : 'rgba(42,56,88,0.2)'}`,
              cursor: 'pointer',
              boxShadow: baseShadow,
              borderRadius: '0 4px 4px 0',
              display: 'flex', alignItems: 'center',
            }}>
            <SpeakerIcon size={13} />
          </button>
        )}
      </span>
    );
  };

  // ============ CHEAT SHEET ============
  const CheatSheet = ({ inline = false }) => (
    <div style={{
      background: inline ? 'transparent' : palette.cream,
      border: `1px solid ${palette.rule}`,
      padding: '1.25rem 1.5rem', marginBottom: inline ? '1.5rem' : '0',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', borderBottom: `1px solid ${palette.rule}`, paddingBottom: '0.5rem' }}>
        <h3 style={{ fontFamily: fontDisplay, fontSize: '1.1rem', fontWeight: 600, fontStyle: 'italic', margin: 0 }}>Quick reference</h3>
        <span style={{ fontFamily: fontMono, fontSize: '0.65rem', color: palette.inkSoft, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Ìrántí</span>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontFamily: fontMono, fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: palette.accent, marginBottom: '0.5rem' }}>Aspect markers</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <tbody>
            {ASPECT_MARKERS.map((m, i) => (
              <tr key={i} style={{ borderBottom: `1px solid rgba(42,56,88,0.12)` }}>
                <td style={{ fontFamily: fontDisplay, fontWeight: 600, padding: '0.4rem 0.5rem 0.4rem 0', color: palette.accent, whiteSpace: 'nowrap' }}>{m.marker}</td>
                <td style={{ padding: '0.4rem 0.5rem', color: palette.inkSoft, fontStyle: 'italic', fontFamily: fontDisplay }}>{m.meaning}</td>
                <td style={{ padding: '0.4rem 0.5rem', fontFamily: fontDisplay, fontWeight: 500 }}>{m.example}</td>
                <td style={{ padding: '0.4rem 0', color: palette.inkSoft, fontSize: '0.78rem' }}>{m.gloss}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontFamily: fontMono, fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: palette.accent, marginBottom: '0.5rem' }}>Negation by aspect</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <tbody>
            {NEGATIONS.map((n, i) => (
              <tr key={i} style={{ borderBottom: `1px solid rgba(42,56,88,0.12)` }}>
                <td style={{ fontFamily: fontDisplay, fontWeight: 600, padding: '0.4rem 0.5rem 0.4rem 0', color: palette.accent, whiteSpace: 'nowrap' }}>{n.form}</td>
                <td style={{ padding: '0.4rem 0.5rem', color: palette.inkSoft, fontStyle: 'italic', fontFamily: fontDisplay }}>{n.use}</td>
                <td style={{ padding: '0.4rem 0.5rem', fontFamily: fontDisplay, fontWeight: 500 }}>{n.example}</td>
                <td style={{ padding: '0.4rem 0', color: palette.inkSoft, fontSize: '0.78rem' }}>{n.gloss}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <div style={{ fontFamily: fontMono, fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: palette.accent, marginBottom: '0.5rem' }}>Pronouns</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${palette.rule}` }}>
              <th style={{ textAlign: 'left', padding: '0.3rem 0.5rem 0.3rem 0', fontFamily: fontMono, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500, color: palette.inkSoft }}> </th>
              <th style={{ textAlign: 'left', padding: '0.3rem 0.5rem', fontFamily: fontMono, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500, color: palette.inkSoft }}>Subject</th>
              <th style={{ textAlign: 'left', padding: '0.3rem 0.5rem', fontFamily: fontMono, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500, color: palette.inkSoft }}>Emphatic</th>
              <th style={{ textAlign: 'left', padding: '0.3rem 0', fontFamily: fontMono, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500, color: palette.inkSoft }}>English</th>
            </tr>
          </thead>
          <tbody>
            {PRONOUNS.map((p, i) => (
              <tr key={i} style={{ borderBottom: `1px solid rgba(42,56,88,0.12)` }}>
                <td style={{ padding: '0.4rem 0.5rem 0.4rem 0', fontFamily: fontMono, fontSize: '0.7rem', color: palette.inkSoft }}>{p.person}</td>
                <td style={{ padding: '0.4rem 0.5rem', fontFamily: fontDisplay, fontWeight: 600, color: palette.accent }}>{p.subj}</td>
                <td style={{ padding: '0.4rem 0.5rem', fontFamily: fontDisplay, fontWeight: 500 }}>{p.emph}</td>
                <td style={{ padding: '0.4rem 0', color: palette.inkSoft, fontFamily: fontDisplay, fontStyle: 'italic', fontSize: '0.82rem' }}>{p.en}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ fontSize: '0.78rem', color: palette.inkSoft, fontStyle: 'italic', fontFamily: fontDisplay, marginTop: '0.6rem', marginBottom: 0 }}>
          Emphatic forms appear at sentence start, after <em>ni</em> (focus), after prepositions, and standing alone.
        </p>
      </div>
    </div>
  );

  const VoiceStatusBanner = () => {
    if (!voiceState.checked || audioAvailable) return null;
    return (
      <div style={{
        padding: '0.75rem 1rem', background: 'rgba(156, 62, 44, 0.08)',
        border: `1px solid ${palette.accent}`, marginBottom: '1.5rem',
        fontSize: '0.82rem', fontFamily: fontBody, color: palette.ink,
        display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
      }}>
        <SpeakerOffIcon size={16} />
        <div>
          <strong style={{ fontWeight: 600 }}>No audio source yet.</strong>{' '}
          <span style={{ color: palette.inkSoft }}>
            Add an ElevenLabs API key below for high-quality Yorùbá voice (Olufunmilola, Nigerian accent). Or use Chrome/Android, which has a built-in Yorùbá voice. iOS/Safari has neither — tile drills still work without audio.
          </span>
        </div>
      </div>
    );
  };

  // ============ SETUP SCREEN ============
  if (screen === 'setup') {
    return (
      <div style={{ background: palette.paper, color: palette.ink, fontFamily: fontBody, minHeight: '100vh', padding: '2rem' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ borderBottom: `1px solid ${palette.rule}`, paddingBottom: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ fontFamily: fontMono, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: palette.inkSoft, marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
              <span>Speaking Salon</span>
              <span>Yorùbá · Tile drills</span>
            </div>
            <h1 style={{ fontFamily: fontDisplay, fontSize: 'clamp(2.4rem, 6vw, 4rem)', fontWeight: 600, lineHeight: 0.95, margin: 0 }}>
              Èdè <span style={{ fontStyle: 'italic', color: palette.accent }}>wa</span>
            </h1>
            <p style={{ fontFamily: fontDisplay, fontSize: '1.1rem', fontStyle: 'italic', color: palette.inkSoft, marginTop: '0.75rem', marginBottom: 0 }}>
              Heritage-speaker calibrated. Real sentences, varied verbs, idiomatic register. Tap tiles to build — all tone marks pre-loaded.
            </p>
          </div>

          <VoiceStatusBanner />

          {/* ElevenLabs API key input — high-quality Yorùbá voice */}
          <div style={{
            padding: '1rem 1.1rem', marginBottom: '2rem',
            border: `1px solid ${elevenLabsKey ? palette.success : palette.rule}`,
            background: elevenLabsKey ? 'rgba(76, 107, 67, 0.06)' : 'transparent',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
              <div>
                <div style={{ fontFamily: fontDisplay, fontSize: '1.05rem', fontWeight: 600, fontStyle: 'italic' }}>
                  ElevenLabs API key
                </div>
                <div style={{ fontFamily: fontBody, fontSize: '0.78rem', color: palette.inkSoft, marginTop: '0.2rem' }}>
                  {elevenLabsKey
                    ? 'Active — using Olufunmilola (Nigerian accent). Stored only in your browser.'
                    : 'Optional — paste your sk_… key for natural Yorùbá voice. Stored only in your browser, never sent anywhere except ElevenLabs.'}
                </div>
              </div>
              {elevenLabsKey && (
                <button
                  onClick={() => { persistKey(''); audioCacheRef.current.clear(); }}
                  style={{
                    background: 'transparent', border: `1px solid ${palette.rule}`,
                    fontFamily: fontMono, fontSize: '0.62rem', letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: palette.inkSoft,
                    padding: '0.3rem 0.6rem', cursor: 'pointer',
                  }}>
                  remove
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem' }}>
              <input
                type={showKey ? 'text' : 'password'}
                value={elevenLabsKey}
                onChange={(e) => persistKey(e.target.value.trim())}
                placeholder="sk_..."
                spellCheck={false}
                autoComplete="off"
                style={{
                  flex: 1, padding: '0.6rem 0.8rem',
                  background: palette.cream, border: `1px solid ${palette.rule}`,
                  fontFamily: fontMono, fontSize: '0.85rem', color: palette.ink,
                  borderRadius: '3px', boxSizing: 'border-box',
                }} />
              <button
                onClick={() => setShowKey(s => !s)}
                style={{
                  padding: '0 0.85rem', background: 'transparent', color: palette.ink,
                  border: `1px solid ${palette.rule}`, cursor: 'pointer',
                  fontFamily: fontMono, fontSize: '0.7rem', letterSpacing: '0.05em',
                }}>
                {showKey ? 'hide' : 'show'}
              </button>
              {elevenLabsKey && (
                <button
                  onClick={() => speak('Ẹ kú àárọ̀, báwo ni ara yín?')}
                  style={{
                    padding: '0 0.85rem', background: palette.ink, color: palette.paper,
                    border: `1px solid ${palette.ink}`, cursor: 'pointer',
                    fontFamily: fontMono, fontSize: '0.7rem', letterSpacing: '0.05em',
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  }}>
                  <SpeakerIcon size={12} playing={isPlaying} /> test
                </button>
              )}
            </div>
            {keyStatus === 'error' && (
              <div style={{ marginTop: '0.6rem', fontSize: '0.78rem', color: palette.accent, fontFamily: fontBody }}>
                Key rejected. Double-check it's pasted correctly and has Text-to-Speech permission.
              </div>
            )}
            {keyStatus === 'ok' && (
              <div style={{ marginTop: '0.6rem', fontSize: '0.78rem', color: palette.success, fontFamily: fontBody }}>
                Voice working — ready to practice.
              </div>
            )}
          </div>

          <button
            onClick={() => setShowCheatSheet(s => !s)}
            style={{
              width: '100%', padding: '0.85rem 1rem', marginBottom: showCheatSheet ? '0.75rem' : '2rem',
              background: 'transparent', color: palette.ink, border: `1px dashed ${palette.rule}`,
              cursor: 'pointer', fontFamily: fontMono, fontSize: '0.72rem',
              letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'left',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
            <span>{showCheatSheet ? '▾' : '▸'} Quick reference — aspect, negation, pronouns</span>
            <span style={{ color: palette.inkSoft }}>{showCheatSheet ? 'hide' : 'show'}</span>
          </button>
          {showCheatSheet && <div style={{ marginBottom: '2rem' }}><CheatSheet /></div>}

          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontFamily: fontMono, fontSize: '0.7rem', color: palette.accent }}>01</span>
              <h2 style={{ fontFamily: fontDisplay, fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Today's focus</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {FOCUS_AREAS.map(f => (
                <button key={f.id} onClick={() => setFocus(f)}
                  style={{
                    padding: '1.1rem 1.25rem',
                    background: focus?.id === f.id ? palette.ink : 'transparent',
                    color: focus?.id === f.id ? palette.paper : palette.ink,
                    border: `1px solid ${palette.rule}`, cursor: 'pointer', textAlign: 'left',
                    fontFamily: fontBody,
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ fontFamily: fontDisplay, fontSize: '1.25rem', fontWeight: 600, fontStyle: 'italic' }}>{f.label}</div>
                    <div style={{ fontFamily: fontMono, fontSize: '0.7rem', opacity: 0.7, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{f.english}</div>
                  </div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.85, marginTop: '0.2rem' }}>{f.sub}</div>
                  <div style={{ fontFamily: fontMono, fontSize: '0.7rem', opacity: 0.6, marginTop: '0.4rem' }}>{f.detail}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1rem' }}>
              <span style={{ fontFamily: fontMono, fontSize: '0.7rem', color: palette.accent }}>02</span>
              <h2 style={{ fontFamily: fontDisplay, fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Register & context</h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {FLAVORS.map(f => (
                <button key={f.id} onClick={() => setFlavor(f)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: flavor.id === f.id ? palette.accent : 'transparent',
                    color: flavor.id === f.id ? palette.paper : palette.ink,
                    border: `1px solid ${flavor.id === f.id ? palette.accent : palette.rule}`,
                    cursor: 'pointer', fontFamily: fontBody, fontSize: '0.9rem', borderRadius: '999px',
                  }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontFamily: fontMono, fontSize: '0.7rem', color: palette.accent }}>03</span>
              <h2 style={{ fontFamily: fontDisplay, fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Starting difficulty</h2>
              <span style={{ fontFamily: fontMono, fontSize: '0.85rem', color: palette.inkSoft, marginLeft: 'auto' }}>{difficulty}/100</span>
            </div>
            <input type="range" min="55" max="95" value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              style={{ width: '100%', accentColor: palette.accent }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fontMono, fontSize: '0.7rem', color: palette.inkSoft, marginTop: '0.4rem' }}>
              <span>Natural everyday speech</span>
              <span>Idiomatic, multi-clause, proverbial</span>
            </div>
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0.85rem 1rem', border: `1px solid ${palette.rule}`,
            marginBottom: '2rem', opacity: audioAvailable ? 1 : 0.5,
          }}>
            <div>
              <div style={{ fontFamily: fontDisplay, fontSize: '1rem', fontWeight: 600, fontStyle: 'italic' }}>Auto-play correct answer</div>
              <div style={{ fontSize: '0.8rem', color: palette.inkSoft, marginTop: '0.2rem' }}>
                {audioAvailable ? 'Plays the right Yorùbá when you submit' : 'No audio source available — add ElevenLabs key or use Chrome/Android'}
              </div>
            </div>
            <button
              onClick={() => audioAvailable && setAutoPlay(a => !a)}
              disabled={!audioAvailable}
              style={{
                width: '52px', height: '28px', position: 'relative',
                background: autoPlay && audioAvailable ? palette.accent : palette.cream,
                border: `1px solid ${palette.rule}`, borderRadius: '999px',
                cursor: audioAvailable ? 'pointer' : 'not-allowed', padding: 0,
              }}>
              <span style={{
                position: 'absolute', top: '2px', left: autoPlay && audioAvailable ? '26px' : '2px',
                width: '22px', height: '22px', background: palette.paper, borderRadius: '50%',
                transition: 'left 0.2s',
              }} />
            </button>
          </div>

          <button
            onClick={startLesson} disabled={!focus}
            style={{
              width: '100%', padding: '1.25rem',
              background: focus ? palette.ink : palette.cream,
              color: focus ? palette.paper : palette.inkSoft,
              border: 'none', cursor: focus ? 'pointer' : 'not-allowed',
              fontFamily: fontDisplay, fontSize: '1.2rem', fontWeight: 600, fontStyle: 'italic',
            }}>
            Ká bẹ̀rẹ̀ — let's begin →
          </button>
        </div>
      </div>
    );
  }

  // ============ LESSON SCREEN ============
  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  return (
    <div style={{ background: palette.paper, color: palette.ink, fontFamily: fontBody, minHeight: '100vh', padding: '1.5rem' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${palette.rule}`, paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
          <button onClick={() => { stopSpeaking(); setScreen('setup'); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: fontMono, fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: palette.inkSoft, padding: 0 }}>
            ← Setup
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {audioAvailable && (
              <button onClick={() => setAutoPlay(a => !a)}
                title={autoPlay ? 'Auto-play on' : 'Auto-play off'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: autoPlay ? palette.accent : palette.inkSoft, padding: '0.25rem' }}>
                {autoPlay ? <SpeakerIcon size={16} playing={isPlaying} /> : <SpeakerOffIcon size={16} />}
              </button>
            )}
            <button onClick={() => setShowCheatSheet(s => !s)}
              style={{ background: 'none', border: `1px solid ${palette.rule}`, cursor: 'pointer', fontFamily: fontMono, fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: palette.inkSoft, padding: '0.25rem 0.55rem' }}>
              {showCheatSheet ? '× ref' : 'ref'}
            </button>
            <div style={{ fontFamily: fontMono, fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: palette.inkSoft }}>
              {focus.english}
            </div>
          </div>
        </div>

        {showCheatSheet && <CheatSheet inline />}

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: fontMono, fontSize: '0.7rem', color: palette.inkSoft, marginBottom: '0.4rem' }}>
            <span>Ìṣòro {Math.round(difficulty)}/100</span>
            <span>{stats.correct}/{stats.total} · {accuracy}%{stats.streak > 1 ? ` · streak ${stats.streak}` : ''}</span>
          </div>
          <div style={{ height: '3px', background: palette.cream, position: 'relative' }}>
            <div style={{ height: '100%', width: `${difficulty}%`, background: palette.accent, transition: 'width 0.4s ease' }} />
          </div>
        </div>

        {loading && !question && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', fontFamily: fontDisplay, fontStyle: 'italic', fontSize: '1.2rem', color: palette.inkSoft }}>
            Mò ń múra ìdánwò náà…
          </div>
        )}

        {error && (
          <div style={{ padding: '1.5rem', border: `1px solid ${palette.accent}`, marginBottom: '1.5rem' }}>
            <p style={{ margin: 0, marginBottom: '1rem' }}>{error}</p>
            <button onClick={() => fetchQuestion(difficulty, stats.mistakes)}
              style={{ padding: '0.5rem 1rem', background: palette.ink, color: palette.paper, border: 'none', cursor: 'pointer', fontFamily: fontBody }}>
              Try again
            </button>
          </div>
        )}

        {question && !loading && (
          <div>
            <div style={{ fontFamily: fontMono, fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: palette.accent, marginBottom: '0.5rem' }}>
              Translate · {question.concept}
            </div>

            <div style={{
              fontFamily: fontDisplay, fontSize: 'clamp(1.4rem, 3.5vw, 1.95rem)', lineHeight: 1.4,
              fontWeight: 500, marginBottom: '1.5rem', padding: '1.5rem',
              background: palette.cream, borderLeft: `3px solid ${palette.accent}`,
            }}>
              {question.prompt}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontFamily: fontMono, fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: palette.inkSoft }}>
                  Your sentence
                </span>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  {audioAvailable && answerTiles.length > 0 && !feedback && (
                    <button
                      onClick={() => speak(answerTiles.map(t => t.text).join(' '))}
                      style={{
                        padding: '0.25rem 0.55rem', background: 'transparent', color: palette.inkSoft,
                        border: `1px solid ${palette.rule}`, cursor: 'pointer',
                        fontFamily: fontMono, fontSize: '0.62rem', letterSpacing: '0.1em',
                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                      }}>
                      <SpeakerIcon size={11} /> hear it
                    </button>
                  )}
                  {answerTiles.length > 0 && !feedback && (
                    <button onClick={clearAnswer}
                      style={{
                        padding: '0.25rem 0.55rem', background: 'transparent', color: palette.inkSoft,
                        border: `1px solid ${palette.rule}`, cursor: 'pointer',
                        fontFamily: fontMono, fontSize: '0.62rem', letterSpacing: '0.1em',
                      }}>
                      clear
                    </button>
                  )}
                </div>
              </div>
              <div style={{
                minHeight: '3.5rem', padding: '0.75rem 0.85rem 0.4rem',
                background: 'transparent',
                border: `1.5px ${answerTiles.length === 0 ? 'dashed' : 'solid'} ${palette.rule}`,
                display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start',
                borderRadius: '4px',
              }}>
                {answerTiles.length === 0 ? (
                  <span style={{ fontFamily: fontDisplay, fontStyle: 'italic', color: palette.inkSoft, fontSize: '0.95rem', padding: '0.55rem 0.2rem' }}>
                    Tap tiles below to build your sentence…
                  </span>
                ) : (
                  answerTiles.map(tile => <Tile key={tile.id} tile={tile} onTap={tapAnswerTile} variant="answer" />)
                )}
              </div>
            </div>

            {!feedback && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontFamily: fontMono, fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: palette.inkSoft, marginBottom: '0.5rem' }}>
                  Word bank{audioAvailable ? ' · tap 🔊 to hear a tile first' : ''}
                </div>
                <div style={{
                  minHeight: '3rem', padding: '0.75rem 0.85rem 0.4rem',
                  background: palette.cream, borderRadius: '4px',
                  display: 'flex', flexWrap: 'wrap',
                }}>
                  {bankTiles.length === 0 ? (
                    <span style={{ fontFamily: fontDisplay, fontStyle: 'italic', color: palette.inkSoft, fontSize: '0.9rem', padding: '0.4rem' }}>
                      All tiles used.
                    </span>
                  ) : (
                    bankTiles.map(tile => <Tile key={tile.id} tile={tile} onTap={tapBankTile} variant="bank" />)
                  )}
                </div>
              </div>
            )}

            {feedback && (
              <div style={{
                padding: '1.25rem 1.5rem',
                background: feedback.correct ? palette.success : palette.accent,
                color: palette.paper, marginBottom: '1.5rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ fontFamily: fontDisplay, fontSize: '1.3rem', fontWeight: 600, fontStyle: 'italic' }}>
                    {feedback.correct ? 'Bẹ́ẹ̀ ni — yes.' : 'Bẹ́ẹ̀ kọ́ — not quite.'}
                  </div>
                  {audioAvailable && (
                    <button
                      onClick={() => speak(question.correctAnswer)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.4rem 0.7rem',
                        background: 'rgba(244, 239, 213, 0.18)', color: palette.paper,
                        border: '1px solid rgba(244, 239, 213, 0.4)',
                        cursor: 'pointer', fontFamily: fontMono, fontSize: '0.72rem',
                        letterSpacing: '0.05em', borderRadius: '2px',
                      }}>
                      <SpeakerIcon size={13} playing={isPlaying} /> Hear it again
                    </button>
                  )}
                </div>

                <div style={{
                  fontFamily: fontDisplay, fontSize: '1.2rem', fontWeight: 500,
                  padding: '0.7rem 0.95rem', marginBottom: '0.75rem',
                  background: 'rgba(244,239,213,0.15)',
                  borderLeft: '2px solid rgba(244,239,213,0.5)',
                }}>
                  {question.correctAnswer}
                </div>

                {!feedback.correct && feedback.userAnswer && (
                  <div style={{ fontSize: '0.85rem', marginBottom: '0.75rem', opacity: 0.9 }}>
                    You built: <span style={{ fontFamily: fontDisplay, fontStyle: 'italic' }}>{feedback.userAnswer}</span>
                  </div>
                )}

                {feedback.correct && feedback.optionalOmitted && feedback.optionalOmitted.length > 0 && (
                  <div style={{
                    fontSize: '0.85rem', marginBottom: '0.75rem',
                    padding: '0.6rem 0.85rem',
                    background: 'rgba(244,239,213,0.12)',
                    borderLeft: '2px dashed rgba(244,239,213,0.5)',
                    fontFamily: fontDisplay, lineHeight: 1.45,
                  }}>
                    <strong style={{ fontWeight: 600 }}>Also valid with</strong>{' '}
                    {feedback.optionalOmitted.map((p, i) => (
                      <React.Fragment key={i}>
                        <span style={{ fontWeight: 600, fontStyle: 'italic' }}>{p}</span>
                        {i < feedback.optionalOmitted.length - 1 ? ', ' : ''}
                      </React.Fragment>
                    ))}{' '}
                    — these particles are optional here. Your shorter form is natural; the longer form is what you'd see in writing or when context isn't shared.
                  </div>
                )}

                {feedback.correct && feedback.optionalUsed && feedback.optionalUsed.length > 0 && feedback.optionalOmitted.length === 0 && (
                  <div style={{
                    fontSize: '0.82rem', marginBottom: '0.75rem',
                    fontFamily: fontDisplay, fontStyle: 'italic', opacity: 0.85,
                  }}>
                    You can also drop{' '}
                    {feedback.optionalUsed.map((p, i) => (
                      <React.Fragment key={i}>
                        <span style={{ fontWeight: 600 }}>{p}</span>
                        {i < feedback.optionalUsed.length - 1 ? ', ' : ''}
                      </React.Fragment>
                    ))}{' '}
                    in casual speech when context is clear.
                  </div>
                )}

                {question.trigger && (
                  <div style={{ fontSize: '0.85rem', fontFamily: fontMono, marginBottom: '0.75rem', opacity: 0.95 }}>
                    Trigger in English: <strong>{question.trigger}</strong>
                  </div>
                )}

                {question.explanation && (
                  <div style={{ fontSize: '0.9rem', opacity: 0.95, paddingTop: '0.75rem', borderTop: '1px solid rgba(244,239,213,0.25)', fontStyle: 'italic', fontFamily: fontDisplay, lineHeight: 1.5 }}>
                    {question.explanation}
                  </div>
                )}

                {question.vocabulary && question.vocabulary.length > 0 && (
                  <div style={{ marginTop: '0.75rem', fontFamily: fontMono, fontSize: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    {question.vocabulary.map((v, i) => (
                      <span key={i}><strong>{v.word}</strong> — {v.translation}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!feedback ? (
              <button onClick={submitAnswer}
                disabled={answerTiles.length === 0}
                style={{
                  width: '100%', padding: '1.1rem',
                  background: palette.ink, color: palette.paper, border: 'none',
                  cursor: answerTiles.length === 0 ? 'not-allowed' : 'pointer',
                  fontFamily: fontDisplay, fontSize: '1.15rem',
                  fontStyle: 'italic', fontWeight: 600,
                  opacity: answerTiles.length === 0 ? 0.4 : 1,
                }}>
                Ṣàyẹ̀wò — check
              </button>
            ) : (
              <button onClick={nextQuestion}
                style={{
                  width: '100%', padding: '1.1rem',
                  background: palette.ink, color: palette.paper, border: 'none',
                  cursor: 'pointer', fontFamily: fontDisplay, fontSize: '1.15rem',
                  fontStyle: 'italic', fontWeight: 600,
                }}>
                Sí iwájú — next →
              </button>
            )}
          </div>
        )}

        {stats.mistakes.length > 0 && !loading && (
          <details style={{ marginTop: '2.5rem', borderTop: `1px solid ${palette.rule}`, paddingTop: '1rem' }}>
            <summary style={{ cursor: 'pointer', fontFamily: fontMono, fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: palette.inkSoft }}>
              Láti tún wo ({stats.mistakes.length}) — to review
            </summary>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.mistakes.map((m, i) => (
                <div key={i} style={{ fontSize: '0.9rem', paddingLeft: '0.75rem', borderLeft: `2px solid ${palette.accentSoft}` }}>
                  <div style={{ fontFamily: fontMono, fontSize: '0.7rem', color: palette.accent, marginBottom: '0.2rem' }}>
                    {m.concept}{m.trigger ? ` · trigger: ${m.trigger}` : ''}
                  </div>
                  <div style={{ fontFamily: fontDisplay, fontStyle: 'italic', color: palette.inkSoft, fontSize: '0.9rem' }}>{m.prompt}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                    <div style={{ fontFamily: fontDisplay, fontSize: '1rem' }}>→ {m.correct}</div>
                    {audioAvailable && (
                      <button onClick={() => speak(m.correct)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: palette.inkSoft, padding: '0.1rem' }}>
                        <SpeakerIcon size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
