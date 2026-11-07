import { idSchema, leadSchema, leadStatusSchema } from "../lib/schemas.js";
import * as leadsService from "../services/leadsService.js";

export const create = async (req, res) => {
  await leadsService.submitLead(leadSchema.parse(req.body));
  res.status(201).json({ ok: true });
};

export const list = async (req, res) => {
  res.json(await leadsService.listLeads());
};

export const getOne = async (req, res) => {
  res.json(await leadsService.getLead(idSchema.parse(req.params.id)));
};

export const updateStatus = async (req, res) => {
  const id = idSchema.parse(req.params.id);
  res.json(await leadsService.updateLead(id, leadStatusSchema.parse(req.body)));
};

export const remove = async (req, res) => {
  await leadsService.deleteLead(idSchema.parse(req.params.id));
  res.status(204).end();
};
