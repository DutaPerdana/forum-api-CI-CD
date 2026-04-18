# 🚀 Forum API - Backend Expert Dicoding

Sebuah RESTful API untuk aplikasi forum diskusi, dibangun dengan arsitektur **Clean Architecture** (Test-Driven Development) dan di-deploy menggunakan **Vercel Serverless**. Proyek ini merupakan submission akhir untuk kelas "Menjadi Back-End Developer Expert" di Dicoding.

[![CI/CD Status](https://img.shields.io/badge/CI%2FCD-Passing-brightgreen)](https://github.com/DutaPerdana/forum-api-CI-CD/actions)
[![Test Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen)](#)
[![Deployment](https://img.shields.io/badge/Deployed_on-Vercel-black)](https://[URL-VERCEL-KOMANDAN].vercel.app)

---

## 📖 Dokumentasi Lengkap (Postman)
Untuk melihat contoh *request*, *response*, dan interaksi lengkap dari API ini, silakan kunjungi dokumentasi Postman berikut:
👉 **[Link Dokumentasi Postman Anda Di Sini]**

*(Catatan: Anda bisa mendapatkan link di atas dengan mengklik "Publish Docs" pada Collection Postman Anda).*

---

## ✨ Fitur Utama
* **Autentikasi & Otorisasi:** JWT Access Token & Refresh Token.
* **Manajemen User:** Registrasi dan enkripsi password secara aman.
* **Thread & Komentar:** Membuat thread diskusi dan berpartisipasi memberikan komentar.
* **Fitur Opsional (Lengkap):** Mendukung Balasan (Replies) pada komentar dan Menyukai (Likes) komentar.
* **Keamanan (Rate Limiting):** Membatasi akses (Limit Access) sebanyak 90 request/menit menggunakan `express-rate-limit`.
* **CI/CD Pipeline:** Otomatisasi pengujian dan deployment menggunakan GitHub Actions.

## 🛠️ Tech Stack
* **Framework:** Node.js dengan Express.js
* **Database:** PostgreSQL (Hosted on Neon.tech)
* **Testing:** Jest / Vitest (100% Code Coverage)
* **Deployment:** Vercel (Serverless Environment)

---

## 📡 Daftar API Endpoints

| Method | Endpoint | Keterangan | Membutuhkan Auth |
| :--- | :--- | :--- | :---: |
| **POST** | `/users` | Mendaftarkan pengguna baru | ❌ |
| **POST** | `/authentications` | Login (Mendapatkan Token) | ❌ |
| **PUT** | `/authentications` | Memperbarui Access Token | ❌ |
| **DELETE** | `/authentications` | Logout (Menghapus Token) | ❌ |
| **POST** | `/threads` | Membuat thread baru | ✅ |
| **GET** | `/threads/:threadId` | Melihat detail thread & komentar | ❌ |
| **POST** | `/threads/:threadId/comments` | Menambahkan komentar | ✅ |
| **DELETE**| `/threads/:threadId/comments/:commentId` | Menghapus komentar | ✅ |
| **POST** | `/threads/:threadId/comments/:commentId/replies` | Menambahkan balasan | ✅ |
| **DELETE**| `/threads/:threadId/comments/:commentId/replies/:replyId` | Menghapus balasan | ✅ |
| **PUT** | `/threads/:threadId/comments/:commentId/likes` | Menyukai / Batal menyukai | ✅ |

---

## 💻 Panduan Menjalankan di Lokal (Local Setup)

Jika Anda ingin menguji proyek ini di mesin lokal untuk melihat fitur `express-rate-limit` bekerja secara optimal 100%, ikuti langkah berikut:

### 1. Clone Repository
```bash
git clone [https://github.com/DutaPerdana/forum-api-CI-CD.git](https://github.com/DutaPerdana/forum-api-CI-CD.git)
cd forum-api-CI-CD
2. Install Dependencies
Bash
npm install
3. Konfigurasi Environment Variables
Buat file .env di root folder dan isi dengan konfigurasi database lokal Anda:

Cuplikan kode
PGHOST=localhost
PGUSER=postgres
PGPASSWORD=password_db_anda
PGDATABASE=forumapi
PGPORT=5432

ACCESS_TOKEN_KEY=kunci_rahasia_access_token_bebas
REFRESH_TOKEN_KEY=kunci_rahasia_refresh_token_bebas
ACCCESS_TOKEN_AGE=1800
4. Setup Database (Migrasi)
Pastikan server PostgreSQL Anda berjalan, lalu buat tabel dengan perintah:

Bash
npm run migrate up
5. Jalankan Server
Bash
npm run start:dev
Server akan berjalan di http://localhost:5000. Silakan uji Rate Limiter dengan mengirimkan lebih dari 90 request secara beruntun menggunakan Postman Runner ke rute /threads.