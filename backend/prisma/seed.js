import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Revital Yoga database...");

  // Clear existing course data
  await prisma.booking.deleteMany();
  await prisma.coursePlan.deleteMany();
  await prisma.course.deleteMany();

  // 1. Paid Yoga Classes
  await prisma.course.create({
    data: {
      name: "Paid Yoga Classes",
      slug: "paid-yoga-classes",
      description:
        "Regular yoga classes designed to improve physical and mental well-being.",
      schedule: "Monday to Saturday, 7:15 AM - 8:15 AM",
      active: true,

      plans: {
        create: [
          {
            name: "Monthly",
            price: 1500,
          },
          {
            name: "Quarterly",
            price: 3600,
          },
        ],
      },
    },
  });

  // 2. Free Healing Sessions
  await prisma.course.create({
    data: {
      name: "Free Healing Sessions",
      slug: "free-healing-sessions",
      description:
        "Free healing sessions for individuals interested in experiencing healing practices.",
      schedule: "Monday to Saturday, 8:15 AM - 8:30 AM",
      active: true,

      plans: {
        create: [
          {
            name: "Free Session",
            price: 0,
          },
        ],
      },
    },
  });

  // 3. Paid Healing Club
  await prisma.course.create({
    data: {
      name: "Paid Healing Club",
      slug: "paid-healing-club",
      description:
        "Regular healing sessions designed for continued practice and personal well-being.",
      schedule: "Sessions around 2:30 PM, 4-5 days per week",
      active: true,

      plans: {
        create: [
          {
            name: "Weekly",
            price: 333,
          },
          {
            name: "Monthly",
            price: 1111,
          },
          {
            name: "Quarterly",
            price: 3000,
          },
        ],
      },
    },
  });

  // 4. 1-on-1 Healing Session
  await prisma.course.create({
    data: {
      name: "1-on-1 Healing Session",
      slug: "one-on-one-healing",
      description:
        "Personalized one-on-one healing sessions tailored to individual requirements.",
      schedule: "Customized schedule",
      active: true,

      plans: {
        create: [
          {
            name: "3 Sessions",
            price: 3333,
          },
          {
            name: "5 Sessions",
            price: 5555,
          },
          {
            name: "Customized Plan",
            price: 0,
          },
        ],
      },
    },
  });

  console.log("Courses seeded successfully.");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
