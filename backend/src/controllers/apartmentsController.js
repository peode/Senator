import { apartmentFiltersSchema, apartmentUnitSchema, idSchema } from "../lib/schemas.js";
import * as apartmentsService from "../services/apartmentsService.js";

export const list = async (req, res) => {
  res.json(await apartmentsService.listApartmentsForSale(apartmentFiltersSchema.parse(req.query)));
};

export const update = async (req, res) => {
  const id = idSchema.parse(req.params.id);
  res.json(await apartmentsService.updateApartmentUnit(id, apartmentUnitSchema.parse(req.body)));
};
