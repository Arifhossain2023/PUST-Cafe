import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://arif:arif190612@cluster0.wucgu7e.mongodb.net/PUST_Cafeteria').then(()=>console.log("DB Connected"));
}

