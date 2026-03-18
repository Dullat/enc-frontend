# ENC - Frontend (The Dedsec Project)

This is my attempt at building a hacker-themed web app that looks like something out of Watch Dogs. It's mostly black backgrounds and monospace fonts for now, but the idea is to have a secure hub for chatting and storing files without people snooping around.

---

## What I'm using (and struggling with)

### The Core Stuff
*   React 19: I went with the latest version because I like living on the edge, even if I don't use half of the new features yet.
*   Vite: Because life is too short to wait for Webpack to bundle things.
*   React Router v7: Using the new createBrowserRouter thing. It works, so I'm not touching it.

### State and Data (The "Fun" Part)
*   Redux Toolkit: Because apparently passing props is too simple, so I added slices and selectors to make my life more "organized" (complicated).
*   RTK Query: This actually feels like magic. It handles all the fetching and caching so I don't have to write a million useEffects. 
*   The Auth Strategy: I'm using credentials: "include" and a fancy interceptor that catches 401 errors to refresh tokens. It took me way too long to figure out why I was getting logged out constantly, but it's finally stable.

### Styling
*   Tailwind CSS v4: Standard utility-first stuff. 
*   Dynamic Theming: I built a system where the accent color changes globally based on the Redux state. It's great for when you get bored of green and want everything to be purple.
*   Fonts: Using a bunch of monospace and "gamer" fonts like JetBrains Mono and Orbitron. If it's not a monospace font, it's not "hacker" enough.

---

## Where things are at right now

### What actually works:
*   Authentication: You can login, register, and logout. The site actually remembers who you are, which is a win.
*   The Theme System: You can change the accent color and it actually updates everywhere. Priority #1, obviously.
*   User Dashboard: It can tell you what device you're logged in from. I used ua-parser-js for this so I can feel like I'm tracking people.
*   Password Recovery: Forgot password and email verification are "mostly" there.
*   Responsive Layout: It works on my phone and my laptop. If you have a weird screen size, good luck.

### What's still "Coming Soon" (a.k.a. Under Construction):
*   The Drive: It's a placeholder. Don't try to upload your life savings yet.
*   Encryption Tools: I have the UI, but it doesn't actually encrypt anything yet. It's "visual" security for now.
*   Chat: Same here. You can look at the page, but nobody is talking back.

---

## Project Structure (In case I forget where I put things)

```text
enc-frontend/
├── src/
│   ├── app/                # Where the Redux store lives.
│   ├── assets/             # SVGs and things I stole from the internet.
│   ├── components/         # Reusable bits like sidebars and buttons.
│   ├── features/           # The logic for themes and users.
│   ├── hooks/              # Custom hooks I wrote to feel smart.
│   ├── layouts/            # The basic shell of the app.
│   ├── pages/              # The actual views (some are just empty shells).
│   ├── services/           # The base API setup.
│   ├── svgs/               # A lot of custom SVG code.
│   ├── theme/              # Hacker backgrounds and tickers.
│   └── utils/              # Math and color helpers I barely understand.
```

---

## My Progress so far

I've basically moved from "how do I center a div" to "how do I manage a complex JWT refresh flow without breaking everything." The foundation is solid. The auth works, the routing is secure, and the state management isn't a complete mess. Now I just need to actually build the "Drive" and "Chat" features instead of just making the background look cool.
