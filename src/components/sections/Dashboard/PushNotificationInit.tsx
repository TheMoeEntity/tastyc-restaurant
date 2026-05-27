"use client";

import { useEffect } from "react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { isIosSafari } from "@/lib/Helper";
import { toast } from "sonner";

export function PushNotificationInit() {
    const { subscribe } = usePushNotifications();
    useEffect(() => {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            if (isIosSafari()) {
                toast("📱 Add to Home Screen to enable order notifications", {
                    duration: 8000,
                });
            }
            return;
        }

        Notification.requestPermission().then((permission) => {
            if (permission === "granted") subscribe();
        });
    }, []);
    useEffect(() => {
        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            return;
        }

        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                subscribe();
            }
        });
    }, []);

    return null;
}