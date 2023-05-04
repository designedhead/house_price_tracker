import React from "react";
import { Navigation, Pagination, Scrollbar, A11y, Keyboard } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { Box } from "@chakra-ui/react";

interface Props {
  media: string[];
  height?: string;
  fitType?: "cover" | "contain";
  slideIndex?: number;
  setIndex?: (index: number) => void;
}

const Slides = ({
  media,
  height = "50vh",
  fitType = "cover",
  slideIndex = 0,
  setIndex = () => null,
}: Props) => {
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      onSlideChange={(e) => setIndex(e.activeIndex)}
      modules={[Navigation, Pagination, Scrollbar, A11y, Keyboard]}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      keyboard={{ enabled: true }}
      initialSlide={slideIndex}
    >
      {media?.map((media, i) => (
        <SwiperSlide key={i}>
          <Box w="full" h={height}>
            <Image
              src={media}
              alt={media}
              fill
              style={{ objectFit: fitType, userSelect: "none" }}
            />
          </Box>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Slides;
