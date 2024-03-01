import { AuthContext } from "@/contexts/SessionProvider/AuthContext";
import { useContext } from "react";

function useAuthContext(): AuthContextProps {
  const authContext = useContext(AuthContext)!;
  return authContext;
}

export default useAuthContext;
