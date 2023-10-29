import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import jwt from "jwt-decode";
// import jwt from "jwt-decode";
// const appKey = "secretkey";

const AuthContext = createContext();

const initialState = {
  Token: null,
  isAuthenticated: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      // localStorage.setItem("user", JSON.stringify(action.payload.user));
      // localStorage.setItem("token", JSON.stringify(action.payload.token));

      return {
        ...state,

        Token: action.payload,
        isAuthenticated: true,
      };
    case "logout":
      return { ...state, Token: null, isAuthenticated: false };
    default:
      throw new Error("Unknown action");
  }
}

// const FAKE_USER = {
//   name: "Jack",
//   email: "jack@example.com",
//   password: "qwerty",
//   avatar: "https://i.pravatar.cc/100?u=zz",
// };

function AuthProvider({ children }) {
  const [{ Token, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    // 麻煩不要改上面這一行，會全部API報錯
    const token = localStorage.getItem("token");
    if (data && token) {
      setUserId(data.id);
      dispatch({ type: "login", payload: jwt(token) });
    }
  }, []);
  console.log(userId);
  function login(token) {
    dispatch({ type: "login", payload: token });
  }
  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{ Token, isAuthenticated, login, logout, userId, setUserId }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  return context;
}

export { AuthProvider, useAuth };
