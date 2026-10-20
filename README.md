# TaskFlow (Backend)

TaskFlow is a full-stack task management app with a drag-and-drop Kanban board. This is the **REST API** built with Node.js, Express and MongoDB. The frontend lives in a separate repo: **[taskflow-frontend](https://github.com/imhsart/trello-clone-frontend.git)**.

**Live demo:** https://taskflow-vwwb.onrender.com

## Features

- User signup and login with hashed passwords (bcrypt)
- JWT authentication stored in a secure `httpOnly` cookie (expires in 2 days)
- Input validation for email, date of birth and password strength
- Full CRUD for tasks, scoped so users can only access their own tasks
- Profile editing (username, organization, profile picture) and password change
- Centralized error handler for duplicate keys, validation errors and invalid IDs

## Tech Stack

- Node.js
- Express 5
- MongoDB with Mongoose
- JSON Web Tokens (`jsonwebtoken`)
- bcrypt
- validator
- cookie-parser, cors, dotenv

## Project Structure

```
src/
├── Middlewares/
│   ├── errorHandler.js            # Central error handling
│   └── isLoggedInMiddleware.js    # Verifies the JWT cookie and loads the user
├── Models/
│   ├── Task.schema.js
│   └── User.schema.js
├── Routes/
│   ├── Task.routes.js
│   └── User.routes.js
└── app.js                         # Server entry point
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- A MongoDB database (local, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### Installation

```bash
git clone https://github.com/imhsart/trello-clone-backend.git
cd trello-clone-backend
npm install
```

### Environment variables

Copy `.env.example` to `.env` and fill in the values:

```env
PORT=8080
MONGO_URL=your_mongodb_connection_string
JWT_SECRET_KEY=a_random_secret
```

| Variable | Description |
| --- | --- |
| `PORT` | Port the server listens on (defaults to `8080`) |
| `MONGO_URL` | MongoDB connection string |
| `JWT_SECRET_KEY` | Secret used to sign JWTs. Use a long random string. |

### Run the server

For development (auto-restarts on file changes):

```bash
npm run dev
```

For production:

```bash
npm run prod
```

The API runs at `http://localhost:8080/api`.

## API Reference

All routes are prefixed with `/api`. Routes marked 🔒 require the login cookie.

### Users: `/api/users`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/signup` | | Create an account |
| POST | `/login` | | Log in with email **or** username, plus password |
| POST | `/logout` | | Clear the login cookie |
| GET | `/get-user-data` | 🔒 | Get the logged-in user's details |
| PATCH | `/edit` | 🔒 | Update username, profile picture or organization |
| PATCH | `/change-pass` | 🔒 | Change password (logs the user out afterwards) |

**Signup body**

```json
{
  "firstname": "fname",
  "lastname": "lname",
  "username": "user123name",
  "email": "abcde@email.com",
  "password": "StrongPass@123",
  "DOB": "2003-01-31",
  "gender": "male"
}
```

### Tasks: `/api/tasks`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/create` | 🔒 | Create a task |
| GET | `/get` | 🔒 | Get all of your tasks |
| GET | `/get/:id` | 🔒 | Get a single task |
| PATCH | `/update/:id` | 🔒 | Update a task |
| DELETE | `/delete/:id` | 🔒 | Delete a task |

**Task body**

```json
{
  "title": "Write README",
  "description": "Document the project",
  "priority": "medium",
  "status": "pending"
}
```

- `priority`: `low`, `medium`, or `high`
- `status`: `pending`, `inprogress` or `complete`

## Validation Rules

- **Username:** 8 to 20 characters, no spaces, must be unique
- **Email:** valid format, 12 to 40 characters, must be unique
- **Password:** must be strong (uppercase, lowercase, number and symbol, at least 8 characters)
- **Date of birth:** `YYYY-MM-DD`
- **Gender:** `male`, `female` or `others`
- **Task title:** up to 35 characters

## Notes
 
- The login cookie is set with `secure`, `httpOnly` and `sameSite: "none"`, so it works across the separately hosted frontend and backend.
- CORS only allows the origins listed in `app.js`. If your frontend runs on a different URL, add it there.

## Related
 
- Frontend repo: [taskflow-frontend](https://github.com/imhsart/trello-clone-frontend.git)