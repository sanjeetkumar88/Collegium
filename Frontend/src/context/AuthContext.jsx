import { createContext, useContext, useEffect, useState } from "react";
import axios from "../utils/axios";
import LoadingText from "../components/LoadingText";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  // Auto-fetch user on mount (from /verify route)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/users/verify", { withCredentials: true });
        setAuthUser(res.data.user); 
      } catch (err) { 
        setAuthUser(null);
      } finally {
        setLoading(false);
      }
    };  
    fetchUser();
  }, []);

  const login = (userData) => {
    setAuthUser(userData);
  };

  const logout = async () => {
    try {
      await axios.post("/users/logout", {}, { withCredentials: true });
      setAuthUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  if(loading){
    return <LoadingText />
      
    
  }

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, logout ,login}}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
