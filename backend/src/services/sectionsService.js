import { toImageData } from "../lib/imageData.js";
import * as sectionsRepository from "../repositories/sectionsRepository.js";

const byNumber = (a, b) => a.id.localeCompare(b.id, undefined, { numeric: true });

const serializeSection = ({
  updatedAt,
  planWidth,
  planHeight,
  mobilePlanWidth,
  mobilePlanHeight,
  apartments,
  ...rest
}) => ({
  ...rest,
  // версія в адресі: новий план одразу видно попри довгий кеш зображення
  plan: planWidth && {
    src: `/api/sections/${rest.id}/plan?v=${updatedAt.getTime()}`,
    width: planWidth,
    height: planHeight,
  },
  mobilePlan: mobilePlanWidth && {
    src: `/api/sections/${rest.id}/mobile-plan?v=${updatedAt.getTime()}`,
    width: mobilePlanWidth,
    height: mobilePlanHeight,
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

export const getMobilePlanImage = async (id) => {
  const { mobilePlanImage } = await sectionsRepository.findMobilePlanImage(id);
  return mobilePlanImage && Buffer.from(mobilePlanImage);
};

export const updateSectionPlan = async (id, { plan, mobilePlan, apartments }) =>
  serializeSection(
    await sectionsRepository.updatePlan(id, {
      plan: plan && toImageData(plan),
      mobilePlan: mobilePlan && toImageData(mobilePlan),
      apartments: apartments.map(({ mobilePoints, ...apartment }) => ({
        ...apartment,
        ...(mobilePoints !== undefined && { mobilePoints }),
      })),
    }),
  );

export const updateComplexMap = async ({ map, zones }) => {
  await sectionsRepository.updateMap({ map: map && toImageData(map), zones });
  return listSections();
};
