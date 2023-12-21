"use client";
import { useRouter } from "next/navigation";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import firebaseConfig from "./firebaseconfig.js";
import { initializeApp } from "firebase/app";
import { useState } from "react";
import style from "./auth.module.css";
import Cookies from "js-cookie";

const app = initializeApp(firebaseConfig);

export default function Auth() {
  const router = useRouter();
  const [login, setLogin] = useState(true);

  const auth = getAuth(app);

  const handleLogin = async (email, password) => {
    const response = await signInWithEmailAndPassword(auth, email, password);
    if (response) {
        console.log(response.user.accessToken)
        Cookies.set("userAuthToken", response.user.accessToken);
        router.push("/search");
    }
  };
  
  const handleRegister = async (email, password) => {
    const response = await createUserWithEmailAndPassword(auth, email, password);
    if (response) {
        Cookies.set("userAuthToken", response.user.accessToken);
        router.push("/search");
    }
  };

  return (
    <main className={style.loginOrSignUp}>
    {login ? (
     <div className={style.mainDiv}>
        <LoginForm onLogin={handleLogin} />
        <h4 style={{ marginTop: "1rem" }}>Not have account ? {" "}
            <span onClick={(e) => setLogin(false)} style={{ cursor: "pointer", textDecoration: "underline" }}>
                Sign Up
            </span>
        </h4>
     </div>
     ) : (
     <div className={style.mainDiv}>
        <RegisterForm onRegister={handleRegister} />
        <h4 style={{ marginTop: "1rem" }}>Already have account ? {" "}
            <span onClick={(e) => setLogin(true)} style={{ cursor: "pointer", textDecoration: "underline" }}>
                Log In
            </span>
        </h4>
     </div>
     )}
     </main>
  )
}

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    await onLogin(email, password);
  };

  return (
    <>
        <h2>Login</h2>
        <form className={style.loginForm} onSubmit={handleLoginSubmit}>
            <div>
            <h5>Email:</h5>
            <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
            />
            </div>
            <div>
            <h5>Password:</h5>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}  
            />
            </div>
            <button className={style.loginButton} type="submit">Log In</button>
        </form>
    </>
  );
}

function RegisterForm({ onRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    
    await onRegister(email, password);
    };

    return (
        <>
            <h2>Sign Up</h2>
            <form className={style.loginForm} onSubmit={handleSignUpSubmit}>
                <div>
                <h5>Email:</h5>
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                />
                </div>
                <div>
                <h5>Password:</h5>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}  
                />
                </div>
                <button className={style.loginButton} type="submit">Sign Up</button>
            </form>
        </>
    );

} 