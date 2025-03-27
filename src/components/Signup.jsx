import { React, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export const Signup = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState('');

    const { session, signUpNewUser } = UserAuth();
    const navigate = useNavigate()

    console.log(email, password);

    const handleSignUp = async(e) => {
        e.preventDefault()
        setLoading(true)
        setError('');

        try{
            const result = await signUpNewUser(email, password);

            if(result.success) {
                navigate('/dashboard')
            } else {
                setError(result.error || "An error occurred during signup.");
            }
        } catch (error) {
            setError("an error occured")
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <form onSubmit={handleSignUp} className="max-w-md m-auto pt-24">
                <h2 className="font-bold pb-2"> Sign up </h2>
                <p> 
                    Already have account? <Link to='/signin'> Click here </Link>
                </p>
                <div className="flex flex-col py-4">
                    <input onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="p-3 mt-2" type="email"/>
                    <input onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="p-3 mt-2" type="password"/>
                    <button className="mt-6 w-full" type="submit" disabled={loading}> Sign up</button>
                    {error && <p className="text-red-600 text-center pt-4">{error}</p>}
                </div>
            </form> 
        </div>
    )
}

export default Signup;