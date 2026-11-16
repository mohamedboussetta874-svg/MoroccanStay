import { Toaster } from "sonner";

export function Notifications() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          borderRadius: 12,
        },
      }}
    />
  );
}

