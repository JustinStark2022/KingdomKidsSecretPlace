import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";

export const useAuth = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/users/me").then((res) => {
      if (res.data) {
        setCurrentUser(res.data);
      }
      setLoading(false);
    });
  }, []);

  const login = async (credentials: any) => {
    try {
      const res = await axios.post("/api/auth/login", credentials);
      const user = res.data.user;
      setCurrentUser(user);
      return { success: true, user }; 
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const signup = async (credentials: any) => {
    try {
      const res = await axios.post("/api/auth/signup", credentials);
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  return {
    currentUser,
    login,
    signup,
    isLoading: loading,
    isError: !loading && !currentUser,
    fetchUser: () => {
      setLoading(true);
      axios.get("/api/users/me")
        .then((res) => {
          setCurrentUser(res.data);
        })
        .catch(() => {
          setCurrentUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
};

export default useAuth;