import React, {
    createContext,
    useReducer,
    useContext,
    useState,
    useEffect,
    useMemo,
  } from "react";
  import { Platform } from "react-native";
  import { getItemAsync, setItemAsync, deleteItemAsync } from "../utils/storage";
  
  const AuthContext = createContext();
  
  const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(
      (prevState, action) => {
        switch (action.type) {
          case "RESTORE_TOKEN":
            return {
              ...prevState,
              // userToken: action.token,
              isLoading: false,
              user: action.user,
            };
          case "SIGN_IN":
            console.log("in AuthProvider SIGN_IN");
            console.log("action is:", action);
            // console.log('AuthProvider SIGN_IN token:', action.token);
            console.log("AuthProvider SIGN_IN user:", action.user);
            return {
              ...prevState,
              isSignout: false,
              // userToken: action.token,
              user: action.user, // Store user information into state
            };
          case "SIGN_OUT":
            return {
              ...prevState,
              isSignout: true,
              // userToken: null,
              user: null, // Clear user information on sign-out
            };
          default:
            return { ...prevState };
        }
      },
      {
        isLoading: true,
        isSignout: false,
        // userToken: null,
        user: null, // Initialize user as null
      }
    );
  
    useEffect(() => {
      const bootstrapAsync = async () => {
        // let userToken = null;
        let user = null;
        let userString = null;
        try {
          // Restore token stored in `SecureStore` or any other encrypted storage
          // userToken = await getItemAsync('userToken');
          userString = await getItemAsync("user"); // TODO: change to make new reqeust on production
          user = JSON.parse(userString);
          // console.log('Got userToken:', userToken); // TODO: REMOVE DEBUG PRINT ON PROD
          console.log("Got user:", user); // TODO: REMOVE DEBUG PRINT ON PROD
        } catch (e) {
          // Restoring token failed
          console.log("Error in restoring token:", e);
        }
  
        // After restoring token, we may need to validate it in production apps
  
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        // dispatch({ type: 'RESTORE_TOKEN', token: userToken, user: user});
        dispatch({ type: "RESTORE_TOKEN", user: user });
      };
  
      bootstrapAsync();
    }, []);
  
    useEffect(() => {
      if (state.user) {
        console.log("User is logged in: ", state.user);
      } else {
        console.log("No user is logged in");
      }
    }, [state.user]);
  
    const showAlert = (title, message) => {
      console.log(Platform.OS);
      if (Platform.OS === "web") {
        alert(title, message);
      } else {
        Alert.alert(title, message, [{ text: "OK" }], { cancelable: false });
      }
    };
  
    const authContext = useMemo(
      () => ({
        signIn: async (token, user) => {
          // In a production app, send data to server, handle errors, and persist token
          // In the example, use a dummy token
          // console.log('AuthContext signIn token:', token);
          console.log("AuthContext signIn user:", user);
          // console.log('data is:', data);
          // await setItemAsync('userToken', token);
          // await setItemAsync('user', JSON.stringify(user)); // TODO: Dev only, remove on PROD - store user in secure storage
          // dispatch({ type: 'SIGN_IN', token: token, user: user });
          dispatch({ type: "SIGN_IN", user: user });
        },
        signOut: async () => {
          // await deleteItemAsync('userToken');
          await deleteItemAsync("user"); // TODO: Dev only, remove on PROD - clear user from secure storage
          dispatch({ type: "SIGN_OUT" });
        },
        signUp: async (data) => {
          // In a production app, send user data to server, handle errors, and persist token
          // In the example, use a dummy token
          // TODO: signed up user set in authContextÃ·
          // dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
        },
      }),
      []
    );
  
    return (
      <AuthContext.Provider value={{ ...authContext, state }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  const useAuth = () => useContext(AuthContext);
  
  export { AuthProvider, useAuth, AuthContext };