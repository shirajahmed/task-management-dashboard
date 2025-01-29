# Task Management Dashboard

## Setup local

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the development server.
4. Open `http://localhost:3000` in your browser.

## Features

- View tasks in a Kanban board.
- Add new tasks.
- Drag and drop tasks between columns.
- Persist tasks using a mock API.
- Remove Task.

## Architecture and approach

Client-Side Rendering: All component runs on client-side

Component Structure:
page.js: Main layout
TaskColumn.js: Column container
TaskCard.js: Individual task card with drag-and-drop
AddTaskModal.js: Form for creating new tasks

API Integration:
GET/PUT/DELETE to external API endpoint(rander fr web server )
Immediate UI updates with optimistic updates
Drag-and-Drop:
@dnd-kit for smooth DnD operations(library)
