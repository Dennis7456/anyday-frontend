import React, { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const UserContext = createContext();

export const UserProvider = (props) => {
  const [user, setUser] = useState({
    id: "",
    first_name: "",
    last_name: "",
    username: "",
    role: "",
    qaulifications: [],
    grade: "",
  });

  const loginState = (token, user) => {
    localStorage.setItem("token", token);
    setUser(user);
  };

  const logoutState = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = { user, setUser, loginState, logoutState };

  return (
    <UserContext.Provider value={{ value }}>
      {props.children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node,
};

export const useUserContext = () => {
  return useContext(UserContext);
};

export default UserContext;
