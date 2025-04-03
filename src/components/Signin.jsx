import { React, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export const Signin = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState('');

    const { session, signInUser } = UserAuth();
    const navigate = useNavigate();
    // console.log(email, password, error);

    const handleSignIn = async(e) => {
        e.preventDefault();
        const result = await signInUser(email, password);

        if (error) {
            setError(error);

            setTimeout(() => {
                setError("");
            }, 3000);
        } else {
            navigate("/dashboard");
        }

        if (session) {
            setError("");
        }
    }

    return (
        <div> 
            <form onSubmit={handleSignIn} className="max-w-md m-auto pt-24">
                <h2 className="font-bold pb-2"> Sign In </h2>
                <p>
                    New here? <Link className="hover:cursor:pointer" to='/signup'> Click here </Link>
                </p>
                <div className="flex flex-col py-4">
                    <input onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="p-3 mt-2" type="email"/>
                    <input onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="p-3 mt-2" type="password" name="password" id="password"/>
                    <button className="mt-6 w-full" type="submit" disabled={loading}> Sign in </button>
                    {error && <p className="text-red-600 text center pt-4"> {error} </p>}
                </div>
            </form>
        </div>
    )
}

export default Signin;