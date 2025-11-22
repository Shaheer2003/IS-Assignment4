# Hospital Management System

A comprehensive Hospital Management System built with Django REST Framework (Backend) and React + Vite (Frontend). This system implements role-based access control with three user roles: Admin, Doctor, and Receptionist, featuring encrypted patient data storage and audit logging.

## 🏗️ Project Structure

```
IS Project/
├── Backend/          # Django REST API
│   ├── backend/      # Django project settings
│   ├── users/        # User authentication & management
│   ├── patients/     # Patient management with encryption
│   ├── logs/         # Audit logging system
│   ├── manage.py
│   └── requirements.txt
└── frontend/         # React + Vite application
    ├── src/
    │   ├── pages/    # React components/pages
    │   └── ...
    ├── package.json
    └── vite.config.js
```

## ✨ Features

- **Role-Based Access Control**: Admin, Doctor, and Receptionist roles with specific permissions
- **Data Encryption**: Patient sensitive data encrypted using Fernet encryption
- **Audit Logging**: Comprehensive logging of all user actions
- **RESTful API**: Django REST Framework backend
- **Modern UI**: React-based frontend with Tailwind CSS
- **CORS Enabled**: Secure communication between frontend and backend

## 🚀 Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:
- **Python 3.10+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** and npm ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))

---

## 📦 Backend Setup (Django)

### 1. Navigate to Backend Directory

```powershell
cd "IS Project\Backend"
```

### 2. Create Virtual Environment

```powershell
python -m venv venv
```

### 3. Activate Virtual Environment

**Windows PowerShell:**
```powershell
.\venv\Scripts\Activate.ps1
```

**Windows Command Prompt:**
```cmd
.\venv\Scripts\activate.bat
```

> **Note**: If you encounter an execution policy error, run:
> ```powershell
> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
> ```

### 4. Install Dependencies

```powershell
pip install -r requirements.txt
```

### 5. Apply Database Migrations

```powershell
python manage.py migrate
```

> **Note**: The migration will automatically create user groups (Admin, Doctor, Receptionist) and assign any existing superusers to the Admin group.

### 6. Create Superuser (Admin)

```powershell
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

### 7. Assign Superuser to Admin Group

If you created the superuser **before** running migrations, run migrations again to assign them to the Admin group:

```powershell
python manage.py migrate
```

If you created the superuser **after** migrations, they're already in the Admin group! ✅

### 8. Run Development Server

```powershell
python manage.py runserver
```

The backend API will be available at: **http://127.0.0.1:8000/**

---

## 🎨 Frontend Setup (React + Vite)

### 1. Navigate to Frontend Directory

Open a **new terminal** and run:

```powershell
cd "IS Project\frontend"
```

### 2. Install Dependencies

```powershell
npm install
```

### 3. Run Development Server

```powershell
npm run dev
```

The frontend will be available at: **http://localhost:5173/**

---

## 🎯 Usage

### Accessing the Application

1. **Backend API**: http://127.0.0.1:8000/
2. **Frontend UI**: http://localhost:5173/
3. **Django Admin Panel**: http://127.0.0.1:8000/admin/

### Default Login

Use the superuser credentials you created during backend setup.

### Creating Additional Users

1. Go to Django Admin Panel: http://127.0.0.1:8000/admin/
2. Navigate to **Users** → **Add User**
3. Create user and assign to appropriate group (Admin/Doctor/Receptionist)

### User Role Permissions

| Feature | Admin | Doctor | Receptionist |
|---------|-------|--------|--------------|
| View Patient Real Name | ✅ | ❌ | ✅ |
| View Patient Contact | ✅ | ❌ | ✅ |
| View Diagnosis | ✅ | ✅ | ❌ |
| Add/Edit Patients | ✅ | ❌ | ✅ (Limited) |
| Delete Patients | ✅ | ❌ | ❌ |
| Assign Doctors | ✅ | ❌ | ✅ |
| View Audit Logs | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |

---

## 🛠️ Development Commands

### Backend Commands

```powershell
# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Run server
python manage.py runserver

# Make migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Access Django shell
python manage.py shell

# Run tests
python manage.py test

# Collect static files (for production)
python manage.py collectstatic
```

### Frontend Commands

```powershell
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 📝 Environment Variables (Optional)

For production, create a `.env` file in the Backend directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1
ENCRYPTION_KEY=your-encryption-key-here
DATABASE_URL=your-database-url
```

Install python-dotenv (already in requirements.txt) and update `settings.py` to use environment variables.

---

## 🔒 Security Notes

- The current `SECRET_KEY` and `ENCRYPTION_KEY` in `settings.py` are for development only
- **Never commit sensitive keys to version control**
- Use environment variables for production deployment
- Change default keys before deploying to production
- Ensure `DEBUG=False` in production

---

## 🐛 Troubleshooting

### Backend Issues

**Issue**: Virtual environment activation fails
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Issue**: Module not found errors
```powershell
pip install -r requirements.txt
```

**Issue**: Database errors
```powershell
python manage.py migrate --run-syncdb
```

### Frontend Issues

**Issue**: npm install fails
```powershell
# Clear npm cache
npm cache clean --force
npm install
```

**Issue**: Port 5173 already in use
```powershell
# Kill the process or change port in vite.config.js
```

**Issue**: CORS errors
- Ensure backend is running on http://127.0.0.1:8000/
- Check CORS settings in `backend/settings.py`

---

## 📚 Tech Stack

### Backend
- **Django 5.2** - Web framework
- **Django REST Framework** - API framework
- **django-cors-headers** - CORS handling
- **cryptography** - Data encryption (Fernet)
- **SQLite** - Database (development)

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

---

## 📄 License

This project is created for educational purposes.

---

## 👥 Support

For issues or questions, please contact the development team or create an issue in the project repository.

---

## 🚀 Quick Start (TL;DR)

```powershell
# Backend
cd "IS Project\Backend"
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver

# Frontend (new terminal)
cd "IS Project\frontend"
npm install
npm run dev
```

Visit http://localhost:5173/ and login with your superuser credentials! 🎉

> **Note**: User groups are automatically created during migration, and superusers are automatically assigned to the Admin group!
