import { AuthContext } from "@/contexts/AuthContaxt";
import React, { useContext } from "react";

function useAuthContext(): AuthContextProps {
  const authContext = useContext(AuthContext)!;
  return authContext;
}

export default useAuthContext;
