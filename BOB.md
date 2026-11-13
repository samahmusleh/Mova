# Building and hosting MOVA with IBM Bob

IBM Bob is an AI-first IDE (built on VS Code). You use it to **build and change** MOVA. To **host** MOVA (get a link judges can open), you deploy the container to **IBM Cloud Code Engine**. Bob can run every step below for you from its chat.

---

## 1. Open the project in Bob

**You need Node.js 18 or newer.** In Bob, open **Terminal → New Terminal** and type `node -v`.
If it says "command not found" or a number below 18, install the **LTS** version from nodejs.org, then close and reopen Bob.

1. Unzip `mova-app.zip` (on Windows: right-click → **Extract All**; don't open it from inside the zip).
2. In Bob: **File → Open Folder…** and pick the `mova-app` folder (the one that has `package.json` in it).
3. In Bob's terminal, run these two lines:

```bash
npm install
npm start
```

4. Open http://localhost:8080 in your browser. You should see the MOVA launch screen, then "Try the demo as…".

The zip already includes a built copy of the app, so you don't need to build first. After you change code, run `npm run build` and then `npm start` again.

If something fails, paste this into Bob's chat together with the error:

> I'm trying to run this project with `npm install` and `npm start`. Here is the error. Explain it simply and fix it.

Common problems:
- **"npm: command not found"** → Node.js isn't installed (see above).
- **"Cannot find package 'express'"** → run `npm install` first, from inside the `mova-app` folder.
- **"EADDRINUSE: 8080"** → something else uses port 8080. Run `PORT=3000 npm start` (Windows PowerShell: `$env:PORT=3000; npm start`) and open http://localhost:3000.

## 2. Connect IBM Granite on watsonx.ai

1. Sign in to IBM Cloud → **watsonx.ai** → create (or open) a project.
2. Project → **Manage → General**: copy the **Project ID**.
3. IBM Cloud → **Manage → Access (IAM) → API keys → Create**: copy the key.
4. In Bob, copy `.env.example` to `.env` and fill in `WATSONX_API_KEY`, `WATSONX_PROJECT_ID`, and `WATSONX_URL` for your project's region.
5. Check `WATSONX_MODEL_ID` is a Granite chat model available in your region (watsonx.ai → Resource hub). If you want Granite Guardian for safety checks, add its model ID to `WATSONX_GUARDIAN_MODEL_ID`.
6. Restart and open http://localhost:8080/api/health. It should say `"watsonx": true`.

In the app, AI cards now say **IBM Granite · watsonx.ai** instead of **demo mode**.

> Never commit `.env`. It's already in `.gitignore`.

Bob prompt if something fails:

> /api/health says watsonx is true but the Granite calls fall back to demo. Check the server logs, call /api/ai/draft with curl, and fix server/watsonx.js for my region and model.

## 3. Host it on IBM Cloud Code Engine

Paste into Bob's chat:

> Deploy this app to IBM Cloud Code Engine using the Dockerfile. Use the ibmcloud CLI: log in, install the code-engine plugin if needed, create a project called mova, create a secret called mova-secrets from my .env file, then create an app called mova from the local source with port 8080 and env from that secret. Give me the public URL at the end.

What Bob will run (for reference):

```bash
ibmcloud login --sso
ibmcloud plugin install code-engine        # first time only
ibmcloud target -r us-south -g Default
ibmcloud ce project create --name mova
ibmcloud ce secret create --name mova-secrets --from-env-file .env
ibmcloud ce application create --name mova --build-source . --port 8080 --env-from-secret mova-secrets
ibmcloud ce application get --name mova   # shows the public URL
```

To update after changes: `ibmcloud ce application update --name mova --build-source .`

Open the URL on your phone for the demo. It fills the screen; on a laptop it shows inside an iPhone 17 Pro frame.

## 4. Useful Bob prompts to keep building

- **Match the Figma closer:** "Compare client/src/Mentor.jsx with the Mentor Dashboard screen in my Figma file and make spacing, colors and type match. Tokens are in client/src/styles.css."
- **Dark mode:** "Add dark mode using prefers-color-scheme. Dark token values are in the Figma Color collection, Dark mode."
- **Mentor matching:** "Add POST /api/ai/match that uses a Granite embedding model on watsonx.ai to rank mentors for a mentee by shared classes, bus route and interests. Use pseudonyms only."
- **Real data later:** "Add a simple SQLite store for check-ins and logs so data survives a restart. Keep all fields from client/src/data.js."
- **Accessibility pass:** "Audit the app for WCAG 2.2 AA: contrast, 44px touch targets, focus order, labels and reduced motion. Fix what you find."
- **Tests:** "Add tests for the four /api/ai routes in demo mode."

## 5. Demo-day checklist

- [ ] `/api/health` shows `"watsonx": true` on the hosted URL
- [ ] Run the 2-minute story once: Kayla → Jaylen → Mr. Robinson (see README)
- [ ] "Reset demo" on the role picker before you present
- [ ] If Wi-Fi fails, the app falls back to demo responses automatically
