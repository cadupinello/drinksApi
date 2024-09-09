"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/server.ts
var import_fastify = __toESM(require("fastify"));
var import_client = require("@prisma/client");
var import_zod = require("zod");
var app = (0, import_fastify.default)();
var prisma = new import_client.PrismaClient();
app.get("/drinks", async () => {
  const drinks = await prisma.drink.findMany();
  return drinks;
});
app.get("/drinks/:id", async (request) => {
  const { id } = request.params;
  const drink = await prisma.drink.findUnique({
    where: {
      id
    }
  });
  return drink;
});
app.post("/drinks", async (request, reply) => {
  const createDrinkSchema = import_zod.z.object({
    name: import_zod.z.string(),
    description: import_zod.z.string(),
    price: import_zod.z.number(),
    photo: import_zod.z.string(),
    category: import_zod.z.string(),
    availableDays_sunday: import_zod.z.boolean(),
    availableDays_monday: import_zod.z.boolean(),
    availableDays_tuesday: import_zod.z.boolean(),
    availableDays_wednesday: import_zod.z.boolean(),
    availableDays_thursday: import_zod.z.boolean(),
    availableDays_friday: import_zod.z.boolean(),
    availableDays_saturday: import_zod.z.boolean()
  });
  const { name, description, price, photo, category, availableDays_sunday, availableDays_monday, availableDays_tuesday, availableDays_wednesday, availableDays_thursday, availableDays_friday, availableDays_saturday } = createDrinkSchema.parse(request.body);
  await prisma.drink.create({
    data: {
      name,
      description,
      price: {
        create: {
          amount: price
        }
      },
      photo: {
        create: {
          url: photo
        }
      },
      category: {
        create: {
          name: category
        }
      },
      availableDays_sunday: availableDays_sunday ?? true,
      availableDays_monday: availableDays_monday ?? true,
      availableDays_tuesday: availableDays_tuesday ?? true,
      availableDays_wednesday: availableDays_wednesday ?? true,
      availableDays_thursday: availableDays_thursday ?? true,
      availableDays_friday: availableDays_friday ?? true,
      availableDays_saturday: availableDays_saturday ?? true
    }
  });
  return reply.status(201).send(201);
});
app.listen({
  host: "0.0.0.0",
  port: process.env.PORT ? Number(process.env.PORT) : 3333
}).then(() => {
  console.log(`Server running on port ${process.env.PORT ? Number(process.env.PORT) : 3333}`);
});
