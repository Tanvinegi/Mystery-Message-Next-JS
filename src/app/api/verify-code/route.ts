import UserModel from "@/model/User";
import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import { verifySchema } from "@/schemas/verifySchema";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });
    // const parsedBody = verifySchema.safeParse(body);

    if (!user) {
      return Response.json(
        { success: false, message: "User not found." },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === code;

    const isCodeNotExpired = new Date(user.expireVerifyCode) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;

      await user.save();
      return Response.json(
        { success: true, message: "User verified successfully" },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        { success: false, message: "Code expired" },
        { status: 400 }
      );
    } else {
      return Response.json(
        { success: false, message: "Invalid code" },
        { status: 400 }
      );
    }
  } catch (error) {
    return Response.json(
      { success: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
}
