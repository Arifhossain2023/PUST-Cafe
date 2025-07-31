import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import { Server } from 'socket.io';

import Stripe from 'stripe';

// ✅ dotenv properly loaded
import dotenv from 'dotenv';
dotenv.config(); // ✅ Must come before using any process.env variables

import { connectDB } from './config/bd.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import authRouter from './routes/authRoute.js';
import tableRouter from './routes/tableRoute.js';
import inventoryRouter from './routes/inventoryRoute.js';
import staffRouter from './routes/staffRoute.js';
import feedbackRouter from './routes/feedbackRoute.js';
import loyaltyRouter from './routes/loyaltyRoute.js';
import reportRouter from './routes/reportRoute.js';
import reservationRouter from './routes/reservationRoute.js';
import manualPaymentRoute from './routes/manualPaymentRoute.js';



const app = express();
const port = 4000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // In production, replace with your frontend domain
    methods: ["GET", "POST"]
  }
});

// ✅ Helmet Content Security Policy for Stripe
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://js.stripe.com", "'unsafe-inline'", "blob:"],
      frameSrc: ["'self'", "https://js.stripe.com"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      imgSrc: ["'self'", "data:", "https://*.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://*.stripe.com"],
    }
  })
);

app.use(express.json());
app.use(cors());
connectDB();

// ✅ test: ensure env loaded correctly
console.log("Stripe Secret Key Loaded:", process.env.STRIPE_SECRET_KEY);

app.use("/images", express.static('uploads'));

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('New client connected: ', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected: ', socket.id);
  });
});

// Pass io to other routes/controllers
app.set('io', io);

// API routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/auth", authRouter);
app.use("/api/table", tableRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/staff", staffRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/loyalty", loyaltyRouter);
app.use("/api/report", reportRouter);
app.use("/api/reservation", reservationRouter);
app.use('/api/payment', manualPaymentRoute);




// ✅ Stripe Test Route: এটা দিয়ে Stripe ঠিকমতো কাজ করছে কিনা বোঝা যাবে
app.get("/test-stripe", async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: { name: 'Test Item' },
          unit_amount: 10000,
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: "https://example.com/success",
      cancel_url: "https://example.com/cancel"
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error("Stripe Test Error:", error);
    res.status(500).json({ error: error.message });
  }
});



// Health check route
app.get("/", (req, res) => {
  res.send("API Working");
});

server.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
