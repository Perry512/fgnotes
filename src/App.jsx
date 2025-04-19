import Signup from "./components/Signup";
import Dashboard from "./pages/Dashboard";
import { UserAuth } from "./context/AuthContext";

function App() {
  const { session } = UserAuth();
  // const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   if (user !== undefined) {
  //     setLoading(false);
  //   }
  // }, [user]);

  // if (loading) return <p>Loading...</p>;

  return <>{session ? <Dashboard /> : <Signup />}</>;
}

export default App;