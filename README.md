# 💬 YTTA-AJA: Anonymous Messaging App (React + Google Apps Script)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Technology: React](https://img.shields.io/badge/Frontend-React%20%7C%20Vite-61DAFB?logo=react)](https://react.dev/)
[![Technology: Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Technology: Google Apps Script](https://img.shields.io/badge/Backend-Google%20Apps%20Script-3F51B5?logo=google)](https://developers.google.com/apps-script)

A simple web application for sending and receiving secret messages **anonymously**. This project serves as an experiment in utilizing **Google Sheets as a Serverless Database** through a **Google Apps Script** (GAS) web API endpoint.

## 🚀 Key Features

* **Anonymous Messaging**: Senders don't need to log in or register.
* **Unique Share Link**: Each registered user gets a unique link (`/send/:userId`) to receive messages.
* **Authentication**: Simple Login/Register using a `userId` and a secure `loginKey`.
* **Modern UI**: Elegant **Cyber/Neon Theme** (Red & Orange Palette) powered by **Tailwind CSS**.
* **Modal Viewer**: Full message viewer with a cool *backdrop blur* effect.

## 🛠️ Tech Stack

### Frontend
* **React.js (Vite)**
* **React Router DOM**
* **Tailwind CSS** (Custom Neon Red/Orange Palette)
* **SweetAlert2** (For stylish notifications)
* **React Bootstrap Icons**

### Backend / Database
* **Google Apps Script (GAS)**: Acts as the *Web API* to handle `register`, `login`, and `send` requests.
* **Google Sheets**: Used as the primary *database* to store user and message data.

## ⚙️ Installation and Setup

### 1. Backend (Google Apps Script)

1.  **Prepare Google Sheets:** Create a new Google Sheet with two tabs: `Users` and `Messages`.
    * **`Users` Sheet** (Required columns): `userId`, `loginKey`, `namaTampilan`
    * **`Messages` Sheet** (Required columns): `recipientId`, `Pengirim`, `Pesan`, `Tanggal`
2.  **Deploy Apps Script:** Copy the Google Apps Script code (your **`code.gs`**) into the GAS editor.
3.  **Deploy as Web App:** Publish the script and note down the resulting **`ANONYMOUS_API_URL`**.

### 2. Frontend (React)

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/Arman1862/ytta-aja.git
    cd ytta-aja
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Configure API URL:**
    Create the file **`src/config/api.js`** (if it doesn't exist) and input your deployed Apps Script URL:

    ```javascript
    // src/config/api.js
    export const ANONYMOUS_API_URL = "[https://script.google.com/macros/s/](https://script.google.com/macros/s/)[YOUR_GAS_ID]/exec"; 
    // Replace [YOUR_GAS_ID] with your deployment ID
    ```
4.  **Run the Application:**
    ```bash
    npm run dev
    ```
    The app will be running at `http://localhost:5173/` (or another port).

## 💡 Design & Theme

This application uses a **Neon Cyberpunk** theme with a dominant color palette of Neon Red (`#FF3366`) and Bright Orange (`#FF9933`). All styling is managed via **Tailwind CSS**.

* Custom colors can be found in `tailwind.config.cjs`.
* A *glassmorphism* effect is applied to most main cards (`bg-white/5 backdrop-blur-xl`).

## 👨‍💻 Contributor

This project was developed by **Arman - Muhammad Arjuna Mahendratama** while studying at SMKN 53 Jakarta.

> *Feedback and suggestions are highly appreciated!*