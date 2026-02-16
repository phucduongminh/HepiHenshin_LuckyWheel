import React, { useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { getQueryParam } from "@/utils/getQueryParam";

export function useGameAuth() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const code = getQueryParam("code");

      try {
        // 🔥 STEP 1: nếu có code → exchange trước
        if (code) {
          try {
            await authService.exchangeCode(code);

            window.history.replaceState(
              {},
              document.title,
              window.location.pathname + window.location.hash,
            );
          } catch (err) {
            console.warn("Exchange failed (maybe expired code):", err);
            // ❗ KHÔNG logout ở đây
          }
        }

        // 🔥 STEP 2: thử lấy user
        try {
          const me = await authService.getMe();
          setUser(me);
        } catch (err) {
          console.warn("No active session:", err);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  return { user, loadingUser };
}
