# MOVA · Moving Our Young Ahead

**Show up. Show the way.**

MOVA turns students who miss class into mentors that younger students count on, because when someone needs you, you show up.

Built for the **Michigan DevFest Hackathon** (education track). Piloting in Detroit high schools, designed to scale statewide.

- 🎨 **Design + clickable prototype (Figma):** https://www.figma.com/design/htZnKQh0CrRfJGSuiEW57J/Michigan-DevFest
- 💻 **Working proof-of-concept:** this repo (React app + IBM Granite API)

---

## The problem
In 2025-26, **27.2% of Michigan students were chronically absent**, and about **60% in Detroit**. Students rarely stay home because they don't care: late buses, falling behind, family responsibilities, and feeling like no one needs them. Schools respond with calls home and perfect-attendance rewards that treat these students as problems to manage.

## The idea
Students who are slipping (10th–12th grade) become **mentors to up to 5 younger students**. When someone is counting on you, showing up becomes a responsibility you choose. The app makes it rewarding: points, forgiving streaks, crew leaderboards ranked by improvement, real rewards, and **leadership credit** approved by a teacher advisor.

It's backed by evidence: the IDRA Valued Youth Partnership has used this model since 1984 and kept **98% of its tutors in school**. MOVA brings it into a phone app so it can scale.

## Who it's for
| Role | What they get |
|---|---|
| **Mentee** (Kayla, 9th) | One-tap private check-in, catch-up questions at her level, a mentor who notices |
| **Mentor** (Jaylen, 10th) | A crew of 5, AI tips and message drafts, a 1-minute daily log, 7 rewards, backup when he needs it |
| **Advisor** (Mr. Robinson) | FERPA-safe dashboard: help requests, private challenge trends, mentor logs to approve |

## IBM technology
| In the app | IBM tech |
|---|---|
| Crew matching | Granite embedding model on watsonx.ai |
| Mentor tips + message drafts | IBM Granite on watsonx.ai |
| Safety check on every mentor message | Granite Guardian |
| Catch-up questions at the student's level | IBM Granite on watsonx.ai |
| Advisor weekly summary (totals only) | IBM Granite on watsonx.ai |
| Hosting / building | IBM Cloud Code Engine / IBM Bob |

Details: [docs/06-ibm-technology-and-privacy.md](docs/06-ibm-technology-and-privacy.md)

## Run the proof-of-concept
Needs Node.js 18+.

```bash
npm install
npm run build
npm start
# open http://localhost:8080
```

Pick a role ("Try the demo as…"). The three roles share live demo data: Kayla checks in → Jaylen gets a tip and sends a message → Jaylen logs his help → Mr. Robinson approves it.

To use live IBM Granite, copy `.env.example` to `.env` and add your watsonx.ai API key and project ID. Without them the app runs in demo mode. Deploying to IBM Cloud Code Engine and building with IBM Bob: see [BOB.md](BOB.md).

## Docs
1. [Problem statement](docs/01-problem-statement.md)
2. [Concept](docs/02-concept.md)
3. [Research: why Detroit high schoolers miss school](docs/03-research-detroit-absenteeism.md)
4. [Personas](docs/04-personas.md)
5. [Features](docs/05-features.md)
6. [IBM technology and privacy (FERPA)](docs/06-ibm-technology-and-privacy.md)
7. [Design](docs/07-design.md)
8. [Impact, scale and Michigan](docs/08-michigan-impact.md)

## Repo structure
```
client/    React app (Vite): Mentee, Mentor, Rewards, Advisor screens; tokens in styles.css
server/    Express API + watsonx.ai client (Granite routes)
docs/      Problem, research, personas, features, IBM tech, design, impact
Dockerfile Container for IBM Cloud Code Engine
```

## License
MIT. All student data in this repo and the prototype is fictional.
