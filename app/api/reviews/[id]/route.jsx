import connectdb from "@/config/mongoose/Mongoosedb";
import Message from "@/models/messagemodel/Messagemodel";
import User from "@/models/usermodel/Usermodel";
import { getuser } from "@/utils/getuser/User";

export const GET = async (request, { params }) => {
  try {
    const { id } = params;

    // Connect to the database
    await connectdb();

    // Check if the ID is provided
    if (!id) {
      return new Response(JSON.stringify({ message: "ID not provided" }), {
        status: 400,
      });
    }
    // Fetch messages associated with the product
    const messages = await Message.find({ product: id }).populate("user");
    if (!messages) {
      return new Response(JSON.stringify({ message: "No reviews found" }), {
        status: 404,
      });
    }

    // Return the messages
    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching data:", error);

    // Return an internal server error response
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
    });
  }
};

export const DELETE = async (request, { params }) => {
  try {
    const { id } = params;
    const { user } = await getuser(); // Assumes getUser() is defined somewhere to get the current user

    const findUser = await User.findById(user.id);
    if (!findUser) {
      return new Response(JSON.stringify({ message: "Not logged in" }), {
        status: 401,
      });
    }

    const findMessage = await Message.findById(id);
    if (!findMessage) {
      return new Response(JSON.stringify({ message: "Message not found" }), {
        status: 404,
      });
    }

    // Ensure you use .equals() for ObjectId comparison
    if (!findUser._id.equals(findMessage.user)) {
      return new Response(JSON.stringify({ message: "Access denied" }), {
        status: 403,
      });
    }

    await Message.findByIdAndDelete(id);

    return new Response(
      JSON.stringify({ message: "Message deleted successfully" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
