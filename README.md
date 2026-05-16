\# Campus Notifications



A campus notification platform that delivers real-time updates regarding Placements, Events, and Results, featuring a Priority Inbox that surfaces the most important unread notifications first.



\## Structure

\- `logging-middleware/` — reusable logging middleware

\- `notification\_app\_be/` — Priority Inbox algorithm (TypeScript)

\- `notification\_app\_fe/` — Next.js + Material UI frontend on `http://localhost:3000`

\- `Notification\_System\_Design.md` — design documentation

\- `screenshots/` — output screenshots and demo recording



\## Setup



\### Logging middleware

```bash

cd logging-middleware \&\& npm install \&\& npm run build

```



\### Backend (Priority Inbox)

```bash

cd notification\_app\_be \&\& npm install

EVAL\_TOKEN=your\_token npx ts-node src/index.ts

```



\### Frontend

```bash

cd notification\_app\_fe

\# Add EVAL\_TOKEN=your\_token and NEXT\_PUBLIC\_EVAL\_TOKEN=your\_token to .env.local

npm install

npm run dev

```

Visit http://localhost:3000.

