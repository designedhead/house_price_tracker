import React from "react";
import type { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";
import {
  Button,
  Center,
  Container,
  Flex,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import CreateNew from "~/components/create/CreateNew";

import PropertyTile from "~/components/tiles";
import { prisma } from "~/server/db";
import type { ExtendedProperty } from "~/interfaces/Prisma";

interface Props {
  properties: ExtendedProperty[];
}

const Home = ({ properties }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Container maxW="container.lg" mt={10}>
      <Flex justify="flex-end" mb={5}>
        <Button onClick={onOpen}>Add new</Button>
      </Flex>
      <CreateNew isOpen={isOpen} onClose={onClose} />
      {!properties.length ? (
        <Center>
          <Text>No results to display</Text>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
          {properties?.map((property) => (
            <PropertyTile key={property.id} details={property} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
};

export default Home;

Home.defaultProps = {
  hasHeader: true,
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  if (!session)
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };

  const properties = await prisma.property.findMany({
    where: {
      archived: false,
    },
    select: {
      id: true,
      name: true,
      image: true,
      price: true,
      url: true,
      sold: true,
      PropertyUpdates: {
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          price: true,
        },
      },
    },
    orderBy: [
      {
        sold: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  return {
    props: { session, properties },
  };
}
