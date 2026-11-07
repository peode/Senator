import { apartmentFiltersSchema } from "../lib/schemas.js";
import * as apartmentsService from "../services/apartmentsService.js";

export const list = async (req, res) => {
  res.json(await apartmentsService.listApartmentsForSale(apartmentFiltersSchema.parse(req.query)));
};
