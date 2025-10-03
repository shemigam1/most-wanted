import { hash } from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/app/db";
import { hit, rooms, users } from "@/app/db/schema";
import { generateRoomCode } from "@/lib/utils";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Starting database seeding...");

  try {
    // Clean up existing data (with CASCADE to handle foreign keys)
    console.log("Cleaning up existing data...");

    // Delete in order to respect foreign key constraints
    await db.delete(hit);
    console.log("- Deleted hits");

    await db.delete(rooms);
    console.log("- Deleted rooms");

    await db.delete(users);
    console.log("- Deleted users");

    console.log("Cleanup completed\n");
  } catch (error: any) {
    if (error?.message?.includes("does not exist")) {
      console.log("Tables don't exist yet. Please run migrations first:");
      console.log("  npm run db:push");
      console.log("  or");
      console.log("  npm run db:migrate");
      process.exit(1);
    }
    throw error;
  }

  //   Create demo users
  console.log("Creating demo users...");
  const demoPassword = await hash("password123", 10);

  const adminUserId = uuidv4();
  const memberUserId = uuidv4();
  const user3Id = uuidv4();

  const adminUser = await db
    .insert(users)
    .values({
      id: adminUserId,
      username: "Admin",
      email: "admin@example.com",
      password: demoPassword,
      //   created_at: new Date().toISOString(),
    })
    .returning()
    .then((rows) => rows[0]);

  const memberUser = await db
    .insert(users)
    .values({
      id: memberUserId,
      username: "User",
      email: "user@example.com",
      password: demoPassword,
    })
    .returning()
    .then((rows) => rows[0]);

  const user3 = await db
    .insert(users)
    .values({
      id: user3Id,
      username: "Bandit",
      email: "bandit@example.com",
      password: demoPassword,
    })
    .returning()
    .then((rows) => rows[0]);

  console.log("✓ Created demo users:");
  console.log(`  - Admin: ${adminUser.email}`);
  console.log(`  - User: ${memberUser.email}`);
  console.log(`  - Bandit: ${user3.email}\n`);

  // Create demo rooms
  console.log("Creating demo rooms...");
  const officeRoom = await db
    .insert(rooms)
    .values({
      id: uuidv4(),
      name: "Office Pranks",
      description: "Keep track of who deserves revenge in the office",
      code: generateRoomCode(),
      userId: adminUserId,
    })
    .returning()
    .then((rows) => rows[0]);

  const gamingRoom = await db
    .insert(rooms)
    .values({
      id: uuidv4(),
      name: "Gaming Squad",
      description: "Bounties for teammates who throw games",
      code: generateRoomCode(),
      userId: memberUserId,
    })
    .returning()
    .then((rows) => rows[0]);

  const friendsRoom = await db
    .insert(rooms)
    .values({
      id: uuidv4(),
      name: "Friend Group",
      description: "Who owes who for what",
      code: generateRoomCode(),
      userId: user3Id,
    })
    .returning()
    .then((rows) => rows[0]);

  console.log("✓ Created demo rooms:");
  console.log(`  - ${officeRoom.name} (code: ${officeRoom.code})`);
  console.log(`  - ${gamingRoom.name} (code: ${gamingRoom.code})`);
  console.log(`  - ${friendsRoom.name} (code: ${friendsRoom.code})\n`);

  // Create demo hits (bounty targets)
  console.log("Creating demo bounty targets...");
  const demoHits = [
    {
      id: uuidv4(),
      name: "Sarah Johnson",
      offense: "Ate my lunch from the office fridge... AGAIN",
      userId: adminUserId,
      roomId: officeRoom.id,
    },
    {
      id: uuidv4(),
      name: "Mike Chen",
      offense: "Never mutes on Zoom calls, we can hear everything",
      userId: memberUserId,
      roomId: gamingRoom.id,
    },
    {
      id: uuidv4(),
      name: "Alex Rodriguez",
      offense: "Always AFKs in ranked games",
      userId: user3Id,
      roomId: friendsRoom.id,
    },
    {
      id: uuidv4(),
      name: "Emma Davis",
      offense: "Spoiled the ending of my favorite show",
      userId: adminUserId,
      roomId: officeRoom.id,
    },
    {
      id: uuidv4(),
      name: "Chris Wilson",
      offense: "Borrowed my charger 3 months ago, never returned it",
      userId: memberUserId,
      roomId: gamingRoom.id,
    },
    {
      id: uuidv4(),
      name: "Lisa Anderson",
      offense: "Takes credit for other peoples ideas in meetings",
      userId: user3Id,
      roomId: officeRoom.id,
    },
    {
      id: uuidv4(),
      name: "Tom Harris",
      offense: "Plays music without headphones on public transport",
      userId: adminUserId,
      roomId: friendsRoom.id,
    },
    {
      id: uuidv4(),
      name: "Rachel Green",
      offense: "Ghosts people after making plans",
      userId: memberUserId,
      roomId: friendsRoom.id,
    },
  ];

  for (const target of demoHits) {
    await db.insert(hit).values({
      id: target.id,
      name: target.name,
      offense: target.offense,
      userId: target.userId,
      roomId: target.roomId,
    });
  }

  console.log(`✓ Created ${demoHits.length} demo bounty targets\n`);

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🎉 Database seeding completed!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("📋 Test Credentials:");
  console.log("  Email: admin@example.com");
  console.log("  Email: user@example.com");
  console.log("  Email: bandit@example.com");
  console.log("  Password: password123\n");

  console.log("🏠 Room Codes:");
  console.log(`  Office Pranks: ${officeRoom.code}`);
  console.log(`  Gaming Squad: ${gamingRoom.code}`);
  console.log(`  Friend Group: ${friendsRoom.code}`);
}

main()
  .catch((e) => {
    console.error("\n❌ Error during seeding:", e.message);
    console.error("\nFull error:", e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("\n✓ Seed script finished");
    process.exit(0);
  });
