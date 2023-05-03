import React from "react";
import type { GetServerSidePropsContext, NextPage } from "next";
import { getServerAuthSession } from "~/server/auth";
import {
  Button,
  Container,
  Flex,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import CreateNew from "~/components/create/CreateNew";
import { api } from "~/utils/api";
import PropertyTile from "~/components/tiles";

const Home: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data } = api.rightMove.getAll.useQuery();

  return (
    <Container maxW="container.lg" mt={10}>
      <Flex justify="flex-end" mb={5}>
        <Button onClick={onOpen}>Add new</Button>
      </Flex>
      <CreateNew isOpen={isOpen} onClose={onClose} />
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
        {data?.map((property) => (
          <PropertyTile key={property.id} details={property} />
        ))}
      </SimpleGrid>
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

  return {
    props: { session: session },
  };
}
