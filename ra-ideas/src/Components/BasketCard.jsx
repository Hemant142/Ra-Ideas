import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Badge,
  Box,
  Flex,
  Icon,
  useColorModeValue,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import {
  FaTag,
  FaCalendarAlt,
  FaInfoCircle,
  FaDollarSign,
} from "react-icons/fa";

// Format dates for display
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Shorten description
const getShortDescription = (description, maxLength = 20) => {
  return description.length > maxLength
    ? `${description.slice(0, maxLength)}...`
    : description;
};

export default function BasketCard({ basket, getStatusStyles }) {
  // Color modes
  const cardBg = useColorModeValue("white", "#1a202c");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const headingColor = useColorModeValue("#2c5282", "#63b3ed");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const labelColor = useColorModeValue("gray.500", "gray.400");

  // Styling
  const cardStyle = {
    borderRadius: "xl",
    boxShadow: "2xl",
    bg: cardBg,
    borderColor,
    borderWidth: "2px",
    p: 4,
    maxWidth: "100%",
    transition: "all 0.3s ease",
    _hover: {
      transform: "translateY(-5px)",
      boxShadow: "dark-lg",
    },
  };

  const sectionStyle = {
    bg: useColorModeValue("gray.50", "gray.700"),
    borderRadius: "lg",
    p: 4,
    mt: 4,
    boxShadow: "md",
  };

  const iconSize = "20px";

  return (
    <Link to={`/basket-details/${basket._id}`}>
      <Card {...cardStyle}>
        {/* Header */}
        <CardHeader p={4} borderBottom="2px solid" borderColor={borderColor}>
          <Flex justifyContent="space-between" alignItems="center">
            <Heading color={headingColor} fontSize="xl" isTruncated>
              {basket.title}
            </Heading>
            <Badge
              colorScheme={getStatusStyles(basket).borderColor}
              fontSize="0.9em"
              p={2}
              borderRadius="full"
              variant="solid"
            >
              {basket.rahStatus}
            </Badge>
          </Flex>
        </CardHeader>

        <CardBody p={4}>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {/* Description Section */}
            <Box {...sectionStyle}>
              <Flex alignItems="center" mb={2}>
                <Icon as={FaInfoCircle} color="blue.400" boxSize={iconSize} />
                <Text fontSize="lg" fontWeight="bold" ml={2}>
                  Description
                </Text>
              </Flex>
              <Text fontSize="sm" color={textColor}>
                {getShortDescription(basket.description)}
              </Text>
            </Box>

            {/* Risk Level Section */}
            <Box {...sectionStyle}>
              <Flex alignItems="center" mb={2}>
                <Icon as={FaTag} color="green.400" boxSize={iconSize} />
                <Text fontSize="lg" fontWeight="bold" ml={2}>
                  Risk Level
                </Text>
              </Flex>
              <Text fontSize="sm" color={textColor}>
                {basket.riskLevel}
              </Text>
            </Box>

            {/* Idea Type Section */}
            <Box {...sectionStyle}>
              <Flex alignItems="center" mb={2}>
                <Icon as={FaTag} color="purple.400" boxSize={iconSize} />
                <Text fontSize="lg" fontWeight="bold" ml={2}>
                  Idea Type
                </Text>
              </Flex>
              <Text fontSize="sm" color={textColor}>
                {basket.ideaType.join(", ")}
              </Text>
            </Box>

            {/* Dates Section */}
            <Box {...sectionStyle}>
              <Flex alignItems="center" mb={2}>
                <Icon as={FaCalendarAlt} color="orange.400" boxSize={iconSize} />
                <Text fontSize="lg" fontWeight="bold" ml={2}>
                  Dates
                </Text>
              </Flex>
              <Text fontSize="sm" color={textColor}>
                <strong>Start Date:</strong> {formatDate(basket.startDate)}
              </Text>
              <Text fontSize="sm" color={textColor} mt={2}>
                <strong>Expiry Date:</strong> {formatDate(basket.expiryDate)}
              </Text>
            </Box>
          </Grid>

          {/* Cash Section */}
          {/* {basket.dataTypes?.cash?.length > 0 && (
            <Box {...sectionStyle}>
              <Heading fontSize="lg" color={headingColor} mb={3}>
                <Icon as={FaDollarSign} boxSize={iconSize} mr={2} /> Cash Details
              </Heading>
              {basket.dataTypes.cash.map((cash, index) => (
                <Box key={index} borderWidth="1px" borderRadius="md" p={3} mt={2}>
                  <Grid templateColumns="repeat(2, 1fr)" gap={4} fontSize="sm">
                    <GridItem colSpan={2}>
                      <Text fontWeight="bold" fontSize="md" color={textColor}>
                        {cash.name}
                      </Text>
                    </GridItem>

                    <GridItem>
                      <Text color={labelColor} fontWeight="semibold">
                        Quantity
                      </Text>
                    </GridItem>
                    <GridItem>
                      <Text color={textColor} fontWeight="medium">
                        {cash.quantity}
                      </Text>
                    </GridItem>

                    <GridItem>
                      <Text color={labelColor} fontWeight="semibold">
                        High Range
                      </Text>
                    </GridItem>
                    <GridItem>
                      <Text color={textColor} fontWeight="medium">
                        {cash.enterHighRange}
                      </Text>
                    </GridItem>

                    <GridItem>
                      <Text color={labelColor} fontWeight="semibold">
                        Low Range
                      </Text>
                    </GridItem>
                    <GridItem>
                      <Text color={textColor} fontWeight="medium">
                        {cash.enterLowRange}
                      </Text>
                    </GridItem>

                    <GridItem>
                      <Text color={labelColor} fontWeight="semibold">
                        Stop Loss
                      </Text>
                    </GridItem>
                    <GridItem>
                      <Text color={textColor} fontWeight="medium">
                        {cash.stopLoss}
                      </Text>
                    </GridItem>

                   
                    <GridItem colSpan={2}>
                      <Text fontWeight="bold" color={textColor}>
                        Take Profits:
                      </Text>
                    </GridItem>
                    {cash.takeProfits.map((tp, tpIndex) => (
                      <React.Fragment key={tpIndex}>
                        <GridItem>
                          <Text color={labelColor} fontWeight="semibold">
                            TP {tpIndex + 1}
                          </Text>
                        </GridItem>
                        <GridItem>
                          <Text color={textColor} fontWeight="medium">
                            {tp.takeProfit}, Qty: {tp.takeProfitQuantity}
                          </Text>
                        </GridItem>
                      </React.Fragment>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Box>
          )} */}
        </CardBody>
      </Card>
    </Link>
  );
}
