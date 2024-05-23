import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient().$extends({
  query: {
    user: {
      async findMany({ model, operation, args, query }) {
        args.where = { ...args.where, name: { not: "Alice" } };
        return query(args);
      },
    },
  },
});

async function main() {
  // await prisma.user.create({
  //   data: {
  //     name: "Alice",
  //     email: "alice@prisma.io",
  //     posts: {
  //       create: { title: "Hello World" },
  //     },
  //     profile: {
  //       create: { bio: "I like turtles" },
  //     },
  //   },
  // });

  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
      profile: true,
    },
  });
  console.log(allUsers);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
