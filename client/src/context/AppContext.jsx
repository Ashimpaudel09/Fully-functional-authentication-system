import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  // Will be:
  //  local:      http://localhost:5000/api
  //  production: https://your-backend.vercel.app/api
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // axios instance so we don't repeat baseURL/withCredentials everywhere
  const api = axios.create({
    baseURL: backendUrl,
    withCredentials: true,
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const navigate = useNavigate();

  const getUserData = async () => {
    try {
      // hits:
      //   local:      http://localhost:5000/api/user/data
      //   production: https://your-backend.vercel.app/api/user/data
      const { data } = await api.get("/user/data");

      if (data.success) {
        setUserData(data.userData);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      setIsLoggedIn(false);
      setUserData(null);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to load user info"
      );
    } finally {
      setAuthReady(true);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const logout = async () => {
    try {
      // hits:
      //   local:      http://localhost:5000/api/auth/logout
      //   production: https://your-backend.vercel.app/api/auth/logout
      const { data } = await api.post("/auth/logout", {});

      if (data?.success) {
        toast.success(data.message || "Logged out");
      } else {
        toast.error(data.message || "Logout failed");
      }

      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Logout error");
    } finally {
      setIsLoggedIn(false);
      setUserData(null);
    }
  };

  const value = {
    backendUrl,
    isLoggedIn,
    userData,
    authReady,
    setIsLoggedIn,
    getUserData,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
