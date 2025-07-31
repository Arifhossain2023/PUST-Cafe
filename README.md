# PUST Cafeteria Management System

A full-featured cafeteria system built for PUST using React, Node.js, and MongoDB.

## Features

- Table Reservation System, Food Orders Dine in or Home Delevery
- Kitchen Panel with Ingredient Tracking
- POS Panel for Order Placement
- Admin Dashboard: Food, Staff, Inventory, Loyalty, Reports
- Billing Panel with PDF Download, Manual Mobile pay
- Role-Based Authentication (Admin, Waiter, Kitchen, Cashier)

## Tech Stack

- Frontend: React, CSS
- Backend: Node.js, Express.js
- Database: MongoDB (via Mongoose)

##  Run Locally

```bash
# clone project
git clone https://github.com/Arifhossain2023/PUST-Cafe.git
cd PUST-Cafe

# install backend dependencies
cd backend
npm install
npm start

# install frontend dependencies
cd ../pos
npm install
npm run dev
