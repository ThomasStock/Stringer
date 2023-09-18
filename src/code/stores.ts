import storage from "./storage";

export interface Stringer {
  template: string;
  entries: Record<string, string>;
  prefix: string;
  suffix: string;
}

const template = `INSERT INTO Customers (CustomerName, Country)
VALUES ('??name??', '??country??');`;
const entries = { name: "John\nIgor", country: "USA\nUkraine" };
const prefix = "??";
const suffix = "??";

export const defaultStringer: Stringer = { template, entries, prefix, suffix };

export const stringerStore = storage<Stringer>("STRINGER", defaultStringer);
