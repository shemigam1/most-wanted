import { InferSelectModel, relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";
// Enums for issue status and priority
// export const statusEnum = pgEnum("status", [
//   "backlog",
//   "todo",
//   "in_progress",
//   "done",
// ]);
// export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);

export const hit = pgTable("hit", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: text("name").notNull(),
  offense: text("offense"),
  //   status: statusEnum("status").default("backlog").notNull(),
  //   priority: priorityEnum("priority").default("medium").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  roomId: text("room_id")
    .notNull()
    .references(() => rooms.id),
});

export const rooms = pgTable("rooms", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: text("name").notNull(),
  description: text("description"),
  code: text("code").notNull(),
  //   status: statusEnum("status").default("backlog").notNull(),
  //   priority: priorityEnum("priority").default("medium").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
});

// Users table
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations between tables
export const hitRelations = relations(hit, ({ one }) => ({
  user: one(users, {
    fields: [hit.userId],
    references: [users.id],
  }),
  room: one(rooms, {
    fields: [hit.roomId],
    references: [rooms.id],
  }),
}));

// export const hitToRoomRelations = relations(hit, ({ many }) => ({
//   user: one(users, {
//     fields: [hit.userId],
//     references: [users.id],
//   }),
// }));

export const roomRelations = relations(rooms, ({ one }) => ({
  user: one(users, {
    fields: [rooms.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  hit: many(hit),
  rooms: many(rooms),
}));

// export const usersRelations = relations(users, ({ many }) => ({
//   issues: many(hit),
// }));

// Types
export type Rooms = InferSelectModel<typeof rooms>;
export type User = InferSelectModel<typeof users>;
export type Hit = InferSelectModel<typeof hit>;

// Status and priority labels for display
// export const ISSUE_STATUS = {
//   backlog: { label: "Backlog", value: "backlog" },
//   todo: { label: "Todo", value: "todo" },
//   in_progress: { label: "In Progress", value: "in_progress" },
//   done: { label: "Done", value: "done" },
// };

// export const ISSUE_PRIORITY = {
//   low: { label: "Low", value: "low" },
//   medium: { label: "Medium", value: "medium" },
//   high: { label: "High", value: "high" },
// };
