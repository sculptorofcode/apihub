
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastProvider,
  ToastTitle,
  ToastDescription,
  ToastViewport,
} from "@/components/ui/toast";
import React, { useEffect, useState } from "react";
import { CircularTimerCloseButton } from "./CircularTimerCloseButton";

// Slide/fade animation duration in ms
const ANIMATION_MS = 350;
const AUTO_HIDE_MS = 5000;

export function Toaster() {
  const { toasts, dismiss } = useToast();

  // Track which toasts are exiting
  const [closingIds, setClosingIds] = useState<{ [id: string]: boolean }>({});

  const handleClose = (id: string) => {
    setClosingIds((s) => ({ ...s, [id]: true }));
    // Delay removal to finish animation
    setTimeout(() => {
      dismiss(id);
    }, ANIMATION_MS);
  };

  // Automatically set up timer for currently open toasts
  useEffect(() => {
    const timers: { [id: string]: number } = {};
    toasts.forEach((toast) => {
      if (!closingIds[toast.id] && toast.open) {
        timers[toast.id] = window.setTimeout(() => {
          handleClose(toast.id);
        }, AUTO_HIDE_MS);
      }
    });
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
    // Note: intentionally not adding handleClose
    // eslint-disable-next-line
  }, [JSON.stringify(toasts), JSON.stringify(closingIds)]);

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const isClosing = closingIds[id] ?? false;
        return (
          <Toast
            key={id}
            {...props}
            // Add animation classes
            className={
              "transition-transform transition-opacity duration-350 ease-in-out " +
              (isClosing
                ? "animate-toast-exit"
                : "animate-toast-enter")
            }
            style={{
              pointerEvents: "auto",
            }}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            {/* Align the close button perfectly centered in a fixed-size circle */}
            <div
              className="flex items-center justify-center ml-4 w-8 h-8 rounded-full"
              style={{ minWidth: 32, minHeight: 32 }}
            >
              <CircularTimerCloseButton
                duration={AUTO_HIDE_MS}
                running={!isClosing}
                onClick={() => handleClose(id)}
              />
            </div>
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
