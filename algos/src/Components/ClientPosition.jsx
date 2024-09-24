import {
    Box,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
    Icon,
    useColorModeValue,
    HStack,
    Badge,
    Tooltip,
    Center
  } from "@chakra-ui/react";
  import { FaArrowUp, FaArrowDown, FaExclamationCircle } from "react-icons/fa";
import { MdAutoGraph } from "react-icons/md";
  
  const ClientPosition = ({ clientPosition, clientName }) => {
    // Define color values outside of conditional logic
    const tableBg = useColorModeValue("white", "gray.800");
    const cardBg = useColorModeValue("gray.50", "gray.900");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const textColor = useColorModeValue("gray.800", "gray.200");
    const textBuy = useColorModeValue("green.800", "green.200");
    const priceColor = "green.400"; // Set price color to green
  
    // Define hover background outside the callback
    const hoverBg = useColorModeValue("gray.100", "gray.700");
  
    // Ensure clientPosition is valid and positions is an array
    if (
      !clientPosition ||
      !Array.isArray(clientPosition) ||
      clientPosition.length === 0
    ) {
      return (
        <VStack
          align="center"
          spacing={4}
          w="100%"
          bg={cardBg}
          p={6}
          borderRadius="md"
          border="1px solid"
          borderColor={borderColor}
          shadow="md"
          textAlign="center"
        >
            {/* <Box  width={"100%"} textAlign={"left"}>
             <Text fontSize="2xl" fontWeight="bold" color={textColor}  >
          {clientName || "Client Name"}
        </Text>
        </Box> */}
          <Icon as={FaExclamationCircle} boxSize="40px" color="red.500" />
          <Text fontSize="lg" fontWeight="bold" color={textColor}>
            No client position data available.
          </Text>
          <Text color={textColor}>
            It looks like there's no data available for this client at the moment.
          </Text>
        </VStack>
      );
    }
  
    return (
      <VStack
        align="start"
        spacing={4}
        w="100%"
        bg={cardBg}
        p={6}
        borderRadius="md"
        border="1px solid"
        borderColor={borderColor}
        shadow="md"
      >
        {/* Display client name */}
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
        <Icon as={MdAutoGraph} boxSize="25px" mr={2} color={textColor} />
           Position
        </Text>
  
        {/* Display client positions in table format */}
        <Box w="100%" overflowX="auto">
          <Table variant="simple" bg={tableBg} size="md" borderRadius="md">
            <Thead>
              <Tr>
                <Th color={textColor} fontSize="md" fontWeight="semibold">
                  Instrument
                </Th>
                <Th color={textColor} fontSize="md" fontWeight="semibold">
                  Price
                </Th>
                <Th color={textColor} fontSize="md" fontWeight="semibold">
                  Quantity
                </Th>
                <Th color={textColor} fontSize="md" fontWeight="semibold">
                  Transaction
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {clientPosition.map((position) => (
                <Tr key={position._id} _hover={{ bg: hoverBg }}>
                  <Td color={textColor} fontWeight="medium">
                    {position.instrument || "N/A"}
                  </Td>
                  <Td color={priceColor} fontWeight="bold">
                    {position.instrumentPrice != null
                      ? `₹${position.instrumentPrice.toFixed(2)}`
                      : "N/A"}
                  </Td>
                  <Td color={textColor}>
                    {position.instrumentQuantity != null
                      ? position.instrumentQuantity
                      : "N/A"}
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      {position.transationType === "BUY" ? (
                        <Tooltip label="Buy" aria-label="Buy Tooltip">
                          <Badge colorScheme="green" p={2} borderRadius="md">
                            <HStack spacing={1}>
                              <Icon as={FaArrowUp} color="green.500" />
                              <Text color={textBuy} fontWeight="semibold">
                                Buy
                              </Text>
                            </HStack>
                          </Badge>
                        </Tooltip>
                      ) : position.transationType === "SELL" ? (
                        <Tooltip label="Sell" aria-label="Sell Tooltip">
                          <Badge colorScheme="red" p={2} borderRadius="md">
                            <HStack spacing={1}>
                              <Icon as={FaArrowDown} color="red.500" />
                              <Text color={textColor} fontWeight="semibold">
                                Sell
                              </Text>
                            </HStack>
                          </Badge>
                        </Tooltip>
                      ) : (
                        <Text color={textColor}>N/A</Text>
                      )}
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    );
  };
  
  export default ClientPosition;
  