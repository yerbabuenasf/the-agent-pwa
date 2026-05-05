# The Agent — PWA

AI-powered rate negotiation for photographers, videographers, and the brands that hire them.

---

## What you need first

- **Node.js 18+** — download at https://nodejs.org (choose the LTS version)
- **A Claude API key** — get one free at https://console.anthropic.com

---

## Run it locally (step by step)

### 1. Open Terminal

On Mac: press `Cmd + Space`, type `Terminal`, hit Enter.

### 2. Navigate to this folder

```bash
cd path/to/the-agent-pwa
```

(Drag the folder onto the Terminal window to auto-fill the path.)

### 3. Install dependencies

```bash
npm install
```

This downloads everything the app needs. Takes about 30 seconds.

### 4. Add your Claude API key

Copy the example env file:

```bash
cp .env.example .env.local
```

Then open `.env.local` in any text editor and replace `your_claude_api_key_here` with your actual key:

```
ANTHROPIC_API_KEY=sk-ant-...your key here...
```

**Important:** Never share this file or commit it to GitHub. It's already in `.gitignore`.

### 5. Start the app

```bash
npm run dev
```

The app will open at **http://localhost:3000**

### 6. Test on your phone

While `npm run dev` is running, find your computer's local IP address:

- **Mac:** System Settings → Wi-Fi → click your network → note the IP (e.g. `192.168.1.42`)

Then on your phone (on the same Wi-Fi), open:

```
http://192.168.1.42:3000
```

To install it as a PWA on iPhone: tap the Share button → "Add to Home Screen"

---

## Deploy to the internet (free, one command)

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Deploy

```bash
vercel
```

Follow the prompts. When asked about settings, hit Enter to accept defaults.

### 3. Add your API key to Vercel

After deploying, go to https://vercel.com → your project → Settings → Environment Variables.

Add:
- **Name:** `ANTHROPIC_API_KEY`
- **Value:** your key from console.anthropic.com

Then redeploy:

```bash
vercel --prod
```

Your app is now live at a `yourapp.vercel.app` URL, installable on any phone.

---

## Project structure

```
the-agent-pwa/
├── public/
│   ├── manifest.json     # PWA metadata (name, icons, theme)
│   └── sw.js             # Service worker (offline support)
├── src/
│   ├── app/
│   │   ├── layout.js     # HTML shell, PWA meta tags
│   │   ├── page.js       # Main app — screen routing + state
│   │   ├── globals.css   # All styles
│   │   └── api/rate/
│   │       └── route.js  # Claude API call (server-side, key is safe here)
│   └── components/
│       ├── RoleScreen.jsx      # "Are you a contractor or employer?"
│       ├── ContractorForm.jsx  # Photographer/videographer input form
│       ├── EmployerForm.jsx    # Brand/agency input form
│       └── ResultScreen.jsx    # Rate result, factors, negotiation script
├── .env.example          # Template for your API key
├── .env.local            # Your actual key (never commit this)
├── next.config.mjs       # Next.js + PWA config
└── package.json          # Dependencies
```

---

## Pricing note for API costs

Each rate calculation uses Claude Haiku (the fastest, cheapest model). At current pricing, each calculation costs approximately **$0.0003** — about 3,000 calculations per dollar. For a typical user doing a few calculations per day, API costs will be negligible.

---

## Next steps

- Add app icons: drop `icon-192.png` and `icon-512.png` into `/public/`
- Add a History screen to save past calculations (localStorage)
- Add a Profile screen to remember user's name, location, experience level
- Set up Stripe for subscription billing at $24.99/month
