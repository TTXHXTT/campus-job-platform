# Campus Part-Time Job Platform

A **full-stack WeChat Mini Program** designed for managing **campus part-time jobs**, built with **Spring Boot, Vue.js, MySQL**, and **WeChat Mini Program framework**.  
The system provides a platform for students, employers, and administrators to efficiently exchange and manage part-time job information.

---

## 🚀 Features
### Student
- Register/Login, manage personal profile
- Browse and apply for part-time jobs
- Track application history and attendance
- View notifications and salary details  

### Employer
- Post and manage job listings
- Review and approve student applications
- Track workforce attendance and salary management  

### Administrator
- Verify job postings and employer legitimacy
- Manage user accounts (students/employers)
- Handle complaints and push announcements  

---

## 🛠️ Tech Stack
- **Backend:** Spring Boot + MyBatis  
- **Frontend:** WeChat Mini Program (WXML, WXSS, JavaScript), Vue.js (for admin panel)  
- **Database:** MySQL + Redis (caching)  
- **Security:** Spring Security + JWT authentication  
- **Deployment:** Docker (supports scaling)  

---

## 📂 Database Design
- **Core tables:** `user`, `job_base`, `job_detail`, `apply_base`, `checkin_base`, `salary_base`, `notice_base`  
- **Highlights:**  
  - Multi-role user system (student, employer, admin)  
  - Job application & approval workflow  
  - Attendance tracking with check-in/check-out records  
  - Salary calculation and payment tracking  

---

## ⚡ Installation & Run
### Backend
```bash
# clone project
git clone https://github.com/TTXHXTT/campus-job-platform.git
cd campus-job-platform

# build & run Spring Boot app
mvn spring-boot:run