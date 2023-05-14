import { Center, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import React from "react";
import type { ExtendedProperty } from "~/interfaces/Prisma";
import PropertyTile from "./PropertyTile";
import { AnimatePresence } from "framer-motion";

interface Props {
  properties: ExtendedProperty[];
  loading: boolean;
}

const PropertiesList = ({ properties, loading }: Props) => {
  if (loading) {
    return (
      <Center mt={4}>
        <Spinner />
      </Center>
    );
  }

  if (!properties?.length) {
    return (
      <Center mt={4}>
        <Text>No results to display</Text>
      </Center>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4} mb={20}>
      <AnimatePresence>
        {properties.map((property, index) => (
          <PropertyTile key={property.id} details={property} index={index} />
        ))}
      </AnimatePresence>
    </SimpleGrid>
  );
};

export default PropertiesList;
