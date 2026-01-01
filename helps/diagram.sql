CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE "public"."Task" (
    "id" int NOT NULL,
    "date" date NOT NULL,
    "taskTemplateId" int NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."Patrol" (
    "id" int NOT NULL,
    "name" text NOT NULL,
    "troopId" int NOT NULL,
    "leaderId" int NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."Troop" (
    "id" int NOT NULL,
    "name" text NOT NULL,
    "leaderId" int NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."UserTaskScore" (
    "id" int NOT NULL,
    "userId" int NOT NULL,
    "score" int NOT NULL,
    "taskId" int NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."TaskTemplate" (
    "id" int NOT NULL,
    "title" text NOT NULL,
    "description" text NOT NULL,
    "maxPoints" int NOT NULL,
    "repeating" boolean NOT NULL,
    "individualTask" boolean NOT NULL,
    "eventId" int NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."Event" (
    "id" int NOT NULL,
    "name" text NOT NULL,
    "startDate" date NOT NULL,
    "endDate" date NOT NULL,
    "troopId" int NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."User" (
    "id" int NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "passwordHash" text NOT NULL,
    "patrolId" int,
    "assistantOfTroopId" int,
    PRIMARY KEY ("id")
);

CREATE TABLE "public"."PatrolTaskScore" (
    "id" int NOT NULL,
    "patrolId" int NOT NULL,
    "score" int NOT NULL,
    "taskId" int NOT NULL,
    PRIMARY KEY ("id")
);

-- Foreign key constraints
-- Schema: public
ALTER TABLE "public"."Troop" ADD CONSTRAINT "fk_Troop_id_Event_troopId" FOREIGN KEY("id") REFERENCES "public"."Event"("troopId");
ALTER TABLE "public"."User" ADD CONSTRAINT "fk_User_id_Patrol_leaderId" FOREIGN KEY("id") REFERENCES "public"."Patrol"("leaderId");
ALTER TABLE "public"."TaskTemplate" ADD CONSTRAINT "fk_TaskTemplate_id_Task_taskTemplateId" FOREIGN KEY("id") REFERENCES "public"."Task"("taskTemplateId");
ALTER TABLE "public"."Event" ADD CONSTRAINT "fk_Event_id_TaskTemplate_eventId" FOREIGN KEY("id") REFERENCES "public"."TaskTemplate"("eventId");
ALTER TABLE "public"."User" ADD CONSTRAINT "fk_User_id_Troop_leaderId" FOREIGN KEY("id") REFERENCES "public"."Troop"("leaderId");
ALTER TABLE "public"."Troop" ADD CONSTRAINT "fk_Troop_id_User_assistantOfTroopId" FOREIGN KEY("id") REFERENCES "public"."User"("assistantOfTroopId");
ALTER TABLE "public"."Patrol" ADD CONSTRAINT "fk_Patrol_id_User_patrolId" FOREIGN KEY("id") REFERENCES "public"."User"("patrolId");
ALTER TABLE "public"."User" ADD CONSTRAINT "fk_User_id_UserTaskScore_userId" FOREIGN KEY("id") REFERENCES "public"."UserTaskScore"("userId");
ALTER TABLE "public"."Task" ADD CONSTRAINT "fk_Task_id_UserTaskScore_taskId" FOREIGN KEY("id") REFERENCES "public"."UserTaskScore"("taskId");
ALTER TABLE "public"."Patrol" ADD CONSTRAINT "fk_Patrol_id_PatrolTaskScore_patrolId" FOREIGN KEY("id") REFERENCES "public"."PatrolTaskScore"("patrolId");
ALTER TABLE "public"."Task" ADD CONSTRAINT "fk_Task_id_PatrolTaskScore_taskId" FOREIGN KEY("id") REFERENCES "public"."PatrolTaskScore"("taskId");