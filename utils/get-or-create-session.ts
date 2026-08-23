import { api } from "@/lib/axios-instance"
import React from "react";

export async function getOrCreateSession(ref: React.RefObject<any>, setError: (value: string) =>void) {
  const currentSessionId = localStorage.getItem('anonymous_session_token')

    if (currentSessionId === null || currentSessionId === undefined) {
      ref.current?.execute()
  
      try {
        const token = await ref.current?.getResponsePromise();

        if (!token) {
          throw new Error('Token not generated, you can refresh your page')
        }
        
        const response = await api.post('/session', { trunstile_token: token })

        localStorage.setItem('anonymous_session_token', response.data?.token)
      } catch (error: unknown) {
        setError(error as string)
      }
    }
}