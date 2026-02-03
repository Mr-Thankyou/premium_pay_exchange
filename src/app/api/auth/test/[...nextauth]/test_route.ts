// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { connectDB } from "@/lib/mongodb";
// import User from "@/models/User";
// import { compare } from "bcryptjs";

// const handler = NextAuth({
//   session: {
//     strategy: "jwt",
//   },

//   providers: [
//     CredentialsProvider({
//       name: "Credentials",

//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },

//       async authorize(credentials) {
//         await connectDB();

//         const user = await User.findOne({ email: credentials?.email });

//         if (!user) throw new Error("User does not exist");

//         const isPasswordCorrect = await compare(
//           credentials!.password,
//           user.password
//         );

//         if (!isPasswordCorrect) throw new Error("Invalid password");

//         return {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//         };
//       },
//     }),
//   ],

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//       }
//       return token;
//     },

//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.id;
//       }
//       return session;
//     },
//   },

//   pages: {
//     signIn: "/login",
//   },
// });

// export { handler as GET, handler as POST };
