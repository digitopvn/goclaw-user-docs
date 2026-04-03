/**
 * Seed initial admin user
 * Usage: npx tsx scripts/seed-admin.ts
 */
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users } from "../src/db/schema";
import hashPassword from "../src/lib/auth/helpers/password/hashPassword";

async function seed() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("DATABASE_URL not set");
        process.exit(1);
    }

    const client = postgres(connectionString, { max: 1 });
    const db = drizzle(client);

    const email = process.env.ADMIN_EMAIL_DEFAULT!;
    const password = process.env.ADMIN_PASSWORD_DEFAULT!;
    const hashedPassword = await hashPassword(password);

    try {
        await db
            .insert(users)
            .values({
                email,
                name: "Admin",
                password: hashedPassword,
                role: "admin",
            })
            .onConflictDoNothing();

        console.log(`Admin user seeded: ${email}`);
    } catch (error) {
        console.error("Seed failed:", error);
    }

    await client.end();
}

seed();
