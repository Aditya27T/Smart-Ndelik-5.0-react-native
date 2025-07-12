# 📱 Smart Ndelik 5.0

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

Aplikasi mobile **Smart Ndelik 5.0** adalah sebuah prototipe untuk mendeteksi kualitas biji kopi secara *real-time* menggunakan kamera ponsel. Aplikasi ini dibangun dengan **React Native** dan terhubung dengan layanan **Firebase** untuk backend.

## ✨ Fitur Utama

-   **Deteksi Objek:** Menggunakan kamera untuk mendeteksi biji kopi.
-   **Integrasi Model:** Terhubung dengan backend atau layanan yang menjalankan model deteksi (seperti YOLOv5).
-   **Komunikasi Real-time:** Menggunakan MQTT untuk menerima hasil deteksi.
-   **Antarmuka Pengguna:** UI/UX yang simpel dan fungsional dibangun dengan komponen React Native.

---

## 🔧 Teknologi yang Digunakan

-   **Frontend:** React Native
-   **Backend Services:** Firebase (Authentication, Firestore, Storage)
-   **Navigasi:** React Navigation
-   **Manajemen State:** (Sebutkan jika ada, misal: Redux atau Context API)
-   **Protokol Komunikasi:** MQTT

---

## 🚀 Memulai Proyek

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini di lingkungan pengembangan lokal Anda.

### 1. Prasyarat

Pastikan Anda sudah menginstal perangkat lunak berikut:
-   **Node.js** (versi 18 atau lebih tinggi)
-   **Yarn** atau **NPM**
-   **Lingkungan React Native** (ikuti panduan resmi [di sini](https://reactnative.dev/docs/environment-setup) untuk setup CLI)
-   **Android Studio** (untuk menjalankan di Android)
-   **Xcode** (untuk menjalankan di iOS, hanya di macOS)

### 2. Instalasi

1.  **Clone repository ini:**
    ```bash
    git clone [https://github.com/USERNAME/NAMA-REPO.git](https://github.com/USERNAME/NAMA-REPO.git)
    cd NAMA-REPO
    ```

2.  **Install semua dependency:**
    ```bash
    npm install
    # atau jika menggunakan Yarn
    yarn install
    ```

3.  **(Khusus iOS) Install Pods:**
    ```bash
    cd ios && pod install
    ```

### 3. Konfigurasi Firebase

Proyek ini membutuhkan kredensial Firebase untuk berfungsi.

1.  Buat file `.env` di direktori utama proyek.
2.  Salin dan tempelkan konfigurasi Firebase Anda ke dalamnya:

    ```env
    # Firebase Configuration
    API_KEY="AIzaSyC08Dj9pxNMpijJ5UtvDzwDf35Jv95TPq4"
    AUTH_DOMAIN="bijikopi-ec58e.firebaseapp.com"
    PROJECT_ID="bijikopi-ec58e"
    STORAGE_BUCKET="bijikopi-ec58e.appspot.com"
    MESSAGING_SENDER_ID="962221383374"
    APP_ID="1:962221383374:web:7eec88e688d1d74c95fa9f"
    MEASUREMENT_ID="G-L4K6ZGVDKC"
    ```

    > **Penting**: Pastikan file `.env` sudah ditambahkan ke dalam `.gitignore` Anda agar tidak terunggah ke repository publik.

### 4. Menjalankan Aplikasi

1.  **Jalankan Metro Bundler:**
    Buka terminal baru di direktori proyek dan jalankan:
    ```bash
    npx react-native start
    ```

2.  **Jalankan di Emulator/Device:**
    Biarkan terminal Metro tetap berjalan. Buka terminal lain dan jalankan:

    **Untuk Android:**
    ```bash
    npx react-native run-android
    ```

    **Untuk iOS:**
    ```bash
    npx react-native run-ios
    ```
