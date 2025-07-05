import connectdb from "@/config/mongoose/Mongoosedb";
import User from "@/models/usermodel/Usermodel";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  pages: {
    signIn: "/signin",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      // 1.connect to db
      await connectdb();
      // 2.check user exists
      const user = await User.findOne({ email: profile.email });
      // 3.if not add user
      if (!user) {
        //Truncate user name if too long
        const username = profile.name.slice(0, 20);
        await User.create({
          email: profile.email.toString(),
          username,
          image: profile.picture,
        });
      }
      // 4.return true
      return true;
    },
    //modify user and add userid to session
    async session({ session }) {
      await connectdb();
      // 1. get user from db
      const user = await User.findOne({ email: session.user.email });
      // 2. assign  user to session
      session.user.id = user._id.toString();
      session.isAdmin = user.isAdmin;
      // 3. return session
      return session;
    },
  },
};
