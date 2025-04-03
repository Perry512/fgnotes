import { useState, useEffect } from "react";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard"; // Replace with your main app component
import { UserAuth } from "./context/AuthContext";

function App() {
  const { user } = UserAuth(); // Get user from AuthContext
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user !== undefined) {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <p>Loading...</p>; // Prevents flashing before user is determined

  return <>{user ? <Dashboard /> : <Signup />}</>;
}

export default App;