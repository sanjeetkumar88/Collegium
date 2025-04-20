# Collegium 🎓

Collegium is a full-stack role-based collaboration and event management platform for educational institutions. It provides a centralized space for clubs, students, teachers, and administrators to manage events, share resources, collaborate on projects, and inspire innovation.

---

## 🚀 Features

### 🧠 Role-Based Access
- **Admin**: Manage everything
- **Teacher**: Oversee student activities and mentor clubs
- **Student**: Join clubs, collaborate, and participate in events
- **Club Leader / Co-Leader**: Manage club-related content and members

### 🏛 Club Management
- Create and manage clubs with details like name, logo, cover image, and tags
- Roles: Leader, Co-Leader, Members, Applicants
- Private/Public visibility
- Apply to join private clubs and approve/reject applicants

### 👥 Member & Role Management
- View members and co-leaders
- Approve or reject applicants (privileged users)
- Promote or demote members

### 📦 Event System
- **Event creation by Admin, Teachers, and Club Leaders**
- Features:
  - Online/Offline mode
  - Organizer info
  - RSVP system with user invite
  - Free or Paid registration
  - QR ticket generation & Email delivery upon registration
  - Download participant Excel sheet with all details

### 📁 Notes & Resource Sharing
- Share and download club-specific notes and study materials

### 🤝 Project Collaboration
- Find collaborators based on interest or skill
- View and take inspiration from shared projects
- Showcase your own work

---

## 🧑‍💻 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- Framer Motion (for animations)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Cloudinary (for image uploads)
- Multer (for handling file uploads)

### Other Tools
- JWT (Authentication)
- Role-based middleware
- Nodemailer (for QR tickets via email)
- ExcelJS (for event participant sheet download)

---

## 📂 Folder Structure

/client -> React frontend /server -> Express + MongoDB backend ├── controllers ├── models ├── routes ├── middlewares └── utils

yaml
Copy
Edit

---

## 🛠️ Setup Instructions

### Backend

cd server
npm install
npm run dev

### Create a .env file with:

PORT=5000
MONGO_URI=your_mongo_db_uri
JWT_SECRET=your_secret
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_password

### FRontend

cd client
npm install
npm run dev
