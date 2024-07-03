import { getServerSession } from "next-auth/next";
import { authOptions } from "../Google/Authprovider";

export const getuser = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return null;
    }
    return {
      user: session.user,
      userid: session.user.id,
      isAdmin: session.isAdmin,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
