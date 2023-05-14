import React from "react";
import type { GetServerSidePropsContext } from "next";
import { getServerAuthSession } from "~/server/auth";
import {
  Button,
  Container,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
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

type SortingType = "default" | "price" | "old_first";
type FilterType = "sold_only";

const sortingTypeLabels: Record<SortingType, string> = {
  default: "Default",
  price: "Price",
  old_first: "Old First",
};

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sort, setSort] = React.useState<SortingType>("default");
  const [filters, setFilters] = React.useState<FilterType[]>([]);
  const { data, isLoading } = api.rightMove.getAll.useQuery({ sort, filters });
  const selectedSortLabel = sortingTypeLabels[sort];

  return (
    <Container maxW="container.lg" mt={10}>
      <Flex justify="space-between" mb={5}>
        <Menu closeOnSelect={false}>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Text casing="capitalize">{selectedSortLabel}</Text>
          </MenuButton>
          <Portal>
            <MenuList>
              <MenuOptionGroup
                title="Sorting"
                defaultValue="default"
                type="radio"
                onChange={(e) => {
                  const value = e as SortingType;
                  setSort(value);
                }}
              >
                <MenuItemOption value="default">Default</MenuItemOption>
                <MenuItemOption value="price">Price</MenuItemOption>
                <MenuItemOption value="old_first">Oldest first</MenuItemOption>
              </MenuOptionGroup>
              <MenuDivider />
              <MenuOptionGroup
                title="Filters"
                type="checkbox"
                onChange={(e) => setFilters(e as FilterType[])}
              >
                <MenuItemOption value="sold_only">Sold Only</MenuItemOption>
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
