"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { PlanTier } from "./tierLimits";

export interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  tier: PlanTier;
  billingCycle: "monthly" | "annual";
  avatar?: string;
  createdAt: string;
  apiKey: string;
}

export interface SignupData {
  name: string;
  email: string;
  password?: string;
  company?: string;
  tier?: PlanTier;
  billingCycle?: "monthly" | "annual";
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  loginWithDemo: (role: PlanTier) => void;
}

export const DEMO_USERS: Record<PlanTier, User> = {
  free: {
    id: "usr_free_01",
    name: "Alex Rivera",
    email: "alex@riverastudio.dev",
    company: "Rivera Web Studio",
    tier: "free",
    billingCycle: "monthly",
    createdAt: "2026-01-15",
    apiKey: "sk_live_free_8f9a2b3c4d5e",
  },
  starter: {
    id: "usr_starter_02",
    name: "Elena Rostova",
    email: "elena@growthfoundry.co",
    company: "Growth Foundry",
    tier: "starter",
    billingCycle: "monthly",
    createdAt: "2026-02-10",
    apiKey: "sk_live_starter_4a5b6c7d8e9f",
  },
  pro: {
    id: "usr_pro_03",
    name: "Marcus Vance",
    email: "marcus@scalehorizon.io",
    company: "Scale Horizon Agency",
    tier: "pro",
    billingCycle: "annual",
    createdAt: "2026-03-01",
    apiKey: "sk_live_pro_99a8b7c6d5e4",
  },
  enterprise: {
    id: "usr_enterprise_04",
    name: "Sarah Chen",
    email: "sarah.chen@globalenterprisegroup.com",
    company: "Global Digital Agency",
    tier: "enterprise",
    billingCycle: "annual",
    createdAt: "2025-11-20",
    apiKey: "sk_live_ent_112233445566",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore user session on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("seoseite_auth_user");
        if (stored) {
          const parsed = JSON.parse(stored) as User;
          if (parsed && parsed.email) {
            setUser(parsed);
          }
        }
      }
    } catch {
      // fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !email.includes("@")) {
      return { success: false, error: "Please enter a valid email address." };
    }

    // Check if matching any predefined demo email
    const cleanEmail = email.toLowerCase().trim();
    let matchingUser = Object.values(DEMO_USERS).find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    // If not matching a predefined demo, create or restore a session for this email
    if (!matchingUser) {
      const storedTier = (localStorage.getItem("seoseite_tier") as PlanTier) || "free";
      matchingUser = {
        id: `usr_${Date.now().toString(36)}`,
        name: cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        email: cleanEmail,
        tier: storedTier,
        billingCycle: "monthly",
        createdAt: new Date().toISOString().split("T")[0],
        apiKey: `sk_live_${Math.random().toString(36).substring(2, 14)}`,
      };
    }

    setUser(matchingUser);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("seoseite_auth_user", JSON.stringify(matchingUser));
        localStorage.setItem("seoseite_tier", matchingUser.tier);
      }
    } catch {
      // ignore
    }

    return { success: true };
  };

  const signup = async (data: SignupData): Promise<{ success: boolean; error?: string }> => {
    if (!data.name || data.name.trim().length < 2) {
      return { success: false, error: "Please enter your full name." };
    }
    if (!data.email || !data.email.includes("@")) {
      return { success: false, error: "Please enter a valid work email." };
    }

    const tier = data.tier || "free";
    const newUser: User = {
      id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      company: data.company?.trim(),
      tier,
      billingCycle: data.billingCycle || "monthly",
      createdAt: new Date().toISOString().split("T")[0],
      apiKey: `sk_live_${Math.random().toString(36).substring(2, 14)}`,
    };

    setUser(newUser);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("seoseite_auth_user", JSON.stringify(newUser));
        localStorage.setItem("seoseite_tier", newUser.tier);
      }
    } catch {
      // ignore
    }

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("seoseite_auth_user");
        localStorage.setItem("seoseite_tier", "free");
      }
    } catch {
      // ignore
    }
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("seoseite_auth_user", JSON.stringify(updated));
          if (updates.tier) {
            localStorage.setItem("seoseite_tier", updates.tier);
          }
        }
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const loginWithDemo = (role: PlanTier) => {
    const demo = DEMO_USERS[role] || DEMO_USERS.pro;
    setUser(demo);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("seoseite_auth_user", JSON.stringify(demo));
        localStorage.setItem("seoseite_tier", demo.tier);
      }
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateUser,
        loginWithDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
