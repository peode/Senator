import * as sectionsRepository from "../repositories/sectionsRepository.js";

const byNumber = (a, b) => a.id.localeCompare(b.id, undefined, { numeric: true });

const serializeSection = ({ updatedAt, planWidth, planHeight, apartments, ...rest }) => ({
  ...rest,
  // версія в адресі: новий план одразу видно попри довгий кеш зображення
  plan: planWidth && {
    src: `/api/sections/${rest.id}/plan?v=${updatedAt.getTime()}`,
    width: planWidth,
    height: planHeight,
  },
  apartments: apartments.toSorted(byNumber).map(({ sectionId, units, ...apartment }) => ({
    ...apartment,
    units: units.map(({ apartmentId, ...unit }) => unit),
  })),
});

export const listSections = async () => (await sectionsRepository.findAll()).map(serializeSection);

export const updateSection = async (id, data) =>
  serializeSection(await sectionsRepository.update(id, data));

export const getPlanImage = async (id) => {
  const { planImage } = await sectionsRepository.findPlanImage(id);
  return planImage && Buffer.from(planImage);
};

export const updateSectionPlan = async (id, { plan, apartments }) =>
  serializeSection(
    await sectionsRepository.updatePlan(id, {
      plan: plan && {
        ...plan,
        image: Buffer.from(plan.image.slice(plan.image.indexOf(",") + 1), "base64"),
      },
      apartments,
    }),
  );
