import { db } from "@/app/db";
import { getSession } from "./auth";
import { eq } from "drizzle-orm";
import { cache } from "react";
import { users } from "@/app/db/schema";
// import { mockDelay } from "./utils";
// import { unstable_cacheTag as cacheTag } from "next/cache";

// Current user

// Get user by emai