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

## Part 3 — UI Automation with Playwright

### Setup
- Installed and configured Playwright in `frontend/`.
- Ran tests:
  ```bash
  cd frontend
  npm run test:ui   # interactive mode
  npm test          # headless run


  ## Part 4 — API Testing with Postman

### What I set up
- Created and imported:
  - `postman/Bookstore.postman_environment.json` (env var: `base_url = http://localhost:2000`)
  - `postman/Bookstore.postman_collection.json` (Health, List, Create, etc.)
- Selected the **Bookstore** environment in Postman (top-right dropdown).

### Requests & Tests (Scripts → Post-response)
- **Health**  
  - URL: `{{base_url}}/`  
  - Tests:
    ```js
    pm.test("status 200", () => pm.response.to.have.status(200));
    pm.test("payload ok:true", () => {
      const body = pm.response.json();
      pm.expect(body.ok).to.eql(true);
      pm.expect(body.service).to.eql("bookstore-api");
    });
    ```

- **Create Book (positive)**  
  - Pre-request (generate unique ISBN each run):
    ```js
    pm.variables.set("isbn_runtime", `pm-${Date.now()}`);
    ```
  - Body:
    ```json
    {
      "title": "The Priory of the Orange Tree",
      "author": "Samantha Shannon",
      "price": 18.99,
      "isbn": "{{isbn_runtime}}",
      "stock": 10,
      "category": "Fantasy",
      "publishedYear": 2019
    }
    ```
  - Tests:
    ```js
    pm.test("status 201", () => pm.response.to.have.status(201));
    const created = pm.response.json();
    pm.environment.set("book_id", created._id);
    pm.environment.set("book_isbn", created.isbn);
    pm.test("returns _id + isbn", () => {
      pm.expect(created).to.have.property("_id");
      pm.expect(created).to.have.property("isbn");
    });
    ```

- **List Books**  
  - URL: `{{base_url}}/api/books`  
  - Tests:
    ```js
    pm.test("status 200", () => pm.response.to.have.status(200));
    const list = pm.response.json();
    pm.test("is an array", () => pm.expect(Array.isArray(list)).to.be.true);
    pm.test("contains created book (if any)", () => {
      const id = pm.environment.get("book_id");
      if (id) pm.expect(list.some(b => b._id === id)).to.be.true;
    });
    ```

- **Create Book (duplicate ISBN)**  
  - Body uses the saved `{{book_isbn}}`.  
  - Tests:
    ```js
    pm.test("status 400 for duplicate", () => pm.response.to.have.status(400));
    pm.test("error mentions duplicate", () => {
      const body = pm.response.json();
      pm.expect(JSON.stringify(body).toLowerCase()).to.include("duplicate");
    });
    ```

- **Update Book** (URL: `{{base_url}}/api/books/{{book_id}}`)  
  - Body example: `{ "stock": 10 }`  
  - Tests:
    ```js
    pm.test("status 200", () => pm.response.to.have.status(200));
    pm.test("stock updated to 10", () => pm.expect(pm.response.json().stock).to.eql(10));
    ```

- **Delete Book** (URL: `{{base_url}}/api/books/{{book_id}}`)  
  - Tests:
    ```js
    pm.test("status 200", () => pm.response.to.have.status(200));
    pm.test("ok:true", () => pm.expect(pm.response.json().ok).to.eql(true));
    ```

- **Invalid ID (GET/PUT/DELETE)** (URL like `{{base_url}}/api/books/invalid123`)  
  - Tests:
    ```js
    pm.test("invalid id returns 400 or 404", () => {
      pm.expect([400, 404]).to.include(pm.response.code);
    });
    ```

### Runner flow
- Recommended order: **Create → List → Duplicate → Update → Delete → Invalid ID**.
- All tests show pass/fail with clear assertions.
- If Create returns **400**, it’s usually a duplicate ISBN; ensure the pre-request script generates a fresh one and **save the request**.

### Troubleshooting
- `ENOTFOUND {{base_url}}` → environment not selected or not saved. Use `{{base_url}}/` with env value `http://localhost:2000`.
- `400 on Create` → duplicate ISBN or invalid enum/field type.
- Empty List before Create → run List *after* Create or seed in a pre-request.


## Part 5 — Data Strategy & Testability

### Goals
- Make e2e tests **deterministic** and **fast** by resetting DB state before each test.
- Allow **seeded fixtures** for predictable scenarios.
- Keep selectors stable; add `role="alert"` / `data-testid` only where semantics aren’t enough.

### What I implemented
- **Test environment** for backend:
  - `server/.env.test`  
    ```
    MONGO_URI=mongodb://127.0.0.1:27017/bookstore_qa_test
    PORT=2002
    NODE_ENV=test
    ```
- **Reset script** (guarded by `NODE_ENV=test`):
  - `server/scripts/reset.js` — connects to the test DB and clears the `books` collection.
  - `server/package.json` scripts:
    ```json
    {
      "scripts": {
        "start": "node server.js",
        "dev": "nodemon server.js",
        "start:test": "cross-env NODE_ENV=test node server.js",
        "reset:test": "cross-env NODE_ENV=test node scripts/reset.js",
        "seed:test": "cross-env NODE_ENV=test node scripts/seed.js"
      }
    }
    ```
- **Optional seed fixtures**:
  - `server/scripts/seed.js` — inserts a couple of known books (e.g., Dune, Clean Code).

- **Playwright alignment**:
  - Tests can point to **UI** at `http://localhost:5173` and **API (test)** at `http://localhost:2002`.
  - `frontend/tests/helpers.ts` uses `API_BASE_URL` env var (defaults to `http://localhost:2002` for tests).
  - `test.beforeEach` resets DB (via API delete‑all helper or by calling the reset script).
  - Added `role="alert"` (and optional `data-testid="error-banner"`) to error banner in `client/src/App.jsx` to make duplicate‑ISBN assertions unambiguous.

### How I run tests with a clean DB
1) **Start test API**:
   ```bash
   cd server
   npm run start:test  # -> http://localhost:2002



## 🧪 QA Tips
- Verify API directly:  
[http://localhost:2000/api/books](http://localhost:2000/api/books)  
- Cross-check UI at:  
[http://localhost:5173](http://localhost:5173)  
- Use Postman collection (`postman/`) for both positive + negative scenarios.
