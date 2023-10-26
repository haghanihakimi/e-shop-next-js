import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import axios from "axios";

export const authOptions: NextAuthOptions = {
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
    pages: {
        signIn: '/auth/signin',
    }
};