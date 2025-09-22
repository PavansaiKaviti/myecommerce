import connectdb from "@/config/mongoose/Mongoosedb";
import User from "@/models/usermodel/Usermodel";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "dummy-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy-client-secret",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await connectdb();

          const { email, password } = credentials;

          if (!email || !password) {
            return null;
          }

          // Find user with password
          const user = await User.findOne({
            email: email.toLowerCase(),
          }).select("+password");

          if (!user) {
            return null;
          }

          // Check if account is locked
          if (user.isLocked) {
            throw new Error(
              "Account is temporarily locked due to too many failed attempts"
            );
          }

          // Check if account is active
          if (!user.isActive) {
            throw new Error("Account is deactivated");
          }

          // Check if user has password (Google-only users)
          if (!user.password) {
            throw new Error(
              "This account was created with Google. Please use Google sign-in or create a password to link your account."
            );
          }

          // Compare password
          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            // Increment login attempts
            await user.incLoginAttempts();
            return null;
          }

          // Reset login attempts on successful login
          await user.resetLoginAttempts();

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            username: user.username,
            image: user.image,
            isAdmin: user.isAdmin,
          };
        } catch (error) {
          console.error("Credentials auth error:", error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectdb();

        if (account?.provider === "google") {
          // Handle Google sign-in
          const existingUser = await User.findOne({ email: profile.email });

          if (!existingUser) {
            // Create new user
            const username = profile.name.slice(0, 20).replace(/\s+/g, "_");
            await User.create({
              name: profile.name,
              email: profile.email,
              username,
              image: profile.picture,
              emailVerified: true, // Google accounts are pre-verified
            });
          } else {
            // Update existing user's Google info if needed
            if (!existingUser.image && profile.picture) {
              existingUser.image = profile.picture;
              await existingUser.save();
            }
          }
        }

        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        await connectdb();
        const dbUser = await User.findOne({ email: user.email });

        if (dbUser) {
          token.userId = dbUser._id.toString();
          token.isAdmin = dbUser.isAdmin;
          token.username = dbUser.username;
          token.hasPassword = !!dbUser.password;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId;
        session.user.username = token.username;
        session.isAdmin = token.isAdmin;
        session.hasPassword = token.hasPassword;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
  debug: process.env.NODE_ENV === "development",
};
