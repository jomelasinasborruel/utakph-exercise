"use client";
import useAuthContext from "@/lib/useAuthContext";
import { Tooltip } from "@mui/material";
import React, { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";

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
