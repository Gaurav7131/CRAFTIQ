# 🚀 CRAFTIQ

> **Crafting Tomorrow's Content Today!**

![PERN Stack](https://img.shields.io/badge/Stack-PERN-blue)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791)
![License](https://img.shields.io/badge/License-MIT-green)

## 📖 Introduction
**CRAFTIQ** is a powerful content intelligence and management platform designed to streamline the creative process for digital marketers and creators. By leveraging the speed of the PERN stack, it offers real-time content drafting, scheduling, and analytics in a secure environment.

## ✨ Key Features

* **⚡ Real-time Dashboard:** Track content performance and upcoming schedules.
* **📝 Smart Editor:** Markdown-supported editor for drafting articles and posts.
* **🔐 Secure Authentication:** User login and role management using JWT & Bcrypt.
* **🗄️ Robust Data Management:** Structured content storage using PostgreSQL relational tables.
* **📊 Analytics Integration:** Visualize engagement metrics (Views, Likes, Shares).

## 🛠️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Database** | PostgreSQL |
| **Backend** | Node.js, Express.js |
| **Frontend** | React.js, Tailwind CSS |
| **ORM / Query** | `pg` (node-postgres) or Sequelize |
| **Authentication** | JSON Web Tokens (JWT) |

## ⚙️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites
Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v16+)
* [PostgreSQL](https://www.postgresql.org/) (Locally or via a cloud provider like Neon/Supabase)

### 1. Clone the Repository
```bash
git clone [https://github.com/gauravthakare/craftiq.git](https://github.com/gauravthakare/craftiq.git)
cd craftiq
2. Database Setup
Open your PostgreSQL terminal (psql) or GUI (pgAdmin).

Create a new database:

SQL

CREATE DATABASE craftiq_db;
(Optional) If you have a schema.sql file, import it now:

Bash

psql -U postgres -d craftiq_db -f database.sql
3. Backend Configuration
Navigate to the server directory and install dependencies:

Bash

cd server
npm install
Create a .env file in the server folder and add your credentials:

Code snippet

PORT=5000
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=craftiq_db
JWT_SECRET=your_secure_jwt_secret
Start the server:

Bash

npm run dev
4. Frontend Configuration
Open a new terminal, navigate to the client directory:

Bash

cd ../client
npm install
Start the React application:

Bash

npm start
The app will launch at http://localhost:3000

📡 API Endpoints (Examples)
Auth

POST /api/auth/register - Create a new creator account

POST /api/auth/login - Login to dashboard

Content

GET /api/posts - Retrieve all content drafts

POST /api/posts - Create a new article

PUT /api/posts/:id - Update existing content

🤝 Contributing
Contributions are welcome!

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
Distributed under the MIT License. See LICENSE for more information.

CRAFTIQ © 2026. Made with ❤️ by Gaurav Thakare


### **Why this works better for PERN:**
1.  **Database Specifics:** I added the `CREATE DATABASE` SQL command in the setup steps, which is critical for Postgres (unlike MongoDB which creates databases automatically).
2.  **Environment Variables:** I included `DB_USER`, `DB_HOST`, and `DB_PORT`, which are standard requirements for connecting a Node app to Postgres.
