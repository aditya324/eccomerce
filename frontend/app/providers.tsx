"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());


  const googleProvider=process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

  

  

  return (
    <GoogleOAuthProvider clientId={googleProvider!}>

   
    <QueryClientProvider client={client}>
    {children}
    </QueryClientProvider>
     </GoogleOAuthProvider>
  );
}
