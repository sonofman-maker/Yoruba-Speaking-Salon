# Yorùbá Speaking Salon

Heritage-speaker calibrated Yorùbá production drills. Tap-to-build sentence exercises with ElevenLabs audio (Olufunmilola, Nigerian-accented Yorùbá voice).

## What it does

- Generates Yorùbá word-bank exercises adapted to your focus (aspect markers, pronouns, greetings, negation, questions)
- All tone marks pre-loaded into tappable tiles — no Yorùbá keyboard needed
- ElevenLabs TTS for natural pronunciation; falls back to browser TTS on Chrome/Android
- Adaptive difficulty — climbs on streaks, eases when you stumble
- Built-in cheat sheet for aspect markers, negation forms, and pronouns
- Tracks recent questions to avoid repetition

## Stack

- React + Vite
- Anthropic API (question generation)
- ElevenLabs API (text-to-speech)

## Local development

```
npm install
npm run dev
```

Then open http://localhost:5173.

## Deploy

Auto-deploys to Vercel on push to main branch.

## API keys

- ElevenLabs key is entered by the user at runtime, stored in browser `localStorage`. Never sent anywhere except ElevenLabs.
- Anthropic key is handled by the artifact runtime / hosting environment.
