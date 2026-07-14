# Doctor-Patient Consultation Platform

A complete Node.js/Express.js backend for a Doctor-Patient Consultation Platform. This API allows users to register as either Patients or Doctors, start consultations, and exchange messages in real-time.

## Features
- **Role-Based Authentication**: Secure JWT-based auth for Patients and Doctors.
- **Doctor Profiles**: Detailed doctor listings with specializations and experience.
- **Consultations**: Patients can start consultations, and doctors can manage their status (PENDING, ACTIVE, COMPLETED).
- **Messaging**: Secure, chronological messaging within active consultations.

## Tech Stack
- **Node.js** & **Express.js**
- **PostgreSQL** (Database)
- **Prisma** (ORM)
- **JSON Web Token (JWT)** & **Bcrypt** (Auth)

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+ recommended)
- Docker & Docker Compose (for the PostgreSQL database)

### 2. Clone and Install
Clone the repository or open the project folder.

```bash
npm install
```

### 3. Setup Database
Start the PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```

### 4. Environment Variables
Ensure the `.env` file is present in the root directory. It should contain:

```env
PORT=3000
DATABASE_URL="postgresql://admin:adminpassword@localhost:5432/consultation_db?schema=public"
JWT_SECRET="your_super_secret_jwt_key_change_me_in_production"
JWT_EXPIRES_IN="1d"
```

### 5. Run Migrations
Generate the Prisma client and push the schema to the database:

```bash
npx prisma generate
npx prisma db push
```
*(Alternatively, use `npx prisma migrate dev --name init`)*

### 6. Start the Server

```bash
npm run dev
# or
npm start
```
The server will run at `http://localhost:3000`.

## Database Schema Explanation

- **User**: The base model for both Patients and Doctors. Handles authentication and basic info.
- **DoctorProfile**: A 1-to-1 extension of `User` (where role is `DOCTOR`), storing specialization and experience.
- **Consultation**: A relationship mapping a `patient` (User) to a `doctor` (User). Includes a status (`PENDING`, `ACTIVE`, `COMPLETED`).
- **Message**: Linked to a specific `Consultation` and `sender` (User). Stores the message text and timestamp.

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new User.
- `POST /api/auth/login` - Login.
- `GET /api/auth/profile` - Get the logged-in user profile (Requires Auth).

### Doctors
- `GET /api/doctors` - List all doctors (Requires Auth).
- `GET /api/doctors/:id` - Get details of a specific doctor (Requires Auth).

### Consultations
- `POST /api/consultations` - Start a new consultation (Requires Auth, PATIENT only).
- `GET /api/consultations` - List your consultations (Requires Auth).
- `GET /api/consultations/:id` - Get specific consultation details (Requires Auth).
- `PATCH /api/consultations/:id/status` - Update consultation status (Requires Auth, DOCTOR only).

### Messages
- `POST /api/consultations/:id/messages` - Send a message (Requires Auth, Participants only).
- `GET /api/consultations/:id/messages` - Get messages for a consultation (Requires Auth).

## Postman Collection
A Postman collection is included in the project root: `Doctor-Consultation.postman_collection.json`. Import it into Postman to easily test all endpoints.

## Assumptions
- Only users with the `PATIENT` role can create a consultation.
- Both patients and doctors can view the consultation and exchange messages.
- Messages cannot be sent if a consultation is marked `COMPLETED`.
- Pagination defaults to 10 for consultations and 20 for messages.
