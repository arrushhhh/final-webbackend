# UNT Score Analyzer & University Recommendation System 🇰🇿

## Project Overview

The **UNT Score Analyzer** is a full-stack web application designed to help high school graduates in Kazakhstan analyze their Unified National Testing (UNT) results and choose suitable universities and academic programs based on their scores.

The system provides:
- analysis of UNT scores,
- recommendations of universities and programs,
- university news feed,
- user profile management,
- persistent storage of results.
![Uploading Снимок экрана 2026-02-12 в 16.52.06.png…]()


The project follows a **client–server architecture** with a separate frontend and backend connected via a RESTful API.

---

## Project Objectives

The main objectives of this project are:
- to assist students in making informed decisions about university admission,
- to demonstrate practical use of NoSQL databases (MongoDB),
- to implement authentication and authorization using JWT,
- to build a full backend system with validation, error handling, and role-based access,
- to design a modern and user-friendly frontend interface.

---

## Technologies Used

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** (NoSQL database)
- **Mongoose** (ODM)
- **JWT (JSON Web Token)** – authentication
- **bcryptjs** – password hashing
- **Joi** – request validation
- **dotenv** – environment variables
- **cors** – cross-origin requests
- **nodemon** – development server

### Frontend
- **HTML5**
- **CSS3 (Glassmorphism / Modern UI)**
- **Vanilla JavaScript**
- Runs on **localhost:3000**

---

## System Architecture

Frontend (Port 3000)
↓ HTTP Requests
Backend API (Port 5000)
↓
MongoDB Database (Atlas)


The frontend communicates with the backend using REST API endpoints.  
All business logic and database operations are handled on the backend.

---

## Database Structure (MongoDB)

The application uses the following collections:

| Collection | Description |
|-----------|-------------|
| `users` | Stores registered users |
| `universities` | Information about universities in Kazakhstan |
| `programs` | Academic programs with minimum UNT scores |
| `news` | University-related news |
| `results` | Saved UNT analysis results per user |

---

## Authentication & Authorization

- Users register and log in using email and password.
- Passwords are stored in **hashed form**.
- Authentication is implemented using **JWT**.
- Protected routes require a valid token.
- Role-based access control (RBAC) is implemented:
  - `user` – normal student access
  - `admin` – can add universities, programs, and news

---

## Main Features

### 1. User Authentication
- Register (`POST /register`)
- Login (`POST /login`)
- JWT-based session handling

### 2. Profile Management
- View profile (`GET /users/profile`)
- Update profile (`PUT /users/profile`)

### 3. UNT Score Analysis
- Students input UNT scores
- System calculates total score
- Matches score with minimum requirements
- Returns suitable universities and programs
- Displays admission chance (high / medium / low)

### 4. Universities Catalog
- View list of universities
- Search by name and city
- Data loaded dynamically from database

### 5. University News
- News stored in MongoDB
- News filtered by university
- Displayed in card-based UI

### 6. Saved Results
- Save analysis results
- View previous analyses
- Delete saved results

---

## API Endpoints

### Public Endpoints

POST /register
POST /login
GET /health


### Protected Endpoints (JWT required)


GET /users/profile
PUT /users/profile

POST /results
GET /results
GET /results/:id
PUT /results/:id
DELETE /results/:id

POST /analyze
GET /universities
GET /programs
GET /news


### Admin-only Endpoints


POST /universities
POST /programs
POST /news


---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/untapp
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000

Installation & Running the Project
Backend
npm install
npm run dev


Backend will start on:

http://localhost:5000

Frontend

Open frontend on:

http://localhost:3000


(Frontend sends API requests to backend on port 5000)

Project Demonstration Flow

User registers or logs in

User views universities and news

User enters UNT scores

System analyzes scores and shows recommendations

User saves result

User views saved results in profile


<img width="1500" height="903" alt="Снимок экрана 2026-02-10 в 22 46 17" src="https://github.com/user-attachments/assets/4a2f1089-f59b-487b-a570-b9c10094c3d3" />
The main page of our website


<img width="1512" height="901" alt="Снимок экрана 2026-02-10 в 22 47 09" src="https://github.com/user-attachments/assets/9a4d0b31-c566-405d-9244-0bc4cc3422fb" />
Here is news that loaded from our database <img width="1512" height="982" alt="Снимок экрана 2026-02-10 в 22 47 32" src="https://github.com/user-attachments/assets/e80e7a93-fb1a-42a3-ab45-e08ae6d54bd9" />
In news collection we inserted news from universities and created dataset of it, then this datas were uploaded to our web page through connection.

The next is users

<img width="1512" height="905" alt="Снимок экрана 2026-02-10 в 22 49 26" src="https://github.com/user-attachments/assets/82f8cd8e-818c-4d67-a089-26bf4eccc0a8" />
users can create account or log in to the website and analyze their scores, find universitites and get recommendation


<img width="1512" height="982" alt="Снимок экрана 2026-02-10 в 22 50 23" src="https://github.com/user-attachments/assets/74be1b93-38df-4cba-9602-0e9bb7e79181" />
In database we have "universities" collection that is responsible for universities. 
<img width="1512" height="982" alt="Снимок экрана 2026-02-10 в 22 51 00" src="https://github.com/user-attachments/assets/86577856-6f7c-4c97-9ab1-42e4c5d3d1f3" />
Then "programs" collection that stands for universities scores and for our analyzing score. 

Conclusion

This project demonstrates the development of a complete full-stack web application using modern backend and frontend technologies. The UNT Score Analyzer provides a practical solution for students while showcasing core skills in NoSQL database design, REST API development, authentication, and frontend integration.

The system is scalable, modular, and follows best practices of modern web development.
UNT Score Analyzer
Full-Stack Web Application
2026



