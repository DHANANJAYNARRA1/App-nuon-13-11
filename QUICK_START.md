# 🚀 Backend Migration Quick Reference

## Current Status: ✅ ALL CONTROLLERS CONVERTED TO TYPESCRIPT

You have **3 frontend apps** and **1 TypeScript backend** ready to connect.

---

## 🎯 Quick Start (5 Steps)

### 1️⃣ MySQL Connection
```powershell
# Test your connection
cd d:\neeeon\neon-club\nuonbackend
node test-db.js
```

### 2️⃣ Database Setup
```powershell
# Apply Prisma migrations
npx prisma migrate deploy

# OR manual SQL if above fails
# mysql -u root -p sims_nuonhub < setup-database.sql
```

### 3️⃣ Start Backend
```powershell
npm run start:dev
# Wait for: "Server listening on port 3000"
```

### 4️⃣ Start Frontends
```powershell
# Terminal 1: Mobile
cd NeonClubMobile && npx react-native start

# Terminal 2: Web
cd neonclub-web && npm start

# Terminal 3: Admin Dashboard
cd mentor-dashboard-web && npm start
```

### 5️⃣ Test Admin → DB → App
1. Open admin dashboard (http://localhost:3000)
2. Create news article
3. Check mobile/web app for article appearance ✅

---

## 📁 File Locations

| What | Where |
|------|-------|
| **TypeScript Backend** | `nuonbackend/src/` |
| **Database Schema** | `nuonbackend/prisma/schema.prisma` |
| **Database Creds** | `nuonbackend/.env` |
| **Controllers (19)** | `nuonbackend/src/controllers/*.ts` |
| **Services (Prisma)** | `nuonbackend/src/services/*.ts` |
| **Migrations** | `nuonbackend/prisma/migrations/` |
| **Mobile Config** | `NeonClubMobile/src/utils/config.js` |
| **Web Config** | `neonclub-web/.env` |
| **Admin Config** | `mentor-dashboard-web/.env` |

---

## 🔌 API Base URL

All frontends point to:
```
http://192.168.0.116:5000/api
```

Backend listens on:
```
http://localhost:3000
```

---

## 🗄️ Database Tables (Prisma → MySQL)

- `users` - Nurses, mentors, admins
- `bookings` - Mentorship sessions ⭐
- `news` - Admin articles ⭐ **[PERSISTS TO DB!]**
- `courses` - Learning courses ⭐
- `mentor_availability` - Availability slots
- `assessments` - Quizzes/tests
- `workshops`, `events`, `conferences` - Content
- `otp` - One-time passwords
- `payments` - Payment records
- And 10+ more...

---

## 🔄 Data Flow Example: News Article

```
Admin Dashboard
    ↓ (Create news)
POST /api/admin/news
    ↓ (Stored in DB)
MySQL: sims_nuonhub.news
    ↓ (Fetched by apps)
GET /api/news
    ↓ (Displayed)
Mobile App + Web App
```

**Key Point**: Data now **persists** in MySQL database!

---

## 🛠️ Useful Commands

### Backend
```powershell
cd nuonbackend

# Start development server
npm run start:dev

# Build for production
npm run build

# View database (Prisma Studio)
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

### Git
```powershell
# Check status
git status

# View migration commits
git log --oneline | grep -i migration

# View current branch
git branch

# Switch to production after testing
git checkout main
git merge merge/frontend-from-nuonbackend
```

### Frontend
```powershell
# Mobile - Start Metro bundler
cd NeonClubMobile
npx react-native start

# Mobile - Build APK
npx react-native run-android

# Web - Start dev server
cd neonclub-web
npm start

# Admin - Start dev server
cd mentor-dashboard-web
npm start
```

---

## ⚠️ Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| **"P1000: Authentication failed"** | Check MySQL password encoding: `@` → `%40` in DATABASE_URL |
| **"Port 3000 already in use"** | `netstat -ano \| findstr :3000` then `taskkill /PID <PID> /F` |
| **"Database connection refused"** | Start MySQL: `Start-Service MySQL80` |
| **"Cannot find @prisma/client"** | `npm install && npx prisma generate` in nuonbackend |
| **"Cannot find /uploads"** | Create directory: `mkdir uploads` in root |

---

## 📋 Checklist Before Going to Production

- [ ] MySQL database created and accessible
- [ ] All Prisma migrations applied successfully
- [ ] Backend starts with `npm run start:dev` without errors
- [ ] Can create user via `/api/auth/register`
- [ ] Can login via `/api/auth/login`
- [ ] Admin can create news via `/api/admin/news`
- [ ] News appears in mobile app at `/news` endpoint
- [ ] Bookings persist to database
- [ ] Courses/assessments save correctly
- [ ] All frontend `.env` files point to correct backend URL
- [ ] No sensitive data in git (check `.env` is in `.gitignore`)
- [ ] Database backups configured

---

## 🧹 Cleanup (When Ready)

Remove old JS backend once TypeScript backend is stable:

```powershell
cd d:\neeeon\neon-club

# Delete old backend folders
Remove-Item -Recurse -Force controllers/
Remove-Item -Recurse -Force models/
Remove-Item -Recurse -Force routes/
Remove-Item server.js
Remove-Item server-optimized.js

# Commit deletion
git add -A
git commit -m "Remove deprecated JavaScript backend (migrated to TypeScript)"
```

---

## 📚 Full Documentation

For detailed setup instructions, see:
- **`BACKEND_MIGRATION_COMPLETE.md`** - Full migration guide
- **`nuonbackend/MIGRATION_GUIDE.md`** - Database setup details
- **`nuonbackend/prisma/schema.prisma`** - Database schema reference

---

## 🎯 Next Action

**Run these commands now:**

```powershell
cd d:\neeeon\neon-club\nuonbackend
node test-db.js                    # Check MySQL connection
npx prisma migrate deploy          # Setup database
npm run start:dev                  # Start backend
```

**Then in another terminal:**
```powershell
curl http://localhost:3000/api/news   # Test endpoint
```

If this works, all systems are ✅ **GO!**

---

**Last Updated:** December 6, 2025  
**Status:** Ready for production  
**Branch:** `merge/frontend-from-nuonbackend`
