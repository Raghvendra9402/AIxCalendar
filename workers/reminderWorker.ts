import { prisma } from "../lib/db";
import { redis } from "../lib/redis";
import { Worker } from "bullmq";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

const worker = new Worker(
  "reminders",
  async (job) => {
    try {
      const { id, title, email } = await job.data;
      if (!id || !title || !email) {
        console.log("[MISSING_JOB_FIELDS]", job.data);
        return;
      }
      const reminder = await prisma.reminder.findUnique({
        where: {
          id,
        },
      });
      if (!reminder) {
        console.log("Reminder not found");
        return;
      }

      await resend.emails.send({
        from: "AIxCalendar <ai-calendar@resend.dev>",
        to: email,
        subject: "Reminder Notification",
        text: `Reminder Alert : Your reminder of ${title}`,
      });

      console.log(`Reminder sent to ${email} for ${title}`);

      await prisma.reminder.update({
        where: {
          id,
        },
        data: {
          reminderStatus: false,
        },
      });
    } catch (error) {
      console.error(
        "Something went wrong during job processing by worker",
        error
      );
    }
  },
  { connection: redis }
);

console.log("Worker is running", worker.id);
