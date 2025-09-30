### 📝 Anonymous Q&A Inbox Project Concept Summary
**Objective** : To create a personalized, multi-user anonymous Q&A inbox system.

**Technology**: The project uses React for the user interface, styled with Tailwind CSS (Mobile First focus). The backend API and database are managed using Google Apps Script interfacing with Google Sheets.

**Design Style**: The design prioritizes a modern, clean look with Glassmorphism elements and high responsiveness.

### System Structure and Endpoints
The system divides functionality between the public frontend (React) and the self-managed backend (Apps Script).

Component / Function	Responsibility	Endpoint Type
RegisterForm.jsx	User Sign-up/Account Creation.	POST (action=register)
LoginForm.jsx	User Authentication.	GET (userId, loginKey)
KirimPesanAnonim.jsx	Anonymous Message Submission.	POST (action=send)
Dashboard.jsx	Displaying filtered inbox messages.	Receives data from doGet.

Ekspor ke Spreadsheet
Project Development Workflow
This workflow focuses on the sequential steps for both your responsibility (Apps Script/DB) and the AI agent's likely assistance area (ReactJS).

Step 1: Backend API Setup (User's Responsibility)

Google Sheets: You must set up two sheets: Users (with headers: UserID, LoginKey, NamaTampilan) and PesanAnonim (with headers: Tanggal, Pesan, Pengirim, RecipientID).

Apps Script (code.gs): You must implement the following core logic:

Registration (doPost?action=register): Check for unique UserID, generate LoginKey (UUID), and save to the Users sheet.

Login (doGet): Validate credentials, then filter PesanAnonim data by RecipientID.

Sending (doPost?action=send): Validate the existence of the RecipientID before saving the message.

Step 2: Frontend Implementation: Authentication Components

The AI agent can assist you in finalizing the RegisterForm.jsx and LoginForm.jsx components (which you will wire up to the endpoints you created in Step 1). These must handle loading states and display success/error messages (e.g., using SweetAlert2).

Step 3: Frontend Implementation: Core Interaction

The AI agent can assist in modifying KirimPesanAnonim.jsx to correctly read the recipientId from the URL parameter (?to=...) and include it in the POST payload (action=send).

The Dashboard.jsx component must be developed to consume the filtered data returned by your doGet function.

Step 4: Final Refinement

Implement React Router for smooth navigation.

Apply final Tailwind CSS refinements across all components, ensuring they are fully responsive and meet the Glassmorphism design standards.