#  CashWeb - Banking API

CashWeb is a secure and efficient banking RESTful API built with **Node.js**, **Express.js**, and **MongoDB**. The API allows users to register, log in, view balances, and perform financial transactions such as transfers, withdrawals, and deposits. Authentication is handled using **JWT tokens**, and Swagger is used for API documentation.

---

---

## 🚀 Features

-  User registration and login with password hashing
-  JWT-based authentication
-  View current user profile (`/me`)
-  Transfer money to other users
-  Deposit and withdraw from your account
-  View all transactions, or filter by sent/received
-  Daily withdrawal limit (max 3 per day)
-  Pagination for transaction history
-  Swagger documentation at `/api-docs`


---

##  Technologies Used

- **Node.js** / **Express.js**
- **MongoDB** / **Mongoose**
- **JWT** for authentication
- **bcrypt** for password hashing
- **Swagger (OpenAPI 3)** for API documentation
- **Postman** for route testing

