import fastify, { FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const app = fastify();

const prisma = new PrismaClient();

app.get("/drinks", async () => {
  const drinks = await prisma.drink.findMany();

  return drinks;
})

app.get("/drinks/:id", async (request: FastifyRequest<{ Params: { id: string } }>) => {
  const { id } = request.params;
  const drink = await prisma.drink.findUnique({
    where: {
      id: id,
    },
  });

  return drink;
})

app.post("/drinks", async (request, reply) => {
  const createDrinkSchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    photo: z.string(),
    category: z.string(),
    availableDays_sunday: z.boolean(),
    availableDays_monday: z.boolean(),
    availableDays_tuesday: z.boolean(),
    availableDays_wednesday: z.boolean(),
    availableDays_thursday: z.boolean(),
    availableDays_friday: z.boolean(),
    availableDays_saturday: z.boolean(),
  })

  const { name, description, price, photo, category, availableDays_sunday, availableDays_monday, availableDays_tuesday, availableDays_wednesday, availableDays_thursday, availableDays_friday, availableDays_saturday } = createDrinkSchema.parse(request.body);

  await prisma.drink.create({
    data: {
      name,
      description,
      price: {
        create: {
          amount: price
        },
      },
      photo: {
        create: {
          url: photo
        },
      },
      category: {
        create: {
          name: category
        },
      },
      availableDays_sunday: availableDays_sunday ?? true,
      availableDays_monday: availableDays_monday ?? true,
      availableDays_tuesday: availableDays_tuesday ?? true,
      availableDays_wednesday: availableDays_wednesday ?? true,
      availableDays_thursday: availableDays_thursday ?? true,
      availableDays_friday: availableDays_friday ?? true,
      availableDays_saturday: availableDays_saturday ?? true,
    }
  });

  return reply.status(201).send(201);
})

app.listen({
  host: "0.0.0.0",
  port: process.env.PORT ? Number(process.env.PORT) : 3333,
}).then(() => {
  console.log(`Server running on port ${process.env.PORT ? Number(process.env.PORT) : 3333}`);
})