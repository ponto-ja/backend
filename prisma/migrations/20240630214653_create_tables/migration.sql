-- CreateEnum
CREATE TYPE "ScoreOperation" AS ENUM ('EARNING', 'SPEDING');

-- CreateTable
CREATE TABLE "business_owners" (
    "id" VARCHAR(30) NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_owners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fidelity_programs" (
    "id" VARCHAR(30) NOT NULL,
    "name" TEXT NOT NULL,
    "score_rate" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "business_owner_id" VARCHAR(30) NOT NULL,

    CONSTRAINT "fidelity_programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rewards" (
    "id" VARCHAR(30) NOT NULL,
    "name" TEXT NOT NULL,
    "score_needed" BIGINT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "fidelity_program_id" VARCHAR(30) NOT NULL,

    CONSTRAINT "rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participants" (
    "id" VARCHAR(30) NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_number" VARCHAR(11) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pivot_fidelity_programs_participants" (
    "id" VARCHAR(30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    "fidelity_program_id" VARCHAR(30) NOT NULL,
    "participant_id" VARCHAR(30) NOT NULL,

    CONSTRAINT "pivot_fidelity_programs_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scores" (
    "id" VARCHAR(30) NOT NULL,
    "score" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "fidelity_program_id" VARCHAR(30) NOT NULL,
    "participant_id" VARCHAR(30) NOT NULL,

    CONSTRAINT "scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "score_history" (
    "id" VARCHAR(30) NOT NULL,
    "score" BIGINT NOT NULL,
    "operation" "ScoreOperation" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fidelity_program_id" VARCHAR(30) NOT NULL,
    "participant_id" VARCHAR(30) NOT NULL,

    CONSTRAINT "score_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reward_history" (
    "id" VARCHAR(30) NOT NULL,
    "name" TEXT NOT NULL,
    "score_needed" BIGINT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fidelity_program_id" VARCHAR(30) NOT NULL,
    "participant_id" VARCHAR(30) NOT NULL,

    CONSTRAINT "reward_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_owners_id_key" ON "business_owners"("id");

-- CreateIndex
CREATE UNIQUE INDEX "business_owners_email_key" ON "business_owners"("email");

-- CreateIndex
CREATE UNIQUE INDEX "fidelity_programs_id_key" ON "fidelity_programs"("id");

-- CreateIndex
CREATE UNIQUE INDEX "fidelity_programs_business_owner_id_key" ON "fidelity_programs"("business_owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "rewards_id_key" ON "rewards"("id");

-- CreateIndex
CREATE UNIQUE INDEX "rewards_fidelity_program_id_key" ON "rewards"("fidelity_program_id");

-- CreateIndex
CREATE UNIQUE INDEX "participants_id_key" ON "participants"("id");

-- CreateIndex
CREATE UNIQUE INDEX "pivot_fidelity_programs_participants_id_key" ON "pivot_fidelity_programs_participants"("id");

-- CreateIndex
CREATE UNIQUE INDEX "pivot_fidelity_programs_participants_fidelity_program_id_key" ON "pivot_fidelity_programs_participants"("fidelity_program_id");

-- CreateIndex
CREATE UNIQUE INDEX "pivot_fidelity_programs_participants_participant_id_key" ON "pivot_fidelity_programs_participants"("participant_id");

-- CreateIndex
CREATE UNIQUE INDEX "scores_id_key" ON "scores"("id");

-- CreateIndex
CREATE UNIQUE INDEX "scores_fidelity_program_id_key" ON "scores"("fidelity_program_id");

-- CreateIndex
CREATE UNIQUE INDEX "scores_participant_id_key" ON "scores"("participant_id");

-- CreateIndex
CREATE UNIQUE INDEX "score_history_id_key" ON "score_history"("id");

-- CreateIndex
CREATE UNIQUE INDEX "score_history_fidelity_program_id_key" ON "score_history"("fidelity_program_id");

-- CreateIndex
CREATE UNIQUE INDEX "score_history_participant_id_key" ON "score_history"("participant_id");

-- CreateIndex
CREATE UNIQUE INDEX "reward_history_id_key" ON "reward_history"("id");

-- CreateIndex
CREATE UNIQUE INDEX "reward_history_fidelity_program_id_key" ON "reward_history"("fidelity_program_id");

-- CreateIndex
CREATE UNIQUE INDEX "reward_history_participant_id_key" ON "reward_history"("participant_id");

-- AddForeignKey
ALTER TABLE "fidelity_programs" ADD CONSTRAINT "fidelity_programs_business_owner_id_fkey" FOREIGN KEY ("business_owner_id") REFERENCES "business_owners"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rewards" ADD CONSTRAINT "rewards_fidelity_program_id_fkey" FOREIGN KEY ("fidelity_program_id") REFERENCES "fidelity_programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pivot_fidelity_programs_participants" ADD CONSTRAINT "pivot_fidelity_programs_participants_fidelity_program_id_fkey" FOREIGN KEY ("fidelity_program_id") REFERENCES "fidelity_programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pivot_fidelity_programs_participants" ADD CONSTRAINT "pivot_fidelity_programs_participants_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_fidelity_program_id_fkey" FOREIGN KEY ("fidelity_program_id") REFERENCES "fidelity_programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score_history" ADD CONSTRAINT "score_history_fidelity_program_id_fkey" FOREIGN KEY ("fidelity_program_id") REFERENCES "fidelity_programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score_history" ADD CONSTRAINT "score_history_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_history" ADD CONSTRAINT "reward_history_fidelity_program_id_fkey" FOREIGN KEY ("fidelity_program_id") REFERENCES "fidelity_programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_history" ADD CONSTRAINT "reward_history_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "participants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
