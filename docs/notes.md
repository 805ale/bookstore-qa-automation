
## What I built
- A minimal full‑stack CRUD app for an online bookstore.
- **Backend**: Node/Express + MongoDB with a `Book` model and REST endpoints.
- **Frontend**: React + Vite (separate dev server).
- **Testing tools** prepared: Playwright browsers installed; Postman app ready.

---

## Project structure
bookstore-qa-automation/
server/ # Express API
client/ # React (Vite)
frontend/ # Playwright tests
postman/ # Postman artifacts
README.md
docs/


---

## Environment & prerequisites (Part 0)
- Installed Node.js 18+, MongoDB (local service or Atlas), Postman.
- Created `.env` files:
  - **server/.env**
    ```
    MONGO_URI=mongodb://127.0.0.1:27017/bookstore_qa
    PORT=2000
    ```
  - **client/.env**
    ```
    VITE_API_BASE=http://localhost:2000
    ```
- **Important IDE note**: `.env` may be hidden; in Visual Studio use **Show All Files** in Solution Explorer; in VS Code tweak `files.exclude` or click the ⚙️ gear → Settings.
- **Vite gotcha fixed**: `index.html` must live at `client/index.html` (project root), not inside `public/`.

---

## Backend API (Part 1)
### Key files
- `server/server.js` – Express app, Mongo connect, routes mount.
- `server/models/Book.js` – schema+model (`title`, `author`, `price≥0`, `isbn` **unique**, `stock≥0`).
- `server/routes/books.js` – CRUD:
  - `POST   /api/books` → create (201)
  - `GET    /api/books` → list (newest first)
  - `GET    /api/books/:id` → get by id (400 invalid id, 404 not found)
  - `PUT    /api/books/:id` → update (validates, returns updated)
  - `DELETE /api/books/:id` → delete ({ ok: true })

### Start & verify
- Start MongoDB (Windows):
  - If service exists: `Get-Service *mongo*` → `Start-Service "<ServiceName>"`
  - Or manual: `mkdir C:\data\db` → run `mongod --dbpath C:\data\db` (keep it open)
- Start server:
  ```bash
  cd server
  npm install
  npm run start
  # ✅ Server running at http://localhost:2000

Health:
Invoke-RestMethod -Uri http://localhost:2000/ -Method Get
# { ok = True; service = bookstore-api }

API smoke (PowerShell‑friendly)
# CREATE
Invoke-RestMethod -Uri http://localhost:2000/api/books `
  -Method Post -ContentType 'application/json' `
  -Body '{"title":"Dune","author":"Frank Herbert","price":19.5,"isbn":"9780441172719","stock":2}'

# LIST
Invoke-RestMethod -Uri http://localhost:2000/api/books -Method Get

# UPDATE (replace <id> with real _id)
Invoke-RestMethod -Uri http://localhost:2000/api/books/<id> `
  -Method Put -ContentType 'application/json' `
  -Body '{"price":25,"stock":10}'

# DELETE
Invoke-RestMethod -Uri http://localhost:2000/api/books/<id> -Method Delete

Frontend (connected to backend) – quick notes

Start Vite in another terminal:

cd client
npm install
npm run dev
# → http://localhost:5173


The app fetches from VITE_API_BASE (so set client/.env and restart npm run dev).

If you add books via Postman/PowerShell, refresh the page (or add a “Refresh” button) to refetch.