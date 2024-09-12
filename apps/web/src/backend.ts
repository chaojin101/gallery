"use client";

import { treaty } from "@elysiajs/eden";
import { type App } from "@gallery/backend";

export const backend = treaty<App>(process.env.NEXT_PUBLIC_BACKEND_HOST);
