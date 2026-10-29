"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface ProjectSite {
  domain: string;
  label: string;
  tag: string;
  verified?: boolean;
  source: "preset" | "manual" | "gsc";
  lastAnalyzed?: string;
}

const DEFAULT_PROJECTS: ProjectSite[] = [
  { domain: "stripe.com", label: "Stripe", tag: "Fintech SaaS", source: "preset", verified: true },
  { domain: "linear.app", label: "Linear", tag: "Productivity", source: "preset", verified: true },
  { domain: "vercel.com", label: "Vercel", tag: "Cloud Frontend", source: "preset", verified: true },
  { domain: "github.com", label: "GitHub", tag: "Dev Platform", source: "preset", verified: true },
];

interface ProjectContextValue {
  activeDomain: string;
  setActiveDomain: (domain: string) => void;
  savedProjects: ProjectSite[];
  addProject: (domain: string, label?: string, tag?: string) => void;
  removeProject: (domain: string) => void;
  syncFromGsc: () => Promise<void>;
  isSyncing: boolean;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

const STORAGE_ACTIVE_KEY = "seoseite_active_domain";
const STORAGE_PROJECTS_KEY = "seoseite_saved_projects";

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [activeDomain, setActiveDomainState] = useState<string>("stripe.com");
  const [savedProjects, setSavedProjects] = useState<ProjectSite[]>(DEFAULT_PROJECTS);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const storedActive = localStorage.getItem(STORAGE_ACTIVE_KEY);
      if (storedActive && storedActive.trim()) {
        setActiveDomainState(storedActive.trim().toLowerCase());
      }

      const storedProjects = localStorage.getItem(STORAGE_PROJECTS_KEY);
      if (storedProjects) {
        const parsed = JSON.parse(storedProjects);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedProjects(parsed);
        }
      }
    } catch {
      // Storage unavailable or invalid JSON
    }
  }, []);

  const setActiveDomain = (domain: string) => {
    let clean = domain.trim().toLowerCase();
    try {
      if (clean.startsWith("http://") || clean.startsWith("https://")) {
        clean = new URL(clean).hostname;
      }
    } catch {
      // Keep as-is
    }
    clean = clean.replace(/^www\./, "");
    if (!clean) return;

    setActiveDomainState(clean);
    try {
      localStorage.setItem(STORAGE_ACTIVE_KEY, clean);
      window.dispatchEvent(new CustomEvent("seoseite:active-domain-changed", { detail: { domain: clean } }));
    } catch {
      // LocalStorage access restriction
    }
  };

  const addProject = (domain: string, label?: string, tag?: string) => {
    let clean = domain.trim().toLowerCase();
    try {
      if (clean.startsWith("http://") || clean.startsWith("https://")) {
        clean = new URL(clean).hostname;
      }
    } catch {
      // Keep as-is
    }
    clean = clean.replace(/^www\./, "");
    if (!clean) return;

    const existingIdx = savedProjects.findIndex((p) => p.domain.toLowerCase() === clean);
    const newProject: ProjectSite = {
      domain: clean,
      label: label || clean,
      tag: tag || "Custom Property",
      source: "manual",
      lastAnalyzed: new Date().toISOString(),
    };

    let updated: ProjectSite[];
    if (existingIdx >= 0) {
      updated = [...savedProjects];
      updated[existingIdx] = { ...updated[existingIdx], ...newProject };
    } else {
      updated = [newProject, ...savedProjects];
    }

    setSavedProjects(updated);
    setActiveDomain(clean);

    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(updated));
    } catch {
      // LocalStorage error
    }
  };

  const removeProject = (domain: string) => {
    const clean = domain.trim().toLowerCase();
    const updated = savedProjects.filter((p) => p.domain.toLowerCase() !== clean);
    setSavedProjects(updated);

    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(updated));
    } catch {
      // LocalStorage error
    }

    if (activeDomain.toLowerCase() === clean && updated.length > 0) {
      setActiveDomain(updated[0].domain);
    }
  };

  const syncFromGsc = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/tools/google-hub", { method: "GET" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.properties)) {
          const gscSites: ProjectSite[] = data.properties.map((prop: { siteUrl: string; permissionLevel?: string }) => {
            let d = prop.siteUrl;
            try {
              if (d.startsWith("http://") || d.startsWith("https://")) {
                d = new URL(d).hostname;
              }
            } catch {
              // ignore
            }
            d = d.toLowerCase().replace(/^www\./, "").replace(/\/$/, "");
            return {
              domain: d,
              label: d,
              tag: "Verified GSC Property",
              verified: true,
              source: "gsc" as const,
              lastAnalyzed: new Date().toISOString(),
            };
          });

          if (gscSites.length > 0) {
            const combined = [...gscSites, ...savedProjects.filter((p) => !gscSites.some((g) => g.domain === p.domain))];
            setSavedProjects(combined);
            setActiveDomain(gscSites[0].domain);
            localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(combined));
          }
        }
      }
    } catch {
      // Mock / fallback sync
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        activeDomain,
        setActiveDomain,
        savedProjects,
        addProject,
        removeProject,
        syncFromGsc,
        isSyncing,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}

