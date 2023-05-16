/* eslint-disable react-hooks/rules-of-hooks */
import {
  Box,
  Center,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  GoogleMap,
  InfoWindowF,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import Link from "next/link";

import React from "react";
import Slides from "~/components/slideshow/Slides";
import { env } from "~/env.mjs";
import { formatAsCurrency } from "~/helpers/currency";
import getCenter from "~/helpers/getCenter";
import type { ExtendedProperty } from "~/interfaces/Prisma";
import { api } from "~/utils/api";

const containerStyle = {
  width: "100%",
  height: "90Vh",
};

const Map = () => {
  const textColor = useColorModeValue("gray.100", "gray.900");
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_API_KEY,
  });

  const { data } = api.rightMove.getAll.useQuery({
    sort: "default",
    filters: [],
  });

  const parsedData = data as ExtendedProperty[];

  const latestPrice = (property: ExtendedProperty) => {
    if (property.PropertyUpdates.length) {
      return property?.PropertyUpdates[0]?.price || property.price;
    } else {
      return property.price;
    }
  };

  const center = getCenter(data as { lat: number; lng: number }[]);

  const [selectedMarker, setSelectedMarker] =
    React.useState<ExtendedProperty | null>(null);
  const handlePick = (property: ExtendedProperty) => {
    setSelectedMarker(property);
  };

  if (!isLoaded) {
    return (
      <Center py={20}>
        <Spinner size="lg" thickness="3px" color="teal" />
      </Center>
    );
  }
  return (
    <Box w="full">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
        {parsedData?.map((property) => (
          <Marker
            key={property.id}
            position={{
              lat: property.lat as number,
              lng: property.lng as number,
            }}
            onClick={() => handlePick(property)}
          />
        ))}
        {selectedMarker && (
          <InfoWindowF
            position={{
              lat: selectedMarker.lat as number,
              lng: selectedMarker.lng as number,
            }}
            onCloseClick={() => setSelectedMarker(null)}
            options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
            key={selectedMarker.id}
          >
            <>
              <Box py={3} pl={1} maxW="450px">
                <Box mb={2} overflow="hidden" borderRadius="lg">
                  <Slides
                    media={selectedMarker.media}
                    height="200px"
                    navigationSize="20px"
                    paginationSize="4px"
                  />
                </Box>
                <Link href={`/property/${selectedMarker.id}`}>
                  <Text color={textColor} fontSize="lg" fontWeight="medium">
                    {selectedMarker.name}
                  </Text>
                  <Text color={textColor}>
                    {formatAsCurrency({
                      value: latestPrice(selectedMarker),
                    })}
                  </Text>
                </Link>
              </Box>
            </>
          </InfoWindowF>
        )}
      </GoogleMap>
    </Box>
  );
};

export default Map;
