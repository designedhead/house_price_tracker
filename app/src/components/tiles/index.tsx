import {
  Heading,
  Box,
  Image,
  Text,
  Stack,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import type { Property } from "@prisma/client";
import Link from "next/link";
import { formatAsCurrency } from "~/helpers/currency";

interface Props {
  details: Property;
}

const PropertyTile = ({ details }: Props) => {
  return (
    <Link href={`/property/${details.id}`}>
      <Box
        maxW="270px"
        w="full"
        h="full"
        bg={useColorModeValue("white", "gray.800")}
        boxShadow="2xl"
        rounded="md"
        overflow="hidden"
      >
        <Image
          alt={details.name || "Property Image"}
          h="220px"
          w="full"
          src={
            details.image ||
            "https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
          }
          objectFit="cover"
        />

        <Flex p={6} mb={4}>
          <Stack spacing={1} align="center">
            <Heading
              fontSize="2xl"
              fontWeight={500}
              fontFamily="body"
              textAlign="center"
            >
              {details.name}
            </Heading>
            <Text color="gray.500">
              {formatAsCurrency({ value: details.price })}
            </Text>
          </Stack>

          {/* <Stack direction="row" justify="center" spacing={6}>
            <Stack spacing={0} align="center">
              <Text fontWeight={600}>23k</Text>
              <Text fontSize="sm" color="gray.500">
                Followers
              </Text>
            </Stack>
            <Stack spacing={0} align="center">
              <Text fontWeight={600}>23k</Text>
              <Text fontSize="sm" color="gray.500">
                Followers
              </Text>
            </Stack>
          </Stack> */}
        </Flex>
      </Box>
    </Link>
  );
};

export default PropertyTile;
