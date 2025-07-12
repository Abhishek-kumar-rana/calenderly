import { DAYS_OF_WEEK_IN_ORDER } from "@/constants";
import { relations } from "drizzle-orm";
import { pgTable, text, uuid, integer, boolean, timestamp, index, pgEnum } from "drizzle-orm/pg-core";

const createdAt = timestamp("createdAt").defaultNow().notNull();
const updatedAt = timestamp("updatedAt").defaultNow().notNull().$onUpdate(()=> new Date());


export const EventTable = pgTable(
    "events", {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull(),
        description: text("description"),
        durationInMinutes: integer("durationInMinutes").notNull(),

        isActive: boolean("isActive").default(true).notNull(),
        
        createdAt,
        updatedAt,
        clerkUserId: text("clerkUserId").notNull(),
    },
    table => ([
        index("clerkUserIdIndex").on(table.clerkUserId),
    ]

    ) )

    // Define the "schedules" table, one per user, with timezone and timestamps
export const ScheduleTable = pgTable("schedules", {
    id: uuid("id").primaryKey().defaultRandom(),         // primary key with random UUID
    timezone: text("timezone").notNull(),                // user's timezone
    clerkUserId: text("clerkUserId").notNull().unique(), // unique user ID from Clerk
    createdAt,                                           // when the schedule was created
    updatedAt,                                           // when the schedule was last updated
  })

      // Define relationships for the ScheduleTable: a schedule has many availabilities
    export const scheduleRelations = relations(ScheduleTable, ({ many }) => ({
    availabilities: many(ScheduleAvailabilityTable), // one-to-many relationship
  }))


// Define a PostgreSQL ENUM for the days of the week
  export const scheduleDayOfWeekEnum = pgEnum("day", DAYS_OF_WEEK_IN_ORDER)

// Define the "scheduleAvailabilities" table, which stores available time slots per day

export const ScheduleAvailabilityTable = pgTable(
    "scheduleAvailabilities",
    {
      id: uuid("id").primaryKey().defaultRandom(),// unique ID
      scheduleId: uuid("scheduleId") // foreign key to the Schedule table
        .notNull()
        .references(() => ScheduleTable.id, { onDelete: "cascade" }), // cascade delete when schedule is deleted
      startTime: text("startTime").notNull(), // start time of availability (e.g. "09:00")
      endTime: text("endTime").notNull(), // end time of availability (e.g. "17:00")
      dayOfWeek: scheduleDayOfWeekEnum("dayOfWeek").notNull(), // day of the week (ENUM)
    },
    table => ([
      index("scheduleIdIndex").on(table.scheduleId),           // index on foreign key for faster lookups
    ])
  )


  // Define the reverse relation: each availability belongs to a schedule
export const ScheduleAvailabilityRelations = relations(
    ScheduleAvailabilityTable,
    ({ one }) => ({
      schedule: one(ScheduleTable, {
        fields: [ScheduleAvailabilityTable.scheduleId], // local key
        references: [ScheduleTable.id], // foreign key
      }),
    })
  )



