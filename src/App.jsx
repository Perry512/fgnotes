import { useState, useEffect } from "react";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import { UserAuth } from "./context/AuthContext";

function App() {
  const { user } = UserAuth();
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   if (user !== undefined) {
  //     setLoading(false);
  //   }
  // }, [user]);

  // if (loading) return <p>Loading...</p>;

  return <>{user ? <Dashboard /> : <Signup />}</>;
}

export default App;