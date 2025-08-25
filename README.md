# 1-Day Chatting App

A demo chat application built with React, TypeScript, Apollo Client, GraphQL, Dexie (IndexedDB), and Tailwind CSS.

## Features

- Channel-based chat, user selection
- Realtime messages, pagination, fetch more
- Draft message saving per user/channel
- Local error message storage (offline/error)
- All data is cleared every day at 00:00 UTC
- Responsive, modern UI with Tailwind CSS


## Requirements

- **Node.js = v22.18.0 (recommended)

## Setup

1. Clone the repository:

	```bash
	git clone https://github.com/thuanpt283/1-day-chatting-app.git
	cd 1-day-chatting-app
	```

2. Install dependencies:

	```bash
	npm install
	```

3. Create a `.env` file if you need to configure the GraphQL endpoint:

	```env
	VITE_GRAPHQL_URI=http://localhost:4000/graphql
	```

4. Start the app:

	```bash
	npm run dev
	```

## Usage

- Select a user and channel to start chatting
- Send messages, view history, fetch older/newer messages
- Error messages are stored locally and can be resent when online
- Drafts are auto-saved/removed as you type or clear the input
- All data is automatically cleared at the start of each new day (UTC)

## Project Structure

- `src/components/sections/Chatbox`: Main chat UI and logic
- `src/components/sections/Message`: Message display and input
- `src/components/common/moreMessages.tsx`: Fetch more messages button
- `src/components/hook/useLoadMoreMessage.tsx`: Hook for loading more messages
- `src/services/dexie.ts`: IndexedDB setup and queries
- `src/components/utils/index.tsx`: Utility functions, time handling, data merging
