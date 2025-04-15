// client/src/hooks/useAuth.ts
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { apiRequest } from "@/lib/queryClient";

export const useAuth = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.username) {
      setLoading(false);
      return;
    }

    axios.get(`/api/auth/me?username=${currentUser.username}`)
      .then((res) => {
        if (res.data) {
          setCurrentUser(res.data);
        }
      })
      .catch(() => {
        setCurrentUser(null);
      })
      .finally(() => {
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
      const res = await apiRequest("POST", "/api/auth/signup", credentials);
      const data = await res.json();
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  const fetchUser = () => {
    if (!currentUser?.username) return;

    setLoading(true);
    axios.get(`/api/auth/me?username=${currentUser.username}`)
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch(() => {
        setCurrentUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    currentUser,
    login,
    signup,
    isLoading: loading,
    isError: !loading && !currentUser,
    fetchUser,
  };
};

export default useAuth;
