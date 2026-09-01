import { api } from "@/lib/axios-instance"
import React from "react";
import type { TurnstileInstance } from "@marsidev/react-turnstile";

// FIX: Cloudflare Turnstile's getResponsePromise() has no built-in timeout —
// if the challenge never resolves (blocked script, slow/flaky network,
// browser extension interference), the promise hangs forever and the caller
// never learns the session failed. Race it against a timeout so a stuck
// verification surfaces as an error instead of silent, indefinite nothing.
const TURNSTILE_TIMEOUT_MS = 10_000;

function withTimeout<T>(promise: Promise<T>, ms: number, timeoutMessage: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(timeoutMessage)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export async function getOrCreateSession(
  ref: React.RefObject<TurnstileInstance | null>,
  setError: (value: string) => void,
) {
  const currentSessionId = localStorage.getItem('anonymous_session_token')

  if (currentSessionId === null || currentSessionId === undefined) {
    ref.current?.execute()

    try {
      const responsePromise = ref.current?.getResponsePromise();
      const token = responsePromise
        ? await withTimeout(
            responsePromise,
            TURNSTILE_TIMEOUT_MS,
            "Verification is taking longer than expected — please try again.",
          )
        : undefined;

      if (!token) {
        throw new Error('Could not verify your session — please try again.');
      }

      const response = await api.post('/session', { trunstile_token: token });

      localStorage.setItem('anonymous_session_token', response.data?.token);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong verifying your session.';
      setError(message);
      // FIX: re-throw so callers (which check localStorage right after
      // awaiting this function) know setup failed instead of silently
      // proceeding as if it succeeded.
      throw error;
    }
  }
}