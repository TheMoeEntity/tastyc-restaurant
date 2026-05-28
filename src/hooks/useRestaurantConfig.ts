"use client"
import { useEffect, useState } from "react";
import apiFetch from "@/lib/api";
import { type RestaurantConfig, DEFAULT_CONFIG } from "@/lib/api/config";

// Module-level cache — fetched once per page load, shared across components
let cachedConfig: RestaurantConfig | null = null;
let fetchPromise: Promise<RestaurantConfig> | null = null;

async function fetchConfig(): Promise<RestaurantConfig> {
    if (cachedConfig) return cachedConfig;
    if (fetchPromise) return fetchPromise;

    fetchPromise = apiFetch<any>("/api/config")
        .then((r) => {
            const config = r.success ? { ...DEFAULT_CONFIG, ...r.data.config } : DEFAULT_CONFIG;
            cachedConfig = config;
            return config;
        })
        .catch(() => DEFAULT_CONFIG);

    return fetchPromise;
}

export function useRestaurantConfig() {
    const [config, setConfig] = useState<RestaurantConfig>(
        cachedConfig ?? DEFAULT_CONFIG
    );
    const [loading, setLoading] = useState(!cachedConfig);

    useEffect(() => {
        if (cachedConfig) return;
        fetchConfig().then((c) => {
            setConfig(c);
            setLoading(false);
        });
    }, []);

    return { config, loading };
}