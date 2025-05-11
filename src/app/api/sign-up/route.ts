import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request){
    await dbConnect();
    const { email, username, password } = await request.json();

    try {
        const existingUser = await UserModel.findOne({ email, isVerified: true });
        if (existingUser) {
            return new Response(JSON.stringify({ success: false, message: "User already exists" }), { status: 409 });
        }

        const existingUserByEmail = await UserModel.findOne({email})

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail){
           if(existingUserByEmail.isVerified){
                return new Response(JSON.stringify({ success: false, message: "User already exists" }), { status: 409 });
           }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.expireVerifyCode = new Date(Date.now() + 60 * 60 * 1000); 

            await existingUserByEmail.save();
           }
        }else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1); // Set expiry date to 1 hour from now

            const newUser = new UserModel({
                email,
                username,
                password: hashedPassword,
                isVerified: false,
                verifyCode,
                expireVerifyCode: expiryDate,
                isAcceptingMessages: true,
                messages: [],
            });
    
            await newUser.save();
        }


        const emailResponse = await sendVerificationEmail(email, username, verifyCode);

        if (!emailResponse.success) {
            return new Response(JSON.stringify({ success: false, message: emailResponse.message }), { status: 500 });
        }

        return new Response(JSON.stringify({ success: true, message: "User registered successfully. Please verify your email." }), { status: 201 });

    } catch (error) {
        console.error("Error during registration:", error);
        return new Response(JSON.stringify({ success: false, message: "Internal server error" }), { status: 500 });
    }
} 