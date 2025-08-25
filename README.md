# 📚 Rentellect – ML-Powered Intra-Campus Book Rental Platform

Rentellect is a **full-stack web application** designed for universities where students can **rent or lend books within their campus**.  
The platform integrates **machine learning**, **real-time communication**, and **secure payments** to ensure reliability and a smooth user experience.

---

## 📑 Table of Contents
- [✨ Features](#-features)  
- [🛠 Tech Stack](#-tech-stack)  
- [🚀 Usage](#-usage)  
- [🔮 Future Scope](#-future-scope)  
- [ℹ️ About](#ℹ️-about)

---

## ✨ Features

- 🔐 **Authentication** – Secure login/signup with **JWT**  
- 📖 **Book Listings & Cart** – Add, browse, and rent books  
- 🤖 **Condition Detection (ML)** – Book images analyzed with a custom ML model (**Teachable Machine**) to verify condition & prevent false listings  
  - ⚠️ Since the dataset used was limited, predictions may not always be 100% accurate  
  - ✅ Under correct conditions (good lighting & proper upload order), results are reliable  
- 💬 **Real-Time Chat & Notifications** – Powered by **Socket.IO**  
- 💳 **Payments** – Integrated with **Razorpay** for smooth transactions  
- 🗂 **User Dashboard** – Manage owned and rented books with live updates  
- 📱 **Responsive Design** – Neumorphic interface styled with **Tailwind CSS**

---

## 🛠 Tech Stack

| Technology               | Purpose                                |
|---------------------------|----------------------------------------|
| React                    | Frontend UI                           |
| Node.js                  | Backend runtime                       |
| Express.js               | Backend API                           |
| MongoDB                  | Database                              |
| JWT                      | Authentication                        |
| Socket.IO                | Real-time chat & notifications        |
| Razorpay                 | Secure payments                       |
| Tailwind CSS             | Styling + Neumorphic UI               |
| Google Teachable Machine | ML-based condition detection          |

---

## 🚀 Usage

- 📖 **Book Listings** – Upload and browse available books inside the campus network  
- 🤖 **Condition Detection** – Upload book images → ML model predicts its condition automatically  
- 💳 **Rent/Pay Securely** – Seamless **Razorpay** integration for transactions  
- 💬 **Real-Time Communication** – Chat with peers + instant notifications about availability  
- 🗂 **Dashboard** – Manage requests, owned books, and borrowed books all in one place  

---

## 🔮 Future Scope

- 🗺 **Location Mapping** – Pickup/drop-off tracking within campus  
- ⭐ **Reviews & Ratings** – Peer & book ratings to improve trust  

---

## ℹ️ About

✨ **Rentellect** brings together **web development, machine learning, and fintech integration** into one complete project—perfect for fostering intra-campus knowledge sharing, saving money, and promoting sustainability.  

---
