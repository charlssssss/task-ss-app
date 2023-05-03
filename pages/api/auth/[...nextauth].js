import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

export const authOptions = {
  // Configure one or more authentication providers
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            type: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: "email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const { username, password } = credentials
                const { data } = await axios('http://127.0.0.1:8000/api/user/auth/login', { 
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json', 
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({ 
                        "email": username,
                        "password": password
                    }),
                }) 

                const user = data.data
                if (user) {
                    return user
                }
                // Return null if user data could not be retrieved
                return null
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: '/login',
        
    },
    callbacks: {
        async jwt ({ token, user }) {
            user && (token.user = user)
            return token
        },
        async session ({ session, token }) {
            session.user = token.user
            return session
        }
    }
}

export default NextAuth(authOptions)