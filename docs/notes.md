# 📖 Project Notes — Bookstore QA Automation

---

## Part 0 — Orientation & Prereqs

- ✅ Installed **Node.js**, **MongoDB**, **Postman** and verified versions.
- ✅ Created project scaffold:
server/ → Express + MongoDB backend
client/ → React (Vite) frontend
frontend/ → Playwright tests
postman/ → Postman collections

- ✅ Added `.env` files:
- `server/.env` → `MONGO_URI`, `PORT`
- `client/.env` → `VITE_API_BASE`
- ✅ Verified connectivity:
- Backend → [http://localhost:2000](http://localhost:2000) returned  
  ```json
  { "ok": true, "service": "bookstore-api" }
  ```
- Frontend → [http://localhost:5173](http://localhost:5173) rendered React UI
- ✅ Initialized Git repo, added `.gitignore`, wrote initial `README.md`, pushed scaffold to GitHub.

---

## Part 1 — Backend API (Express + MongoDB)

- 🛠️ Implemented **Book model** (`models/Book.js`) with schema validation:
- `title`, `author`, `price`, `isbn`, `stock`
- 🛠️ Created CRUD routes (`routes/books.js`):
- `POST /api/books` → Create  
- `GET /api/books` → List  
- `PUT /api/books/:id` → Update  
- `DELETE /api/books/:id` → Delete
- ✅ Verified API with PowerShell `Invoke-RestMethod`:
- Create, List, Update, Delete worked as expected.
- 🔒 Enforced **unique ISBN** → duplicate POST returns **400**.
- ➕ Extended schema with:
- `category` → enum: `Fantasy`, `Sci-Fi`, `Romance`, `Non-Fiction`, `Other`
- `publishedYear` → number, optional
- 🧪 Confirmed persistence and correct API responses.

---

## Part 2 — Frontend (React + Vite)

- 🖼️ Built **UI components**:
- `BookForm.jsx` → form for add/edit
- `BookList.jsx` → table with edit/delete buttons
- 🔗 Connected frontend to backend via `src/api.js`.
- ✅ Verified CRUD flow end-to-end in UI:
- Add → Book appears in table
- Edit → Stock/fields update in place
- Delete → Book removed
- Refresh → Data persists
- ➕ Extended frontend to support new backend fields:
- **Category** → dropdown with schema enums
- **Published Year** → optional number field
- 📊 Updated table to display category + year.



## 🧪 QA Tips
- Verify API directly:  
[http://localhost:2000/api/books](http://localhost:2000/api/books)  
- Cross-check UI at:  
[http://localhost:5173](http://localhost:5173)  
- Use Postman collection (`postman/`) for both positive + negative scenarios.
