import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  useDisclosure,
  useColorModeValue,
  VStack,
  HStack,
  Text,
  Box,
  useToast, // Import Toast for notifications
} from '@chakra-ui/react';

const AddClientModal = ({ isOpen, onClose, clientData, handleInputChange, handleSubmit }) => {
  const toast = useToast(); // Initialize the Toast component
  const formBg = useColorModeValue("white", "#2D3748"); // Light and dark mode backgrounds
  const formBorderColor = useColorModeValue("gray.200", "gray.600");
  const buttonBg = useColorModeValue("blue.500", "blue.300");
  const buttonHoverBg = useColorModeValue("blue.600", "blue.400");

  // Enhanced handleSubmit function with validation
  const handleSubmitWithValidation = () => {
    console.log("handleSubmitWithValidation")
    const { clientId, clientName } = clientData;
    if (!clientId || !clientName) {
      toast({
        title: "Validation Error",
        description: "Please fill out all fields before submitting.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    handleSubmit();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent bg={formBg} borderWidth="1px" borderColor={formBorderColor}>
        <ModalHeader>Add New Client</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <FormControl id="clientId" isRequired>
              <FormLabel>Client ID</FormLabel>
              <Input
                type="text"
                name="clientId"
                value={clientData.clientId}
                onChange={handleInputChange}
                placeholder="Enter Client ID"
              />
            </FormControl>
            <FormControl id="clientName" isRequired>
              <FormLabel>Client Name</FormLabel>
              <Input
                type="text"
                name="clientName"
                value={clientData.clientName}
                onChange={handleInputChange}
                placeholder="Enter Client Name"
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={4}>
            <Button
              variant="outline"
              colorScheme="blue"
              mr={3}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmitWithValidation}
              bg={buttonBg}
              _hover={{ bg: buttonHoverBg }}
            >
              Submit
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddClientModal;
