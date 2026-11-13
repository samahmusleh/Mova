# IBM technology and privacy

Every purple sparkle (✨) in the app is an AI moment powered by IBM. In the app the labels stay friendly ("MOVA tip", "Drafted for you", "Made for your level"); this page explains what's behind them.

| Moment in the app | IBM technology | What it does |
|---|---|---|
| Crew matched just for you | Granite embedding model on watsonx.ai | Matches mentors and mentees by bus route, lunch period, classes and interests |
| MOVA tip (mentor nudge) | IBM Granite on watsonx.ai | Turns a mentee's check-in category into advice for the mentor, without revealing the reason |
| Drafted for you | IBM Granite on watsonx.ai | Drafts a short, kind check-in message the mentor edits and sends |
| Safety check passed | Granite Guardian | Checks every mentor message for bullying, shaming, off-campus meetups or contact info before it's sent |
| Made for your level | IBM Granite on watsonx.ai | Writes catch-up story problems at the student's reading and learning level |
| Weekly summary (advisor) | IBM Granite on watsonx.ai | Summarizes the week's patterns from aggregate counts only |
| Hosting | IBM Cloud Code Engine | Runs the app container |
| Building | IBM Bob | AI-first IDE used to build and extend the app |

In this repo, `server/index.js` has the four Granite routes (`/api/ai/draft`, `/check`, `/question`, `/summary`) and `server/watsonx.js` calls the watsonx.ai Text Chat API. Without credentials the app runs in demo mode with built-in responses.

## Privacy by design (FERPA)
- AI calls send first names or pseudonyms and categories only. Never last names, student IDs, health details or free-text reasons for absence.
- Mentors see names and check-ins, never why a student is out. Challenges are visible to the advisor and counselor only.
- Advisors must acknowledge FERPA before seeing student info; mentors agree to the crew code before joining; parents/guardians sign at enrollment.
- For a real pilot: deployed through the district under a Data Privacy Agreement (e.g. the SDPC template) and the FERPA "school official" exception. Data is never sold and is deleted when no longer needed.
- All data in this repo and the prototype is fictional.
