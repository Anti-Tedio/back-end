import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { contactController } from "../controllers/internal/contact.controller";

const contactRoutes = new Hono();

export const contactSchema = z.object({
    name: z.string().min(2, "Nome muito curto").max(100),
    email: z.email("E-mail inválido"),
    subject: z.string().min(3, "Assunto muito curto").max(150),
    message: z.string().min(10, "Mensagem deve ter no mínimo 10 caracteres").max(2000),
});

contactRoutes.post(
    '/', 
    zValidator('json', contactSchema), 
    contactController.send
);

export { contactRoutes };