"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { UserDetailContext } from "@/context/UserDetailContext";

function Provider({ children }) {
  const { user } = useUser();
  const [userDetail,setUserDetail]=useState();

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      CreateNewUser();
    }
  }, [user]);

  const CreateNewUser = async () => {
    try {
      const result = await axios.post("/api/user", {
        name: user?.fullName || user?.firstName || "No Name",
        email: user?.primaryEmailAddress?.emailAddress,
      });
      console.log("User created:", result.data);
      setUserDetail(result.data);
    } catch (err) {
      console.error("CreateNewUser error:", err.response?.data || err.message);
    }
  };

  return (
  <UserDetailContext.Provider value = {{userDetail,setUserDetail}}>
  <div>{children}</div>
  </UserDetailContext.Provider>
  )
}

export default Provider;
