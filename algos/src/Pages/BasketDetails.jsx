import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "cookies-js";
import {
  addAlgoClient,
  AddAlgoClient,
  fetchAlgoClients,
  fetchClients,
  fetchHistoryClient,
  fetchPositionClient,
  UpdateClientStatus,
  updateLotMultiplier,
} from "../Redux/clientReducer/action";
import axios from "axios";
import {
  Box,
  Flex,
  VStack,
  Text,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Switch,
  FormControl,
  FormLabel,
  useColorModeValue,
  useToast,
  Button,
  Stack,
  InputGroup,
  InputLeftElement,
  useBreakpointValue,
  Divider,
  HStack,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import Navbar from "../Components/Navbar";
import {
  FaChartBar,
  FaPlus,
  FaSearch,
  FaUser,
  FaUserPlus,
} from "react-icons/fa";
import { colors } from "../theme/theme";
import { BsDisplay } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import ClientPosition from "../Components/ClientPosition";
import ClientHistory from "../Components/ClientHistory";
import { IoArrowBackCircle, IoPersonAdd } from "react-icons/io5";
import { AiOutlineUserAdd } from "react-icons/ai";

const clientPosition = [
  {
    _id: "66d727ac470a0bbe03b98fff",
    algoClientId: "66d30685077e5d11d5e64315",
    instrument: "51400BANKNIFTY04SEP2024PE",
    instrumentPrice: 76.45,
    instrumentQuantity: 2,
    transationType: "BUY",
  },
  {
    _id: "66d97a8b4f0dcc238e25e177",
    algoClientId: "66d300e20872038eb32f1217",
    instrument: "51400BANKNIFTY04SEP2024PE",
    instrumentPrice: 76.45,
    instrumentQuantity: 2,
    transationType: "BUY",
  },
];

export default function BasketDetails() {
  const dispatch = useDispatch();
  const token = Cookies.get("login_token_zetaMoney");
  const clientList = useSelector((store) => store.clientsReducer.clients);
  const algoClientList = useSelector(
    (store) => store.clientsReducer.algoClients
  );

 
// console.log(clientList,"clientList")
// console.log(algoClientList,"algoClientList")
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientPosition, setClientPosition] = useState(null);
  const [clientName, setClientName] = useState("");
  const [clientHistory, setClientHistory] = useState(null);
  const [statusToggle, setStatusToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lotValues, setLotValues] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(10);
  const toast = useToast();
  const topRef = useRef(null);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchClients(token));
    dispatch(fetchAlgoClients(id, token));
  }, [dispatch, token, statusToggle, id]);

  let algoName = Cookies.get("algoName_zetaMoney");
  let algorithmStatus = Cookies.get("algothmStatus_zetaMoney") === "true";


  useEffect(() => {
    const initializeLotValues = () => {
      const initialLotValues = {};
      
      clientList.forEach((client) => {
        // Find the algo client corresponding to the current client
        const algoClient = algoClientList.find(
          (algo) => algo.clientId === client._id
        );
  
        // If algoClient exists, use its lotMultiplier, otherwise set to 1
        initialLotValues[client._id] = algoClient
          ? Number(algoClient.lotMultiplier)
          : 1; // Default to 1 if algoClient is not found
      });
      
      setLotValues(initialLotValues);
    };
  
    // Initialize lot values when clientList or algoClientList changes
    if (clientList.length > 0) {
      initializeLotValues();
    }
  }, [clientList, algoClientList, statusToggle, id]);
  
  const handleClientDetails = async (clientId, algoClientId, clientName) => {
    setLoading(true);
    setClientName(clientName);
    try {
      // Fetch client positions
      try {
        const positionResponse = await dispatch(
          fetchPositionClient(algoClientId, token)
        );
        if (
          positionResponse &&
          positionResponse.algo_clients &&
          Array.isArray(positionResponse.algo_clients)
        ) {
          setClientPosition(positionResponse.algo_clients);
        } else {
       
          setClientPosition([]);
        }
      } catch (error) {
        console.error("Error fetching client positions:", error);
        setClientPosition([]);
      }

      // Fetch client history
      try {
        const historyResponse = await dispatch(
          fetchHistoryClient(algoClientId, token)
        );

        if (historyResponse && Array.isArray(historyResponse.algo_clients)) {
          setClientHistory(historyResponse.algo_clients);
        } else {
       
          setClientHistory([]);
        }
      } catch (error) {
        console.error("Error fetching client history:", error);
        setClientHistory([]);
      }

      // Set additional client details
      setSelectedClient(clientId);
      // setClientName(clientName);
    } catch (error) {
      console.log("Error in handleClientDetails:", error);
      toast({
        title: "Error fetching client details",
        description:
          error.message || "An error occurred while fetching client details.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      // Scroll to the top of the page
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };
  // const textColor = useColorModeValue('gray.700', 'gray.300');
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.900");
  const tableHeaderBg = useColorModeValue("blue.600", "blue.700");
  const hoverBgColor = useColorModeValue("blue.50", "blue.600");
  const selectedRowBgColor = useColorModeValue("blue.100", "blue.800"); // Highlight color for selected row
  // const borderColor = useColorModeValue('gray.300', 'gray.600');

  // Create a map for quick lookup of algo clients by client ID
  const algoClientMap = new Map(
    algoClientList.map((algoClient) => [algoClient.clientId, algoClient])
  );

 
 
  const filteredClientList = clientList.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.centrumClientId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClientList.slice(
    indexOfFirstClient,
    indexOfLastClient
  );
  const totalPages = Math.ceil(filteredClientList.length / clientsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  const renderPaginationButtons = () => {
    const buttons = [];

    // Always show the first page
    buttons.push(
      <Button
        key={1}
        onClick={() => handlePageChange(1)}
        variant={currentPage === 1 ? "solid" : "outline"}
        colorScheme="blue"
      >
        1
      </Button>
    );

    // Show ellipsis if there is a gap between the first page and the pages around the current page
    if (currentPage > 4) {
      buttons.push(
        <Text key="ellipsis-1" px={2}>
          ...
        </Text>
      );
    }

    // Adjusted to show only 3 buttons in the middle
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          variant={currentPage === i ? "solid" : "outline"}
          colorScheme="blue"
        >
          {i}
        </Button>
      );
    }

    // Show ellipsis if there is a gap between the last page and the pages around the current page
    if (currentPage < totalPages - 3) {
      buttons.push(
        <Text key="ellipsis-2" px={2}>
          ...
        </Text>
      );
    }

    // Always show the last page
    buttons.push(
      <Button
        key={totalPages}
        onClick={() => handlePageChange(totalPages)}
        variant={currentPage === totalPages ? "solid" : "outline"}
        colorScheme="blue"
      >
        {totalPages}
      </Button>
    );

    return buttons;
  };

  const ButtonBgGradient = useColorModeValue(
    `linear(to-l, ${colors.secondary}, ${colors.darkBlue})`, // Light mode gradient
    `linear(to-r, ${colors.darkBlue}, ${colors.black})` // Dark mode gradient
  );

  const ButtonHoverBgGradient = useColorModeValue(
    `linear(to-r, ${colors.secondary}, ${colors.darkGray})`, // Light mode hover gradient
    `linear(to-r, ${colors.black}, ${colors.darkBlue})` // Dark mode hover gradient
  );

  const textColor = useColorModeValue(colors.darkGray, colors.white);
  const borderColor = useColorModeValue(colors.primary, colors.mediumGray);

  const handleLotChange = (clientId, newLotValue) => {
    // Allow typing by updating the state correctly
 
    setLotValues((prevValues) => ({
      ...prevValues,
      [clientId]: newLotValue, // Ensure it updates as a string during typing
    }));
  };

  // Handle adding a client

  const handleAddClient = async (clientId) => {
    const lot = lotValues[clientId];
    const postAlgoClient = {
      algo_id: id,
      client_id: clientId,
      lot_multiplier: lot,
    };
 

    if (lot >= 1 && lot <= 100) {
      try {
        const res = await dispatch(addAlgoClient(postAlgoClient, token));

        if (res.status === "success") {

          
          toast({
            title: "Client Added",
            description:
              "The client has been successfully added to the algorithm.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          setTimeout(()=>{setStatusToggle((prev) => !prev)},2000)
        } else if (res.status === "error") {
          toast({
            title: "Addition Failed",
            description:
              "There was an error adding the client. Please try again.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        } else if (res.message === "nothing to change") {
          toast({
            title: "No Changes",
            description: "There were no changes to update.",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error(error, "Error in handleAddClient:");
        toast({
          title: "Addition Failed",
          description:
            "An error occurred while adding the client. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Invalid LOT Value",
        description: "LOT value must be between 1 and 100.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Create a Set for efficient lookup of clientId in algoClientList
  const algoClientSet = new Set(
    algoClientList.map((algoClient) => algoClient.clientId)
  );

  // Optimized function to handle adding all clients
  const handleAddAllClients = () => {
    const clientsToAdd = clientList.filter(
      (client) => !algoClientSet.has(client._id)
    );

    // Only send the request for clients not already in algoClientList
    clientsToAdd.forEach((client) => handleAddClient(client._id));
  };

  const handleUpdateClientStatus = async ({ _id, isActive, clientId }) => {

    // Determine the status string based on isActive
    const status = isActive ? "False" : "True";

    // Prepare the data to be sent for updating the client status
    const updateState = {
      alog_client_id: _id,
      client_status: status,
    };

    try {
      // If the client is being activated, also update the lot multiplier
      if (status === "True") {
        const lot = lotValues[clientId];
        const changeLotMultiplier = {
          alog_client_id: _id,
          lot_multiplier: Number(lot),
        };

    
        const lotResponse = await dispatch(
          updateLotMultiplier(changeLotMultiplier, token)
        );


        // Check if the lot multiplier update was successful
        if (lotResponse.status === "success") {
        } else {
       
          toast({
            title: "Update Failed",
            description: lotResponse.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          return; // Stop execution if lot multiplier update fails
        }
      }

      // Proceed with updating the client status
      const clientStatusResponse = await dispatch(
        UpdateClientStatus(updateState, token)
      );

      // Handle response for client status update
      if (clientStatusResponse.status === "success") {
        setStatusToggle((prev) => !prev); // Toggle status for reactivity
        toast({
          title: "Status Updated",
          description: "The client's status has been successfully updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else if (clientStatusResponse.status === "error") {
        toast({
          title: "Update Failed",
          description:
            "There was an error updating the client's status. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else if (clientStatusResponse.message === "nothing to change") {
        toast({
          title: "No Changes",
          description: "There were no changes to update.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(
        "Error in updating client status or lot multiplier:",
        error
      );
      toast({
        title: "Update Failed",
        description:
          "An error occurred while updating the client's status or lot multiplier. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box minH="100vh" bg={bgColor} pt="78px" ref={topRef}>
      <Navbar />

      <Flex direction={{ base: "column", md: "row" }} p={4} gap={4}>
        {/* Sidebar: Client List */}

        <Box
          w={{ base: "100%", md: "40%" }}
          p={4}
          bg={cardBg}
          borderRight={{ base: "none", md: `1px solid ${borderColor}` }}
          borderRadius="md"
          overflowY="auto"
          boxShadow="md"
        >
          {/* Back Button */}
          {/* <Flex mb={4} align="center">
        <IconButton
          icon={<IoArrowBackCircle size="24px" />}
          onClick={() => navigate("/dashboard")} // Navigate back to dashboard
          variant="ghost"
          aria-label="Back to Dashboard"
        />
      </Flex> */}
          <Flex mb={4} align="center" justify="space-between">
            <IconButton
              bgGradient={ButtonBgGradient}
              color={"white"}
              _hover={{ bgGradient: ButtonHoverBgGradient }}
              icon={<IoArrowBackCircle size="24px" />}
              onClick={() => navigate("/dashboard")} // Navigate back to dashboard
              variant="ghost"
              aria-label="Back to Dashboard"
            />
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              Client List
            </Text>
            <Flex align="center" gap={2}>
              <FormControl width="auto">
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={
                      <FaSearch
                        color={useColorModeValue("gray.500", "gray.300")}
                      />
                    }
                  />
                  <Input
                    id="search"
                    type="text"
                    placeholder="Search clients"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    borderColor={borderColor}
                    _focus={{ borderColor: "blue.400" }}
                    bg={useColorModeValue("white", "gray.600")}
                    borderRadius="full"
                  />
                </InputGroup>
              </FormControl>
              <Button
                size="sm"
                variant="outline"
                isDisabled={algorithmStatus}
                bgGradient={ButtonBgGradient}
                _hover={{ bgGradient: ButtonHoverBgGradient }}
                color="white"
                onClick={() => handleAddAllClients()} // Implement this function to handle adding all clients
              >
                Add All
              </Button>
            </Flex>
          </Flex>

          <Box overflowX="auto">
            <Table>
              <Thead bg={tableHeaderBg}>
                <Tr>
                  <Th color="white" p={4}>
                    #
                  </Th>
                  <Th color="white" p={4}>
                    Name
                  </Th>
                  <Th color="white" p={4}>
                    Client ID
                  </Th>
                  <Th color="white" p={4}>
                    LOT
                  </Th>
                  <Th color="white" p={4}>
                    Strategy
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentClients.map((client, index) => {
                  const algoClient = algoClientMap.get(client._id);
                  const isClientInAlgo = !!algoClient;
                  const isActive = algoClient?.isActive || false;
                  const lotMultiplier = algoClient?.lotMultiplier || "";

                  return (
                    <Tr
                      key={client._id}
                      _hover={{ bg: hoverBgColor, cursor: "pointer" }}
                      bg={
                        selectedClient === client._id
                          ? selectedRowBgColor
                          : "transparent"
                      }
                      transition="background-color 0.3s"
                    >
                      <Td
                        p={4}
                        onClick={() =>
                          handleClientDetails(
                            client._id,
                            algoClient._id,
                            client.name
                          )
                        }
                      >
                        {indexOfFirstClient + index + 1}
                      </Td>
                      <Td
                        p={4}
                        onClick={() =>
                          handleClientDetails(
                            client._id,
                            algoClient._id,
                            client.name
                          )
                        }
                      >
                        {client.name}
                      </Td>
                      <Td
                        p={4}
                        onClick={() =>
                          handleClientDetails(
                            client._id,
                            algoClient._id,
                            client.name
                          )
                        }
                      >
                        {client.centrumClientId}
                      </Td>
                      <Td p={4}>
                        {/* {isClientInAlgo? */}
                        <Input
                          id={`lot-${client._id}`}
                          type="number"
                          value={
                            lotValues[client._id] !== undefined
                              ? lotValues[client._id]
                              : lotMultiplier
                          }
                          onChange={(e) =>
                            handleLotChange(client._id, e.target.value)
                          }
                          min={1}
                          max={100}
                          placeholder="Enter lot number"
                          size="sm"
                          borderColor={borderColor}
                          _focus={{ borderColor: "blue.400" }}
                          isReadOnly={algorithmStatus || isActive} // Disable input if algorithmStatus is true
                          step="1"
                        />
                        {/* :  
                <Input
                id={`lot-${client._id}`}
                type="number"
                value={
                  lotValues[client._id] !== undefined
                    ? lotValues[client._id]
                    : lotMultiplier
                }
                onChange={(e) =>
                  handleLotChange(client._id, e.target.value)
                }
                min={1}
                max={100}
                placeholder="Enter lot number"
                size="sm"
                borderColor={borderColor}
                _focus={{ borderColor: "blue.400" }}
                isReadOnly={algorithmStatus || isActive} // Disable input if algorithmStatus is true
                step="1"
              />
                } */}
                      </Td>
                      <Td p={4}>
                        {isClientInAlgo ? (
                          <Switch
                            size="sm"
                            colorScheme="green"
                            isChecked={isActive}
                            onChange={() =>
                              handleUpdateClientStatus(algoClient)
                            }
                            isDisabled={algorithmStatus} // Disable switch if algorithmStatus is true
                          />
                        ) : (
                          <Button
                            size="sm"
                            color={"white"}
                            isDisabled={algorithmStatus}
                            bgGradient={ButtonBgGradient}
                            _hover={{ bgGradient: ButtonHoverBgGradient }}
                            onClick={() => handleAddClient(client._id)}
                          >
                            <Icon as={FaUserPlus} />
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
          <Flex mt={4} justify="center">
          {currentPage > 1?(
  <Stack spacing={2} direction="row" align="center">
  <Button
    onClick={() => handlePageChange(currentPage - 1)}
    isDisabled={currentPage === 1}
    bgGradient={ButtonBgGradient}
    _hover={{ bgGradient: ButtonHoverBgGradient }}
    color={currentPage === 1 ? "black" : "white"}
    // colorScheme="blue"
  >
    Previous
  </Button>
  {renderPaginationButtons()}{" "}
  {/* Ensure this function is correctly implemented */}
  <Button
    onClick={() => handlePageChange(currentPage + 1)}
    isDisabled={currentPage === totalPages}
    bgGradient={ButtonBgGradient}
    _hover={{ bgGradient: ButtonHoverBgGradient }}
    color={currentPage === totalPages ? "black" : "white"}
  >
    Next
  </Button>
</Stack>

          ):""}
          
          </Flex>
        </Box>

        {/* Right Side: Client Details */}
        <Box
          w={{ base: "100%", md: "60%" }}
          p={6} // Increased padding for better spacing
          bg={cardBg}
          borderRight={{ base: "none", md: `1px solid ${borderColor}` }}
          borderRadius="lg" // More rounded corners for modern look
          boxShadow="lg" // Slightly larger shadow for emphasis
        >
          <VStack align="start" spacing={6}>
            {" "}
            {/* Increased spacing between elements */}
            {loading ? (
              <Spinner size="lg" />
            ) : clientPosition ? (
              <>
                <Box mb={4} w="100%">
                  {" "}
                  {/* Add margin for better spacing */}
                  <Text
                    textAlign={"left"}
                    fontSize="3xl" // Larger font for client name
                    fontWeight="bold"
                    color={textColor}
                  >
                    {clientName}
                  </Text>
                  <HStack mt={3} spacing={3} align="center">
                    <Icon as={FaChartBar} boxSize={5} />{" "}
                    {/* Adjusted box size for better alignment */}
                    <Text
                      fontSize="xl"
                      fontWeight="medium"
                      color={textColor}
                      opacity={0.8}
                      lineHeight="1" // Ensure the text stays centered vertically
                    >
                      {algoName}
                    </Text>
                  </HStack>
                </Box>
                <Box w="100%">
                  {" "}
                  {/* Keep content full width */}
                  <ClientPosition
                    clientPosition={clientPosition}
                    clientName={clientName}
                    textColor={textColor}
                  />
                </Box>
                <Divider borderColor={borderColor} my={4} />{" "}
                {/* Divider for clear sections */}
                <Box w="100%">
                  <ClientHistory
                    clientHistory={clientHistory}
                    textColor={textColor}
                  />
                </Box>
              </>
            ) : (
              <Text fontSize="lg" color={textColor}>
                Select a client to view details
              </Text>
            )}
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}
