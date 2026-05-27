"use client";

import { useEffect } from "react";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export function PushNotificationInit() {
    const { subscribe } = usePushNotifications();

    useEffect(() => {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            console.warn("🔔 Push not supported in this browser");
            return;
        }

        Notification.requestPermission().then((permission) => {
            console.log("🔔 Permission:", permission);
            if (permission === "granted") {
                subscribe();
            }
        });
    }, []);

    return null;
}