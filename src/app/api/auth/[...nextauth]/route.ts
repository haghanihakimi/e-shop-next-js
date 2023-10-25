import NextAuth from "next-auth";
import { authOptions } from "@/utils/authOptions";
import axios from "axios";

const handler = NextAuth(authOptions);

export default handler;
// export { handler as GET, handler as POST };