import * as leadsRepository from "../repositories/leadsRepository.js";
import { notifyNewLead } from "./telegramService.js";

export const listLeads = () => leadsRepository.findAll();

export const getLead = (id) => leadsRepository.findByIdOrThrow(id);

export const submitLead = async ({ website, ...data }) => {
  // бот заповнив приманку — вдаємо успіх, але не зберігаємо
  if (website) return;
  const lead = await leadsRepository.create(data);
  // await потрібен: на serverless функцію можуть зупинити одразу після відповіді
  await notifyNewLead(lead);
};

export const updateLead = (id, data) => leadsRepository.update(id, data);

export const deleteLead = (id) => leadsRepository.remove(id);
