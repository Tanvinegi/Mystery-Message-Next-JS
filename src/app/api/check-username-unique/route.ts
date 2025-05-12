import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import { userNameSchema } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: userNameSchema,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    // Validate the query parameter with zod
    const parsedQuery = UsernameQuerySchema.safeParse(queryParam);

    if (!parsedQuery.success) {
      const usernameError = parsedQuery.error.format().username?._errors || [];
      return Response.json(
        { success: false, message: usernameError[0] || "Invalid username" },
        { status: 400 }
      );
    }

    const { username } = parsedQuery.data;

    const existingUserVerified = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerified) {
      return Response.json(
        { success: false, message: "User is already taken." },
        { status: 400 }
      );
    }
    return Response.json(
      { success: true, message: "User is available" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error, "Error");
    return Response.json(
      { success: false, message: "Database connection failed" },
      { status: 500 }
    );
  }
}
