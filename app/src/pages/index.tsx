import React from "react";
import type { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";
import {
  Button,
  Container,
  Flex,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Portal,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import CreateNew from "~/components/create/CreateNew";

import { api } from "~/utils/api";
import { ChevronDownIcon } from "@chakra-ui/icons";
import PropertiesList from "~/components/properties/PropertiesList";
import type { ExtendedProperty } from "~/interfaces/Prisma";

type SortingType = "default" | "price";

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sort, setSort] = React.useState<SortingType>("default");
  const { data, isLoading } = api.rightMove.getAll.useQuery({ sort });
  return (
    <Container maxW="container.lg" mt={10}>
      <Flex justify="space-between" mb={5}>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Text casing="capitalize">{sort}</Text>
          </MenuButton>
          <Portal>
            <MenuList>
              <MenuOptionGroup
                defaultValue="default"
                type="radio"
                onChange={(e) => {
                  const value = e as SortingType;
                  setSort(value);
                }}
              >
                <MenuItemOption value="default">Default</MenuItemOption>
                <MenuItemOption value="price">Price</MenuItemOption>
              </MenuOptionGroup>
            </MenuList>
          </Portal>
        </Menu>
        <Button onClick={onOpen}>Add new +</Button>
      </Flex>
      <CreateNew isOpen={isOpen} onClose={onClose} />
      <PropertiesList
        properties={data as ExtendedProperty[]}
        loading={isLoading}
      />
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
    props: { session },
  };
}
