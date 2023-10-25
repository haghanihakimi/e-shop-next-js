import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import axios from "axios";

const authOptions: NextAuthOptions = {
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password", placeholder: "Password" }
            },
            async authorize(credentials) {
                const response = await axios.post('http://localhost:3000/api/auth/singin', credentials);

                switch (response.status) {
                    case 200:
                        return response.data;
                    default:
                        return null;
                }
            },
        })
    ],
    // callbacks: {
    //     async session({ session, token }) {
    //         const response = await axios.get('http://localhost:3000/api/user/profile', {
    //             params: {
    //                 user: token.email,
    //             },
    //         });

    //         if (response.status === 200 && response.data) {
    //             session.user.id = response.data.id;
    //             session.user.firstname = response.data.firstname;
    //             session.user.lastname = response.data.surname;
    //             session.user.phone = response.data.phone;
    //             session.user.image = response.data.photo;
    //             session.user.street = response.data.street;
    //             session.user.city = response.data.city;
    //             session.user.state = response.data.state;
    //             session.user.postcode = response.data.postcode;
    //             session.user.country = response.data.country;
    //             session.user.token = token;
    //         }

    //         return session;
    //     },
    // },
    pages: {
        signIn: '/auth/signin',
        // signOut: '/auth/singin'
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
// export { handler as GET, handler as POST };