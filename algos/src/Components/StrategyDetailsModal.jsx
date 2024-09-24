import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
  useColorModeValue,
  Divider
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ArrowForwardIcon, CloseIcon } from "@chakra-ui/icons";

export default function StrategyDetailsModal({ isOpen, onClose, strategy }) {
  const navigate = useNavigate();
  const textColor = useColorModeValue("gray.700", "gray.300");
  const headingColor = useColorModeValue("gray.800", "yellow.300");
  const buttonBg = useColorModeValue("blue.500", "blue.300");
  const buttonText = useColorModeValue("white", "gray.800");

  const handleMoreDetails = () => {
    navigate(`/basket-details/${strategy._id}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent borderRadius="lg" boxShadow="lg">
        <ModalHeader color={headingColor} fontSize="xl" fontWeight="bold">
          {strategy.name}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack align="start" spacing={4} divider={<Divider borderColor={textColor} />}>
            <Text color={textColor} fontSize="md">
              <strong>Strategy 1:</strong> {strategy.strategy1}
            </Text>
            <Text color={textColor} fontSize="md">
              <strong>Strategy 2:</strong> {strategy.strategy2}
            </Text>
            <Text color={textColor} fontSize="md">
              <strong>Strategy 3:</strong> {strategy.strategy3}
            </Text>
            <Text color={textColor} fontSize="md">
              <strong>Description:</strong> {strategy.description}
            </Text>
            <Text color={textColor} fontSize="md">
              <strong>Fund Required:</strong> ₹{strategy.fundRequired}
            </Text>
            <Text color={textColor} fontSize="md">
              <strong>Clients:</strong> {strategy.clientNumber}
            </Text>
            <Text color={textColor} fontSize="md">
              <strong>Status:</strong> {strategy.isActive ? "Active" : "Inactive"}
            </Text>
            <Text color={textColor} fontSize="md">
              <strong>Deployed:</strong> {strategy.isDeployed ? "Yes" : "No"}
            </Text>
            <Text color={textColor} fontSize="md">
              <strong>Market Type:</strong> {strategy.marketType}
            </Text>
            <Text color={textColor} fontSize="md">
              <strong>State:</strong> {strategy.state}
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            bg={buttonBg}
            color={buttonText}
            mr={3}
            onClick={handleMoreDetails}
            _hover={{ bg: useColorModeValue("blue.600", "blue.400") }}
            leftIcon={<ArrowForwardIcon />}
          >
            More Details
          </Button>
          <Button
            variant="outline"
            borderColor={buttonBg}
            color={buttonBg}
            onClick={onClose}
            _hover={{ bg: useColorModeValue("blue.100", "blue.200") }}
            leftIcon={<CloseIcon />}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
