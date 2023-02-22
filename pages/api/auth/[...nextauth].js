import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

export const authOptions = {
  // Configure one or more authentication providers
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            type: 'credentials',
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            // credentials: {},
            credentials: {
                email: { label: "email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {

                const { username, password } = credentials
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                // if(email !== "test@gmail.com" || password !== '1234') {
                //     return null
                // }

                // return {id: '1234', name: 'Test', email: 'test@gmail.com'}
                
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
                // const res = await axios('http://127.0.0.1:8000/api/user/auth/login', {
                //     method: 'POST',
                //     headers: {
                //         'Accept': 'application/json', 
                //         'Content-Type': 'application/json'
                //     },
                //     data: JSON.stringify({ 
                //         "email": email,
                //         "password": password
                //     }),
                // })

                // const user = await res.json()
                
                // const res = await fetch('http://127.0.0.1:8000/api/user/auth/login', {
                // method: 'POST',
                // body: JSON.stringify({
                //     "email": email,
                //     "password": password
                // }),
                // headers: { "Content-Type": "application/json" }
                // })
                // const user = await res.json()

                // If no error and we have user data, return it
                console.log(user)
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
        signIn: '/auth/login',
        
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