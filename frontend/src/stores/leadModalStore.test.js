import { expect, it } from "vitest";
import { useLeadModalStore } from "./leadModalStore";

const store = () => useLeadModalStore.getState();

it("відкривається з текстом коментаря й очищує його при закритті", () => {
  store().open("Секція №4");
  expect(store()).toMatchObject({ isOpen: true, comment: "Секція №4" });

  store().close();
  expect(store()).toMatchObject({ isOpen: false, comment: "" });
});

it("без аргумента відкривається з порожнім коментарем", () => {
  store().open();

  expect(store().comment).toBe("");
});
