import { Router } from "express";
import { registry } from "../openapi.ts";
import { authenticate } from "../middleware/authenticate.ts";
import { validateBody, validateParams, validateQuery } from "../middleware/validate.ts";
import { createAnnouncement, deleteAnnouncement, getAnnouncement, listAnnouncements, updateAnnouncement } from "../controllers/announcements.controller.ts";
import { announcementIdSchema, announcementsQuerySchema, createAnnouncementSchema, updateAnnouncementSchema } from "../validators/announcements.validator.ts";

const router = Router();

router.get("/", validateQuery(announcementsQuerySchema), listAnnouncements);
router.get("/:id", validateParams(announcementIdSchema), getAnnouncement);
router.post("/", authenticate, validateBody(createAnnouncementSchema), createAnnouncement);
router.patch("/:id", authenticate, validateParams(announcementIdSchema), validateBody(updateAnnouncementSchema), updateAnnouncement);
router.delete("/:id", authenticate, validateParams(announcementIdSchema), deleteAnnouncement);

registry.registerPath({ method: "get", path: "/announcements", summary: "List announcements", request: { query: announcementsQuerySchema }, responses: { 200: { description: "Announcements" } } });
registry.registerPath({ method: "get", path: "/announcements/{id}", summary: "Get an announcement", request: { params: announcementIdSchema }, responses: { 200: { description: "Announcement" }, 404: { description: "Not found" } } });
registry.registerPath({ method: "post", path: "/announcements", summary: "Create an announcement", security: [{ bearerAuth: [] }], request: { body: { content: { "application/json": { schema: createAnnouncementSchema } } } }, responses: { 201: { description: "Created" } } });
registry.registerPath({ method: "patch", path: "/announcements/{id}", summary: "Update an announcement", security: [{ bearerAuth: [] }], request: { params: announcementIdSchema, body: { content: { "application/json": { schema: updateAnnouncementSchema } } } }, responses: { 200: { description: "Updated" }, 403: { description: "Access denied" } } });
registry.registerPath({ method: "delete", path: "/announcements/{id}", summary: "Delete an announcement", security: [{ bearerAuth: [] }], request: { params: announcementIdSchema }, responses: { 204: { description: "Deleted" } } });

export default router;
