import axios from "axios";
import { createContext, useEffect, useState, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import globalNotificationService from "../services/globalNotificationService";

export const userContext = createContext("");

export default function UserProvider(items) {
  let children = items.children;
  const [verification, setVerification] = useState(false);
  const [token, setToken] = useState(
    localStorage.getItem("token") || sessionStorage.getItem("token")
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") ||
      sessionStorage.getItem("refreshToken")
  );
  const [expiresIn, setExpiresIn] = useState(
    localStorage.getItem("expiresIn") || sessionStorage.getItem("expiresIn")
  );
  const [userId, setUserId] = useState(
    localStorage.getItem("userId") || sessionStorage.getItem("userId")
  );
  const [tokenExpiration, setTokenExpiration] = useState(
    localStorage.getItem("tokenExpiration") ||
      sessionStorage.getItem("tokenExpiration")
  );
  const [refreshTokenExpiration, setRefreshTokenExpiration] = useState(
    localStorage.getItem("refreshTokenExpiration") ||
      sessionStorage.getItem("refreshTokenExpiration")
  );

  // Profile data state
  const [profileData, setProfileData] = useState(null);

  // Global notification service initialization
  const [baseUrl] = useState("https://api.agrivisionlabs.tech");

  const refreshIntervalRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const isRefreshingRef = useRef(false);

  // Fetch profile data
  const fetchProfileData = useCallback(async () => {
    if (!token || !baseUrl) return;
    
    try {
      const { data } = await axios.get(`${baseUrl}/Accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData(data);
    } catch (err) {
      console.error("Error fetching profile data:", err);
    }
  }, [token, baseUrl]);

  // Update profile data
  const updateProfileData = useCallback((newData) => {
    setProfileData(newData);
  }, []);

  // Track user activity
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  // Setup activity listeners
  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [updateActivity]);

  // Fetch profile data when token is available
  useEffect(() => {
    if (token) {
      fetchProfileData();
    }
  }, [token, fetchProfileData]);

  // Redirect to login
  const redirectToLogin = useCallback(() => {
    logOut();
    window.location.href = "/login";
  }, []);

  // Check if user is active (activity within last 5 minutes)
  const isUserActive = useCallback(() => {
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    return lastActivityRef.current > fiveMinutesAgo;
  }, []);

  // Updated logout function
  function logOut() {
    // Clear refresh interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    // Stop global notification service
    globalNotificationService.stopConnections();

    // Clear state
    setToken(null);
    setRefreshToken(null);
    setExpiresIn(null);
    setUserId(null);
    setTokenExpiration(null);
    setRefreshTokenExpiration(null);
    setProfileData(null);

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("expiresIn");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("refreshTokenExpiration");
    localStorage.setItem("index", 0);
  }

  // Refresh token function
  async function refreshTokens() {
    if (isRefreshingRef.current) {
      return false;
    }

    isRefreshingRef.current = true;

    try {
      const currentRefreshToken =
        refreshToken || localStorage.getItem("refreshToken");
      const currentToken = token || localStorage.getItem("token");

      if (!currentRefreshToken || !currentToken) {
        throw new Error("No refresh token available");
      }

      // Check if refresh token is expired
      const refreshExpiry =
        refreshTokenExpiration ||
        localStorage.getItem("refreshTokenExpiration");
      if (refreshExpiry && new Date(refreshExpiry) <= new Date()) {
        throw new Error("Refresh token expired");
      }

      const options = {
        url: "https://api.agrivisionlabs.tech/Auth/refresh",
        method: "POST",
        data: {
          token: currentToken,
          refreshToken: currentRefreshToken,
        },
      };

      const { data } = await axios(options);

      // Calculate new expiration time
      const newExpirationTime = new Date(
        Date.now() + data.expiresIn * 60 * 1000
      );

      // Update state and localStorage
      setToken(data.token);
      setRefreshToken(data.refreshToken);
      setExpiresIn(data.expiresIn);
      setTokenExpiration(newExpirationTime.toISOString());
      setRefreshTokenExpiration(data.refreshTokenExpiration);

      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("expiresIn", data.expiresIn);
      localStorage.setItem("tokenExpiration", newExpirationTime.toISOString());
      localStorage.setItem(
        "refreshTokenExpiration",
        data.refreshTokenExpiration
      );

      // Update global notification service with new token
      if (userId && baseUrl) {
        globalNotificationService
          .updateToken(data.token)
          .then(() => {
            console.log(
              "✅ Global notification service updated with new token"
            );
          })
          .catch((error) => {
            console.error(
              "❌ Error updating global notification service:",
              error
            );
          });
      }

      console.log("Token refreshed successfully");
      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);
      toast.error("Session expired. Please log in again.");

      // Redirect to login on refresh failure
      setTimeout(() => {
        redirectToLogin();
      }, 1000);

      return false;
    } finally {
      isRefreshingRef.current = false;
    }
  }

  // Setup automatic token refresh
  useEffect(() => {
    // Clear any existing interval
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }

    if (token && refreshToken) {
      // Check token expiration on mount
      const expiration =
        tokenExpiration || localStorage.getItem("tokenExpiration");
      if (expiration) {
        const expiryTime = new Date(expiration);
        const now = new Date();

        // If token is already expired, try to refresh immediately
        if (expiryTime <= now) {
          refreshTokens();
          return;
        }
      }

      // Set up refresh interval for 27 minutes (1620000 ms)
      const refreshInterval = 27 * 60 * 1000; // 27 minutes

      refreshIntervalRef.current = setInterval(() => {
        // Only refresh if user is active
        if (isUserActive()) {
          console.log("Auto-refreshing token...");
          refreshTokens();
        } else {
          console.log("User inactive, skipping token refresh");
        }
      }, refreshInterval);

      console.log("Token refresh interval set for 27 minutes");
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [token, refreshToken, tokenExpiration, isUserActive]);

  // Initialize global notification service when user is authenticated
  useEffect(() => {
    console.log("🔔 UserProvider: Checking authentication state:", {
      hasToken: !!token,
      hasUserId: !!userId,
      hasBaseUrl: !!baseUrl,
    });

    if (token && userId && baseUrl) {
      console.log("🔔 Initializing global notification service...");
      globalNotificationService
        .initialize(baseUrl, token, userId)
        .then((success) => {
          if (success) {
            console.log(
              "✅ Global notification service initialized successfully"
            );
          } else {
            console.log("❌ Failed to initialize global notification service");
          }
        })
        .catch((error) => {
          console.error(
            "❌ Error initializing global notification service:",
            error
          );
        });
    } else {
      console.log(
        "🔔 User not authenticated, stopping global notification service"
      );
      // Stop connections if user is not authenticated
      globalNotificationService.stopConnections();
    }
  }, [token, userId, baseUrl]);

  // Cleanup global notification service on unmount
  useEffect(() => {
    return () => {
      globalNotificationService.stopConnections();
    };
  }, []);

  return (
    <userContext.Provider
      value={{
        token,
        setToken,
        logOut,
        verification,
        setVerification,
        refreshToken,
        setRefreshToken,
        expiresIn,
        setExpiresIn,
        userId,
        setUserId,
        tokenExpiration,
        setTokenExpiration,
        refreshTokenExpiration,
        setRefreshTokenExpiration,
        refreshTokens,
        isUserActive,
        globalNotificationService,
        refreshNotificationPreferences: () =>
          globalNotificationService.refreshPreferences(),
        testNotification: () => globalNotificationService.testNotification(),
        profileData,
        updateProfileData,
        fetchProfileData,
      }}
    >
      {children}
    </userContext.Provider>
  );
}
