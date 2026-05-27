import apiFetch from "@/lib/api";
import { useState, useEffect } from "react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

// Convert the base64 VAPID public key to the Uint8Array format
// the browser's push API requires. This is a standard conversion.
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, "+")
        .replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from(
        [...rawData].map((char) => char.charCodeAt(0))
    ) as Uint8Array<ArrayBuffer>;
}

export function usePushNotifications() {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check if already subscribed on mount
        if ("serviceWorker" in navigator && "PushManager" in window) {
            navigator.serviceWorker.ready.then((registration) => {
                registration.pushManager.getSubscription().then((subscription) => {
                    setIsSubscribed(!!subscription);
                });
            });
        }
    }, []);

    async function subscribe() {
        console.log("🔔 subscribe() called");

        if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
            console.warn("Push not supported");
            return;
        }

        setIsLoading(true);

        try {
            console.log("🔔 Registering service worker...");
            const registration = await navigator.serviceWorker.register("/sw.js");
            console.log("🔔 SW registered:", registration);

            console.log("🔔 Subscribing to push...");
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });
            console.log("🔔 Subscription object:", JSON.stringify(subscription));

            const res = await apiFetch("/api/push/subscribe", {
                method: "POST",
                data: subscription,
            });
            console.log("🔔 API response:", res);

            setIsSubscribed(true);
            console.log("🔔 Subscribed successfully!");
        } catch (error) {
            console.error("🔔 Push subscription failed:", error);
        } finally {
            setIsLoading(false);
        }
    }
    async function unsubscribe() {
        setIsLoading(true);
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                await apiFetch("/api/push/unsubscribe", {
                    method: "DELETE",
                    data: subscription,
                });
                await subscription.unsubscribe();
                setIsSubscribed(false);
            }
        } catch (error) {
            console.error("Unsubscribe failed:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return { isSubscribed, isLoading, subscribe, unsubscribe };
}