import { useContext } from "react";
import { AppContext } from "../context/app-context";

const useUser = () => {
  const { currentUser, setCurrentUser } = useContext(AppContext);

  return { currentUser, setCurrentUser };
};

export { useUser };
