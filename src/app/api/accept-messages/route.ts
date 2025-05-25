import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user as User;
  if (!session || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const userId = user.id;

  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages: acceptMessages,
      },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        { success: false, message: "Failed to update the user." },
        { status: 500 }
      );
    }

    if (updatedUser) {
      return Response.json(
        {
          success: true,
          message: "User preferences updated successfully",
          updatedUser,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user as User;
  if (!session || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const userId = user.id;

  const foundUser = await UserModel.findById(userId);

  try {
    if (!foundUser) {
      return Response.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User found.",
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return new Response(
      JSON.stringify({ error: "Error in getiing message accepting error." }),
      {
        status: 500,
      }
    );
  }
}
