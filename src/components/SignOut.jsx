import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext"

const SignOut = () => {
    const { signOut } = UserAuth();
    const navigate = useNavigate();

    const handleSignOut = async (e) => {
        e.preventDefault();

        try {
            await signOut();
            navigate("/");
        } catch (error) {
            setError("An unexpected error has occured: ", error);
        }
    };

    return (
        <p 
            onClick={handleSignOut}
            className="hover:cursor-pointer border inline-block px-4 py-3 mt-4" 
        >
            Signout 
        </p>
    )
}

export default SignOut;