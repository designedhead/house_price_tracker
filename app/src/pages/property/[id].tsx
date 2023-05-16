import type { GetServerSidePropsContext } from "next";
import React from "react";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "../../server/db";
import {
  Box,
  Container,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  IconButton,
  useToast,
  Spinner,
  Badge,
  useDisclosure,
} from "@chakra-ui/react";

import { formatAsCurrency } from "~/helpers/currency";
import { ChevronDownIcon, DeleteIcon, ViewIcon } from "@chakra-ui/icons";
import { api } from "~/utils/api";
import Link from "next/link";
import type { ExtendedProperty } from "~/interfaces/Prisma";

import PropertyChart from "~/components/charts/PropertyChart";
import SlidesModal from "~/components/slideshow/SlidesModal";
import Slides from "~/components/slideshow/Slides";

interface Props {
  property: ExtendedProperty;
}

const PropertyDetails = ({ property }: Props) => {
  const toast = useToast();
  const [slideIndex, setSlideIndex] = React.useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [propertyArchived, setPropertyArchived] = React.useState(
    property.archived
  );

  const { mutate, isLoading } = api.rightMove.archive.useMutation({
    onSuccess: () => {
      toast({
        title: "Property archived",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setPropertyArchived(true);
    },
    onError: (err) => {
      toast({
        title: err.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    },
  });

  const handleArchive = () => {
    mutate({ id: property.id });
  };

  return (
    <Container maxW="container.lg">
      {property.image && (
        <Box position="relative" w="full" h="50vh">
          <Stack
            position="absolute"
            zIndex={3}
            bottom={0}
            left={0}
            p={4}
            w="full"
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Stack>
              <Heading>{property.name}</Heading>
              <Text>{formatAsCurrency({ value: property.price })}</Text>
              <Box>
                {propertyArchived && (
                  <Badge colorScheme="red" p={1}>
                    Archived
                  </Badge>
                )}
                {property.sold && (
                  <Badge colorScheme="teal" p={1}>
                    Sold
                  </Badge>
                )}
              </Box>
            </Stack>

            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={!isLoading ? <ChevronDownIcon /> : <Spinner />}
                variant="outline"
              />
              <MenuList>
                <Link href={property.url} target="_blank" passHref>
                  <MenuItem icon={<ViewIcon />}>View</MenuItem>
                </Link>
                <MenuItem icon={<DeleteIcon />} onClick={handleArchive}>
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          </Stack>
          <Box
            zIndex={2}
            backgroundColor="rgba(0, 0, 0, 0.5)"
            w="full"
            h="full"
            position="absolute"
            pointerEvents="none"
          />
          <Box onClick={onOpen}>
            <Slides media={property?.media} setIndex={setSlideIndex} />
          </Box>
        </Box>
      )}
      <PropertyChart updates={property.PropertyUpdates} />
      <SlidesModal
        media={property?.media}
        isOpen={isOpen}
        onClose={onClose}
        slideIndex={slideIndex}
      />
    </Container>
  );
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

  if (!context?.params?.id)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const property = await prisma.property.findUnique({
    where: {
      id: context.params.id as string,
    },
    include: {
      PropertyUpdates: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return {
    props: {
      session,
      property: {
        ...property,
        createdAt: property?.createdAt?.toISOString(),
        updatedAt: property?.updatedAt?.toISOString(),
        PropertyUpdates: property?.PropertyUpdates.map((update) => ({
          ...update,
          createdAt: update.createdAt?.toISOString(),
        })),
      },
    },
  };
}

PropertyDetails.defaultProps = {
  hasHeader: true,
};

export default PropertyDetails;
