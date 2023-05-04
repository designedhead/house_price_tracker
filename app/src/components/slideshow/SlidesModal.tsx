import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React from "react";
import Slides from "./Slides";

interface Props {
  media: string[];
  isOpen: boolean;
  onClose: () => void;
  slideIndex?: number;
}

const SlidesModal = ({ media, isOpen, onClose, slideIndex = 0 }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Images Preview</ModalHeader>
        <ModalCloseButton />
        <ModalBody h="full" bgColor="rgba(0, 0, 0, 0.2)">
          <Slides
            media={media}
            height="80vh"
            fitType="contain"
            slideIndex={slideIndex}
          />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SlidesModal;
