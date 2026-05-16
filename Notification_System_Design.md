# Notification System Design

## Stage 1

### Problem

Students receive too many notifications like Events, Results, and Placements. Important messages may get missed.
So, we created a **Priority Inbox** that shows the most important unread notifications first.

### Priority Rules

Notifications are ranked using:

* **Type priority**
* **Recency (newer notifications first)**

Priority order:

1. Placement
2. Result
3. Event

This ensures Placement notifications always appear above Results and Events.

### Top-K Approach

Instead of sorting all notifications every time, we use a **Min Heap** to efficiently store only the top `K` important notifications.

### Complexity

* Time: `O(N log K)`
* Space: `O(K)`

This is faster and more memory efficient than sorting all notifications.

### Streaming Notifications

When a new notification arrives:

* It is directly added to the heap
* No need to process old notifications again

### Logging

All important actions like fetching, scoring, and filtering notifications are logged using a custom logging middleware.

### Backend Files

* `priorityInbox.ts` → scoring and top-K logic
* `notificationClient.ts` → API integration
* `index.ts` → main entry point

---

## Stage 2

### Frontend

Built using:

* Next.js
* TypeScript
* Material UI

Runs on:

```bash
http://localhost:3000
```

### Pages

* `/` → All Notifications
* `/priority` → Priority Inbox

### Viewed vs New Notifications

Viewed notification IDs are stored in `localStorage`.

New notifications are shown with:

* Yellow background
* Bold text
* "NEW" label

### API Integration

Frontend fetches notifications from the API with filtering support.

### Error Handling

* API/network errors show alert messages
* Empty data shows a friendly message
* All frontend actions are logged

### Folder Structure

```bash
notification_app_fe/
├── app/
├── components/
├── lib/
├── package.json
├── tsconfig.json
└── next.config.js
```
