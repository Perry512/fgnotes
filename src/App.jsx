import { useState } from "react";
import Signup from "./components/Signup";
import Dashboard from "./pages/Dashboard";
import { UserAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { Spinner } from "flowbite-react";

function App() {
  const { session, loading: authLoading } = UserAuth();
  const [loading, setLoading] = useState(true);

  useEffect (() => {
    if (session !== undefined) {
      setLoading(false);
    }
  }, [session]);

  if (loading || authLoading) return <Spinner size="xl" className="flex justify-center items-center h-screen" />;

  return <>{session ? <Dashboard /> : <Signup />}</>;
}

export default App;