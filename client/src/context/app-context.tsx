import { createContext, ReactNode, useState, useEffect } from "react";
import IUser from "../models/user";

export const AppContext = createContext<any>(null);

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("current-user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem("current-user", JSON.stringify(currentUser));
    } else {
      sessionStorage.removeItem("current-user");
    }
  }, [currentUser]);

  return <AppContext.Provider value={{ currentUser, setCurrentUser }}>{children}</AppContext.Provider>;
};

export default AppProvider;
