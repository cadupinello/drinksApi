import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import cors from "@fastify/cors";

const app = fastify();

app.register(cors, {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
});

const prisma = new PrismaClient();

app.addHook('onClose', async () => {
  await prisma.$disconnect();
})

app.get("/drinks", async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { category = '', page = '1', limit = '10' } = request.query as {
      category?: string;
      page?: string;
      limit?: string;
    };

    const drinks = await prisma.drink.findMany({
      where: {
        category: {
          name: {
            contains: category,
            mode: 'insensitive'
          },
        },
      },
      include: {
        category: true,
        price: true,
        photo: true,
      },
      skip: page ? (Number(page) - 1) * Number(limit) : undefined,
      take: limit ? Number(limit) : undefined,
    });

    const totalDrinks = await prisma.drink.count({
      where: {
        category: {
          name: {
            contains: category,
            mode: 'insensitive'
          },
        },
      },
    });
    const totalPages = Math.ceil(totalDrinks / Number(limit));

    reply.send({
      data: drinks.map(drink => ({
        id: drink.id,
        name: drink.name,
        description: drink.description,
        category: drink?.category?.name,
        photo: drink?.photo?.url,    
        price: drink?.price?.amount,
      })),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalDrinks,
        totalPages
      }
    });
  } catch (err) {
    reply.status(500).send({
      message: 'Erro ao consultar os drinks',
      err
    });
  }
})

app.get("/drinks/:id", async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const { id } = request.params;
    const drink = await prisma.drink.findUnique({
      where: {
        id: id,
      },
    });

    if (!drink) {
      return reply.status(404).send({
        message: 'Drink não encontrado',
      })
    }

    reply.status(200).send(drink);
  } catch (err) {
    reply.status(500).send({
      message: 'Erro ao consultar o drink',
      err
    });
  }
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