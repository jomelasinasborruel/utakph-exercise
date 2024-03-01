"use client";
import useAuthContext from "@/lib/useAuthContext";
import { Tooltip } from "@mui/material";
import { FiLogOut } from "react-icons/fi";

export default function Settings() {
  const { logout } = useAuthContext();
  return (
    <Tooltip title={"Logout"}>
      <button onClick={logout}>
        <FiLogOut />
      </button>
    </Tooltip>
  );
}
