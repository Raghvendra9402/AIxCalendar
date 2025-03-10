import { Queue } from "bullmq";
import { redis } from "./redis";

export const reminderQueue = new Queue("reminders", { connection: redis });
