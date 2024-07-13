// "use client";

// import { gql } from "@/__generated__";
// import { JWTPayload } from "@gallery/backend";
// import { toUser } from "@/lib/utils";
// import { useLazyQuery } from "@apollo/client";
// import {
//   createContext,
//   ReactNode,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import { useMutation } from "@tanstack/react-query";

// type AuthContextType = {
//   user: JWTPayload | null;
//   login: (options: { email: string; password: string }) => Promise<void>;
//   loginLoading: boolean;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<JWTPayload | null>(null);
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setUser(null);
//       setIsReady(true);
//     }

//     // TODO: Check if token is valid

//     const user = toUser(token as string);
//     setUser(user);
//     setIsReady(true);
//   }, []);

//   const [loginQuery, { loading: loginLoading }] = useLazyQuery(LOGIN);
//   useMutation({
//     mutationFn:
//   })

//   const login = async (options: { email: string; password: string }) => {
//     const response = await loginQuery({ variables: options });
//     const token = response.data?.login.token;
//     if (token) {
//       localStorage.setItem("token", token);
//       const user = toUser(token);
//       setUser(user);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, loginLoading, logout }}>
//       {isReady && children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// const LOGIN = gql(`
//     query Login($email: String!, $password: String!) {
//         login(email: $email, password: $password) {
//         token
//         }
//     }
// `);
