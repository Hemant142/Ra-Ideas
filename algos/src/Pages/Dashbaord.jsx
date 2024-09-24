import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  VStack,
  Divider,
  SimpleGrid,
  Button,
  Icon,
  useColorModeValue,
  Badge,
  HStack,
  Tooltip,
  useToast,
  Switch,
  FormLabel,
  FormControl,
  Image,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { FaListAlt, FaChevronRight, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Components/Navbar";
import StrategyDetailsModal from "../Components/StrategyDetailsModal";
import AddClientModal from "../Components/AddClientModal"; // Import new component
import Cookies from "cookies-js";
import { fetchBasket, fetchClientData, getSuccessAction, updateAlgorithmStatus } from "../Redux/basketReducer/action";
import { fetchClients, postAddClient } from "../Redux/clientReducer/action";
import ClientCount from "../Components/ClientCount";



export default function Dashboard() {
  let baskets = useSelector((store) => store.basketReducer.baskets);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const token = Cookies.get("login_token_zetaMoney");
  const dispatch = useDispatch();
  const toast = useToast();

  // Ensure baskets is an array
  if (!Array.isArray(baskets)) {
    baskets = [];
  }

  // State to manage modal visibility and selected strategy
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State to manage the client form modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [clientData, setClientData] = useState({
    clientId: "",
    clientName: "",
  });

 

  useEffect(() => {
    dispatch(fetchBasket(token))
      .then((res) => {
        console.log(res,"REsponse")
        const fetchedData = res.data.data.algorithms;


        // Dispatch the combined data
        dispatch(getSuccessAction(fetchedData));
      })
      .catch((error) => {
        // Handle the error
    
        if (error.response.data.detail !== "Basket does not exist") {
          toast({
            title: `${error.message} error`,
            position: "bottom",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        }
      });


      dispatch(fetchClients(token));
  }, [token, dispatch, toast, updateSuccess]);

  // Function to handle opening the modal with the selected strategy
  const handleViewDetails = (strategy) => {
    // console.log(strategy.isActive,"strategy")
    setSelectedStrategy(strategy);
    Cookies.set("algoName_zetaMoney", `${strategy.name}`);
    Cookies.set("algothmStatus_zetaMoney", `${strategy.isActive}`);
    setIsModalOpen(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStrategy(null);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData({
      ...clientData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = () => {
   console.log(clientData,"handleSubmit")
    dispatch(postAddClient(clientData, token))
      .then((res) => {
        console.log(res,"postAddClient")
        if (res.message == "this client name allready exist") {
          toast({
            title: "Please Change the name",
            description: "This client name allready exist",
            status: "warning",
            duration: 2000,
            isClosable: true,
          });
        } else if (
          res.message ==
          "client with this client ID is allready present in the database"
        ) {
          toast({
            title: "Please Change the name",
            description:
              "Client with this client ID is allready present in the database",
            status: "warning",
            duration: 2000,
            isClosable: true,
          });
        }

        if (res.status == "success") {
          toast({
            title: "Client Added successful.",
            description: "You've Added Client successfully.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setClientData({
            clientId: "",
            clientName: "",
          });
          onClose(); // Close the modal
        }
      })
      .catch((error) => {
        console.log(error, "Client Added error");
      });
    // Reset form after submission
  };

  // Use useColorModeValue to get the appropriate colors for light and dark modes
  const bg = useColorModeValue("#f4f6f8", "#1a202c");
  const cardBg = useColorModeValue(
    "rgba(255, 255, 255, 0.8)",
    "rgba(45, 55, 72, 0.8)"
  ); // Added transparency
  const headingColor = useColorModeValue("#2a4365", "#f4a300");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue(
    "rgba(226, 232, 240, 0.8)",
    "rgba(74, 85, 104, 0.8)"
  ); // Added transparency
  const hoverBorderColor = useColorModeValue(
    "rgba(203, 213, 224, 0.8)",
    "rgba(113, 128, 150, 0.8)"
  ); // Added transparency

  // Conditional shadow for hover effect
  const hoverShadow = useColorModeValue(
    "0px 8px 24px rgba(0, 0, 0, 0.2)", // Light mode shadow
    "0px 12px 30px rgba(255, 255, 255, 0.4)" // Dark mode shadow with more intensity
  );
  const hoverTransform = "translateY(-6px)";

  const truncateDescription = (description, length = 52) => {
    if (description.length <= length) {
      return description;
    }
    return `${description.substring(0, length)}...`;
  };

  const truncateStrategies = (description, length = 30) => {
    if (description.length <= length) {
      return description;
    }
    return `${description.substring(0, length)}...`;
  };


  const handleUpdateAlgoStatus = ({ _id, isActive }) => {
  
    const status = isActive ? "False" : "True";

    // Prepare the data to be sent for updating the client status
    const updateState = {
      alog_id: _id,
      isActiveStatus: status,
    };

    dispatch(updateAlgorithmStatus(updateState, token))
      .then((res) => {
  

        if (res.data.status === "success") {
          toast({
            title: "Status Updated",
            description: "The Algorithm status has been successfully updated.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          // Set updateSuccess to true to trigger re-fetch
          setUpdateSuccess(!updateSuccess);
        } else if (res.data.status === "error") {
          toast({
            title: "Update Failed",
            description: "There was an error updating the Algoritm status. Please try again.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      })
      .catch((error) => {
        console.log(error, "IS Active error");
        toast({
          title: "Request Failed",
          description: "There was an issue with the request. Please try again later.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <Box
      bg={bg}
      minH="100vh"
      pt="60px"
      px={8}
      
      // bgImage="url('https://w0.peakpx.com/wallpaper/25/212/HD-wallpaper-avengers-endgame-final-team.jpg')" // Path to your background image
      // bgSize="cover" // Ensures the image covers the whole Box
      // bgPosition="center" // Centers the image
      // bgRepeat="no-repeat" // Prevents image repetition

    >
      {" "}
      {/* Add pt="60px" to account for the fixed Navbar */}
      <Navbar />
      <Box maxW="1200px" mx="auto" p={5}>
        <Flex justify="space-between" align="center" mb={8} mt={4}>
          <Heading size="lg" color={headingColor} fontWeight="bold">
            Algo Strategies
          </Heading>
          <Button
            colorScheme="teal"
            rightIcon={<FaPlus />}
            variant="outline"
            onClick={onOpen} // Open the AddClientModal when clicked
            size="md"
            px={6}
            py={3}
            // borderRadius="full"
            boxShadow="md"
            _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
            transition="all 0.2s"
          >
            Add Client
          </Button>
        </Flex>

        {baskets.length > 0 ? (
          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
            {baskets.map((basket) => {
              const {
                _id,
                name,
                strategy1,
                strategy2,
                strategy3,
                description,
                fundRequired,
                clientNumber,
                isActive,
              } = basket;

              const statusColor = isActive ? "green" : "red";

              return (
                <Box
                  key={_id} // Using `id` as the unique key
                  p={6}
                  borderRadius="12px"
                  bg={cardBg}
                  border={`1px solid ${borderColor}`}
                  transition="all 0.3s"
                  _hover={{
                    boxShadow: hoverShadow,
                    transform: hoverTransform,
                    borderColor: hoverBorderColor, // Use the variable here
                  }}
                >
                  <VStack align="start" spacing={4}>
                    <Flex justifyContent="space-between" w="100%">
                      <HStack spacing={2} alignItems="center">
                        <Tooltip
                          hasArrow
                          label={name}
                          aria-label="Full strategy name"
                        >
                          <span>
                            {/* This span is needed to wrap the Icon as Tooltip doesn't work directly with Icon */}
                            <Icon
                              mt={2}
                              as={FaListAlt}
                              boxSize={5}
                              color={headingColor}
                            />
                          </span>
                        </Tooltip>

                        <Heading
                          size="md"
                          color={textColor}
                          fontWeight="bold"
                          noOfLines={1}
                          maxWidth="150px"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                        >
                          {name}
                        </Heading>
                      </HStack>

                      <Box>
                        <Badge
                          marginRight={2}
                          colorScheme={
                            statusColor === "green" ? "green" : "red"
                          }
                        >
                          {isActive ? "Live" : "Deploy"}
                        </Badge>

                        <Switch
                          isChecked={isActive}
                          colorScheme={isActive ? "green" : "red"}
                          onChange={() =>
                            handleUpdateAlgoStatus({_id,isActive})
                          }
                          trackColor={{
                            base: "gray.300",
                            checked: isActive ? "green" : "red.400",
                          }}
                          thumbColor={isActive ? "green" : "red.500"}
                        />
                      </Box>

                      {/* <Button
                      size={'sm'}
                        variant="outline"
                        colorScheme={statusColor === "green" ? "green" : "red"}
                      >
                        {" "}
                        <Badge
                          marginRight={2}
                          colorScheme={
                            statusColor === "green" ? "green" : "red"
                          }
                        >
                          {isActive ? "Live" : "Deploy"}
                        </Badge>{" "}
                      </Button> */}
                    </Flex>
                    <Divider borderColor={borderColor} />
                    <Text
                      fontSize="sm"
                      color={textColor}
                      noOfLines={2}
                      textAlign={"left"}
                    >
                      <strong>Strategies:</strong>{" "}
                      {`${[strategy1, strategy2, strategy3]
                        .filter(Boolean)
                        .join(", ")
                        .slice(0, 35)}${
                        [strategy1, strategy2, strategy3]
                          .filter(Boolean)
                          .join(", ").length > 35
                          ? "..."
                          : ""
                      }`}
                    </Text>

                    <Text
                      fontSize="sm"
                      color={textColor}
                      noOfLines={3}
                      textAlign={"left"}
                    >
                      <strong>Description:</strong>{" "}
                      {truncateDescription(description)}
                    </Text>

                    <HStack
                      justifyContent="space-between"
                      width="100%"
                      alignItems="center"
                      pt={3}
                      textAlign={"left"}
                    >
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" color={textColor}>
                          <strong>Fund Required:</strong> ₹{fundRequired}
                        </Text>
                        <ClientCount basketId={_id} />
                        {/* <Text fontSize="sm" color={textColor}>
                          <strong>Clients:</strong> {clientNumber}
                        </Text> */}
                      </VStack>

                      <Button
                        rightIcon={<FaChevronRight />}
                        colorScheme="teal"
                        variant="outline"
                        onClick={() => handleViewDetails(basket)}
                        mt={4}
                        size="sm"
                        ml="auto"
                      >
                        View Details
                      </Button>
                    </HStack>
                  </VStack>
                </Box>
              );
            })}
          </SimpleGrid>
        ) : (
          <Text>No strategies available.</Text>
        )}

        {/* Add Client Modal */}
        <AddClientModal
          isOpen={isOpen}
          onClose={onClose}
          clientData={clientData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />

        {/* Strategy Details Modal */}
        {selectedStrategy && (
          <StrategyDetailsModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            strategy={selectedStrategy}
          />
        )}
      </Box>
    </Box>
  );
}
