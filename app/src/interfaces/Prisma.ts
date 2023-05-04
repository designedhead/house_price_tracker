import type { Property, PropertyUpdates } from "@prisma/client";

export type ExtendedProperty = Property & {
  PropertyUpdates: PropertyUpdates[];
};
