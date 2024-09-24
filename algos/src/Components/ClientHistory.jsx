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
    useColorModeValue,
    HStack,
    Icon,
    Badge,
    Tooltip,
  } from "@chakra-ui/react";
import {
    FaArrowUp,
    FaArrowDown,
    FaHistory,
} from "react-icons/fa";

const ClientHistory = ({ clientHistory, textColor }) => {
    // Define color values outside of conditional logic
    const tableBg = useColorModeValue("white", "gray.800");
    const cardBg = useColorModeValue("gray.50", "gray.900");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const hoverBg = useColorModeValue("gray.100", "gray.700");
    const priceColor = useColorModeValue("green.500", "green.300");
    const textBuy = useColorModeValue("green.800", "green.200");

    // Helper function to format date
    const formatDate = (dateString) => {
        return dateString
            ? new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }).format(new Date(dateString))
            : "N/A";
    };

    // Ensure clientHistory is valid and is an array
    if (
        !clientHistory ||
        !Array.isArray(clientHistory) ||
        clientHistory.length === 0
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
                <Icon as={FaHistory} boxSize="36px" color="red.500" />
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                    No client history available.
                </Text>
                <Text color={textColor}>
                    It looks like there's no history data available for this client at the moment.
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
            <Text fontSize="xl" fontWeight="bold" color={textColor}>
                <Icon as={FaHistory} boxSize="20px" mr={2} color={textColor} />
                Client History
            </Text>

            {/* Display client history in table format */}
            <Box w="100%" overflowX="auto">
                <Table variant="simple" bg={tableBg} size="sm" borderRadius="md">
                    <Thead>
                        <Tr>
                            <Th color={textColor} fontSize="sm" fontWeight="semibold" minWidth="150px">
                                Date
                            </Th>
                            <Th color={textColor} fontSize="sm" fontWeight="semibold">
                                Instrument
                            </Th>
                            <Th color={textColor} fontSize="sm" fontWeight="semibold">
                                Price
                            </Th>
                            <Th color={textColor} fontSize="sm" fontWeight="semibold">
                                Qty
                            </Th>
                            <Th color={textColor} fontSize="sm" fontWeight="semibold">
                                Order Type
                            </Th>
                            <Th color={textColor} fontSize="sm" fontWeight="semibold">
                                Transaction
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {clientHistory.map((history) => (
                            <Tr key={history._id} _hover={{ bg: hoverBg }}>
                                <Td color={textColor} minWidth="150px" fontSize="sm" whiteSpace="nowrap">
                                    {formatDate(history.date)}
                                </Td>
                                <Td color={textColor} fontSize="sm">
                                    {history.instrument || "N/A"}
                                </Td>
                                <Td color={priceColor} fontWeight="bold" fontSize="sm">
                                    {history.instrumentPrice != null
                                        ? `₹${history.instrumentPrice.toFixed(2)}`
                                        : "N/A"}
                                </Td>
                                <Td color={textColor} fontSize="sm">
                                    {history.instrumentQuantity != null
                                        ? history.instrumentQuantity
                                        : "N/A"}
                                </Td>
                                <Td color={textColor} fontSize="sm">
                                    {history.orderType === "ENTRY" ? (
                                        <Badge colorScheme="blue" p={1} borderRadius="md">
                                            {history.orderType}
                                        </Badge>
                                    ) : (
                                        <Badge colorScheme="orange" p={1} borderRadius="md">
                                            {history.orderType}
                                        </Badge>
                                    )}
                                </Td>
                                <Td fontSize="sm">
                                    <HStack spacing={1} align="center">
                                        {history.transationType === "BUY" ? (
                                            <Tooltip label="Buy" aria-label="Buy Tooltip">
                                                <Badge colorScheme="green" p={1} borderRadius="md">
                                                    <HStack spacing={1} align="center">
                                                        <Icon as={FaArrowUp} color="green.500" boxSize="12px" />
                                                        <Text color={textBuy} fontWeight="semibold">
                                                            Buy
                                                        </Text>
                                                    </HStack>
                                                </Badge>
                                            </Tooltip>
                                        ) : history.transationType === "SELL" ? (
                                            <Tooltip label="Sell" aria-label="Sell Tooltip">
                                                <Badge colorScheme="red" p={1} borderRadius="md">
                                                    <HStack spacing={1} align="center">
                                                        <Icon as={FaArrowDown} color="red.500" boxSize="12px" />
                                                        <Text color={textColor} fontWeight="semibold">
                                                            Sell
                                                        </Text>
                                                    </HStack>
                                                </Badge>
                                            </Tooltip>
                                        ) : (
                                            <Text color={textColor}>
                                                N/A
                                            </Text>
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

export default ClientHistory;
