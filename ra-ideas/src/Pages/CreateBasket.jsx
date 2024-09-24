import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Input,
  List,
  ListItem,
  InputGroup,
  InputRightElement,
  Text,
  Textarea,
  Select,
  RadioGroup,
  Stack,
  Radio,
  useToast,
  Flex,
  IconButton,
  InputLeftElement,
  Icon,
  Checkbox,
  CheckboxGroup,
  Grid,
} from "@chakra-ui/react";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";
import { MdArrowDropDown } from "react-icons/md";
import axios from "axios";
import Cookies from "js-cookie";
import {
  FormControl,
  FormLabel,
  Heading,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Navbar from "../Components/Navbar";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { fetchOptionFuture, fetchSymbols } from "../Redux/symbolReducer/action";
import { useDispatch, useSelector } from "react-redux";
import { postBasketData } from "../Redux/basketReducer/action";
import { FiClock } from "react-icons/fi";
import { FiCalendar } from "react-icons/fi";
import { format } from "date-fns";
export default function CreateBasket() {
  const location = useLocation();
  const dispatch = useDispatch();
  const data = useSelector((store) => store.symbolsReducer.symbols);
  const future = useSelector((store) => store.symbolsReducer.future);
  const options = useSelector((store) => store.symbolsReducer.options);
  let token = Cookies.get("login_token_ra");

  const initialData = {
    basket_name: "",
    basket_description: "",

    start_date: "",
    expiry_date: "",
    fund_required: "",
    annual_returns: "",
    cagr: "",
    success_rate: "",
    average_rate: "",
    symbols_info: [
      {
        name: "",
        symbol: "",
        quantile:"",
        quantity: "",
        enterHighRange: "",
        enterLowRange: "",
        stopLoss: "",
        takeProfits: [],
      },
    ],
    future_info: [
      {
        name: "",
        expiryDate: "",
        quantile:"",
        longShort: "",
        lot: "",
        enterHighRange: "",
        enterLowRange: "",
        stopLoss: "",
        takeProfits: [],
      },
    ],
    options_info: [
      {
        name: "",
        expiryDate: "",
        quantile:"",
        strike: "",
        longShort: "",
        lot: "",
        optionType: "",
        enterHighRange: "",
        enterLowRange: "",
        stopLoss: "",
        takeProfits: [],
      },
    ],
  };

  const [basketData, setBasketData] = useState(initialData);
  const [numRows, setNumRows] = useState(initialData.symbols_info.length);
  const [futureRows, setFutureRows] = useState(initialData.future_info.length);
  const [optionsRows, setOptionsRows] = useState(
    initialData.options_info.length
  );
  const [tableRows, setTableRows] = useState(initialData.symbols_info);
  const [futureTableRows, setFutureTableRows] = useState(
    initialData.future_info
  );
  const [optionsTableRows, setOptionsTableRows] = useState(
    initialData.options_info
  );
  const [isLoading, setIsLoading] = useState(false);
  const [riskLevel, setriskLevel] = useState("");
  // const [ideaType, setIdeaType] = useState("");
  const [ideaType, setIdeaType] = useState([]);

  const [symbols, setSymbols] = useState([]);
  const [futureSymbol, setFutureSymbol] = useState([]);
  const [optionSymbol, setOptionSymbol] = useState([]);

  const [wait, setWait] = useState(false);
  const [index, setIndex] = useState(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownRefs = useRef([]);

  const [searchTerms, setSearchTerms] = useState([]);
  const [showOptions, setShowOptions] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const userName = Cookies.get("username_ra");
  const currentDate = new Date().toISOString().split("T")[0];
  const currentDateTime = new Date().toISOString().slice(0, 16);
  const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 5))
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    dispatch(fetchSymbols());
    dispatch(fetchOptionFuture());
  }, []);

  useEffect(() => {
    setSymbols(data);
    setFutureSymbol(future);
    setOptionSymbol(options);
  }, [data, future, options]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      dropdownRefs.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target)) {
          const newShowOptions = [...showOptions];
          newShowOptions[index] = false;
          setShowOptions(newShowOptions);
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

  const handleSelectChange = (index, value) => {
    const selectedSymbol = symbols.find((symbol) => symbol.symbol === value);
    if (selectedSymbol) {
      setTableRows((prevRows) => {
        const updatedRows = [...prevRows];
        updatedRows[index] = {
          ...updatedRows[index], // Keep other fields unchanged
          name: selectedSymbol.name, // Update only `name`
          symbol: selectedSymbol.symbol, // Update only `symbol`
        };
        return updatedRows;
      });

      const newShowOptions = [...showOptions];
      newShowOptions[index] = false;
      setShowOptions(newShowOptions);
    }
  };

  const handleSearchChange = (index, value) => {
    setIndex(index);

    const newSearchTerms = [...searchTerms];
    newSearchTerms[index] = value;
    setSearchTerms(newSearchTerms);

    const newShowOptions = new Array(tableRows.length).fill(false); // Close all dropdowns
    newShowOptions[index] = true; // Open only the current dropdown

    setShowOptions(newShowOptions);
  };

  const filteredSymbols = symbols.filter((item) => {
    const searchTerm = searchTerms[index] || "";

    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
  });



  const handleInputChange = (e) => {
    setBasketData({
      ...basketData,
      [e.target.name]: e.target.value,
    });
  };

 

  const addNumRow = () => {
    const newRow = {
      name: "",
      symbol: "",
      quantile:"",
      quantity: "",
      enterHighRange: "",
      enterLowRange: "",
      stopLoss: "",
      takeProfits: [],
    };
    setTableRows([...tableRows, newRow]);
  };

  const addNumRowTakeProfit = (index) => {
    const newTakeProfit = {
      takeProfit: "",
      takeProfitQuantity: "",
    };

    // Update the takeProfits array for the correct row
    const updatedRows = [...tableRows];
    updatedRows[index].takeProfits = [
      ...updatedRows[index].takeProfits,
      newTakeProfit,
    ];

    setTableRows(updatedRows);
  };

  const handleNumRowTakeProfitChange = (
    rowIndex,
    profitIndex,
    field,
    value
  ) => {
    const updatedRows = [...tableRows];
    updatedRows[rowIndex].takeProfits[profitIndex][field] = value;
    setTableRows(updatedRows);
  };

  const addFutureTakeProfit = (index) => {
    const newTakeProfit = {
      takeProfit: "",
      takeProfitLot: "",
    };

    const updatedRows = [...futureTableRows];
    updatedRows[index].takeProfits = [
      ...updatedRows[index].takeProfits,
      newTakeProfit,
    ];

    setFutureTableRows(updatedRows);
  };

  const handleFutureTakeProfitChange = (
    rowIndex,
    profitIndex,
    field,
    value
  ) => {
    const updatedRows = [...futureTableRows];
    updatedRows[rowIndex].takeProfits[profitIndex][field] = value;
    setFutureTableRows(updatedRows);
  };

  const addOptionsTakeProfit = (index) => {
    const newTakeProfit = {
      takeProfit: "",
      takeProfitLot: "",
    };

    const updatedRows = [...optionsTableRows];
    updatedRows[index].takeProfits = [
      ...updatedRows[index].takeProfits,
      newTakeProfit,
    ];

    setOptionsTableRows(updatedRows);
  };

  const handleOptionsTakeProfitChange = (
    rowIndex,
    profitIndex,
    field,
    value
  ) => {
    const updatedRows = [...optionsTableRows];
    updatedRows[rowIndex].takeProfits[profitIndex][field] = value;
    setOptionsTableRows(updatedRows);
  };

  const handleFutureRowsChange = (e) => {
    const value = parseInt(e.target.value);
    setFutureRows(value);
  };

  const handleOptionRowsChange = (e) => {
    const value = parseInt(e.target.value);
    setOptionsRows(value);
  };

  const generateRows = () => {
    const newRows = Array.from({ length: numRows }, () => ({
      name: "",
      symbol: "",
      quantity: "",
      quantile:"",
      enterHighRange: "",
      enterLowRange: "",
      stopLoss: "",
      takeProfit: "",
    }));
    setTableRows(newRows);
  };
  // const addFutureRow = () => {
  //   const newRow = {
  //     name: "",
  //     expiryDate: "",
  //     longShort: "",
  //     lot: "",
  //     enterHighRange: "",
  //     enterLowRange: "",
  //     stopLoss: "",
  //     takeProfit: "",
  //   };
  //   setFutureTableRows((prevRows) => [...prevRows, newRow]);
  // };

  // Function to delete a specific future row
  // const deleteFutureRow = (index) => {
  //   const updatedRows = futureTableRows.filter((_, idx) => idx !== index);
  //   setFutureTableRows(updatedRows);
  // };

  const generateFutureRows = () => {
    const newRows = Array.from({ length: futureRows }, () => ({
      name: "",
      expiryDate: "",
      quantile:"",
      longShort: "",
      lot: "",
      enterHighRange: "",
      enterLowRange: "",
      stopLoss: "",
      takeProfits: [],
    }));
    setFutureTableRows(newRows);
  };

  const generateOptionRows = () => {
    const newRows = Array.from({ length: optionsRows }, () => ({
      name: "",
      expiryDate: "",
      quantile:"",
      strike: "",
      longShort: "",
      lot: "",
      optionType: "",
      enterHighRange: "",
      enterLowRange: "",
      stopLoss: "",
      takeProfit: "",
    }));
    setOptionsTableRows(newRows);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const year = today.getFullYear();

    return `${year}-${month}-${day}`;
  };
  

  const generateUniqueId = () => {
    // Create a unique ID using a combination of current timestamp and random characters
    return  Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let quantityFlag = true;
    let symbolFlag = false;
    let inputfield = false;
    let startDateFlag = false;
    let endDateFlag = false;
    let correctDate = true;
    let underlineIndex = true;
    let sum = 0;
  
    // Check if expiry date is in the future
    let selectedDate = new Date(basketData.expiry_date);
    let currentDate = new Date();
    if (selectedDate < currentDate) {
      alert("You cannot select a past date.");
      correctDate = false;
      return;
    }
  
    // Calculate sum of quantities
    tableRows.forEach((row) => {
      sum += parseFloat(row.quantity); // Parse quantity as float
    });
  
    if (validateTime(basketData.start_date)) {
      startDateFlag = true;
      // Add your form submission logic here
    } else {
      alert(
        "Please select a time between 09:15 AM and 03:20 PM in Start Date."
      );
    }
  
    if (validateTime(basketData.expiry_date)) {
      endDateFlag = true;
      // Add your form submission logic here
    } else {
      alert(
        "Please select a time between 09:15 AM and 03:20 PM in Expiry Date."
      );
    }
  
    // Check if underlying index is selected
    if (!ideaType) {
      underlineIndex = false;
      alert("Please select one riskLevel option");
      return;
    }
  
    // Check for duplicate names in tableRows
    let names = new Set();
    for (let row of tableRows) {
      if (names.has(row.name)) {
        alert(`Duplicate name found: ${row.name}`);
        return; // Exit early if duplicate name is found
      } else {
        symbolFlag = true;
        names.add(row.name); // Add name to Set if not duplicate
      }
    }
  
    // Check if any table field is empty
    let isTableFieldEmpty = tableRows.filter(
      (ele) => ele.stopLoss !== "" && ele.takeProfit !== ""
    );
  
    // if (isTableFieldEmpty.length !== tableRows.length) {
    //   alert("One or more table fields are empty. Please fill them.");
    //   return;
    // }
  
    // Prepare data to send
    const dataToSend = {
      _id:generateUniqueId(),
      title: basketData.basket_name.trim(),
      description: basketData.basket_description,
      expiryDate: basketData.expiry_date,
      startDate: basketData.start_date,
      createdBy: userName,
      exchangeType: "NSE_EQ",
      dataTypes: {},
      riskLevel: riskLevel,
      ideaType: ideaType,
      isActive:true
    };
  
    // Add Cash data if Cash is selected
    if (ideaType.includes("Cash")) {
      dataToSend.dataTypes.cash = tableRows;
    }
  
    // Add Futures data if Futures is selected
    if (ideaType.includes("Futures")) {
      dataToSend.dataTypes.future = futureTableRows;
    }
  
    // Add Options data if Options is selected
    if (ideaType.includes("Options")) {
      dataToSend.dataTypes.options = optionsTableRows;
    }
  
    console.log(dataToSend,"dataToSend")
    // Retrieve existing data from local storage
    let existingData = JSON.parse(localStorage.getItem('create_Ideas')) || [];
  
    // Append new data to existing data
    existingData.push(dataToSend);
  
    // Store updated data in local storage
    localStorage.setItem('create_Ideas', JSON.stringify(existingData));
  
    // Optional: Log the updated local storage data
    console.log('Data stored in local storage:', JSON.parse(localStorage.getItem('create_Ideas')));
  
    try {
      setIsLoading(true);
  
      // Your existing data submission logic here...
  
    } catch (error) {
      console.error("Error creating basket:", error);
    } finally {
      setIsLoading(false);
    }
  };
  


  // Function to handle changes in cash table rows
 
 
  const handleNumRowsChange = (index, field, value) => {
    const updatedRows = [...tableRows];
    updatedRows[index][field] = value;
    setTableRows(updatedRows);
  };

  // Function to handle changes in future table rows
  const handleFutureRowChange = (index, key, value) => {
    const updatedRows = [...futureTableRows];
    updatedRows[index][key] = value;

    if (
      key === "stopLoss" &&
      parseFloat(value) >= parseFloat(updatedRows[index].takeProfit)
    ) {
      updatedRows[index].takeProfit = (parseFloat(value) + 1).toString();
    }

    if (
      key === "takeProfit" &&
      parseFloat(value) <= parseFloat(updatedRows[index].stopLoss)
    ) {
      updatedRows[index].stopLoss = (parseFloat(value) - 1).toString();
    }

    setFutureTableRows(updatedRows);
  };

  // Function to handle changes in options table rows
  const handleOptionsRowChange = (
    index,
    key,
    value,
    additionalKey,
    additionalValue
  ) => {
    const updatedRows = [...optionsTableRows];
    updatedRows[index][key] = value;

    if (additionalKey && additionalValue !== undefined) {
      updatedRows[index][additionalKey] = additionalValue;
    }

    if (
      key === "stopLoss" &&
      parseFloat(value) >= parseFloat(updatedRows[index].takeProfit)
    ) {
      updatedRows[index].takeProfit = (parseFloat(value) + 1).toString();
    }

    if (
      key === "takeProfit" &&
      parseFloat(value) <= parseFloat(updatedRows[index].stopLoss)
    ) {
      updatedRows[index].stopLoss = (parseFloat(value) - 1).toString();
    }

    setOptionsTableRows(updatedRows);
  };

  // Functions to add new rows for cash, future, and options
  // const addNumRow = () => {
  //   setTableRows((prevRows) => [...prevRows, {
  //     name: "",
  //     symbol: "",
  //     quantity: "",
  //     enterHighRange: "",
  //     enterLowRange: "",
  //     stopLoss: "",
  //     takeProfit: "",
  //   }]);
  // };

  const addFutureRow = () => {
    setFutureTableRows((prevRows) => [
      ...prevRows,
      {
        name: "",
        quantile:"",
        expiryDate: "",
        longShort: "",
        lot: "",
        enterHighRange: "",
        enterLowRange: "",
        stopLoss: "",
        takeProfits: [],
      },
    ]);
  };

  const addOptionsRow = () => {
    setOptionsTableRows((prevRows) => [
      ...prevRows,
      {
        name: "",
        quantile:"",
        expiryDate: "",
        strike: "",
        longShort: "",
        lot: "",
        optionType: "",
        enterHighRange: "",
        enterLowRange: "",
        stopLoss: "",
        takeProfits: [],
      },
    ]);
  };

  // Functions to delete specific rows for cash, future, and options
  const handleDeleteNumRow = (index) => {
    setTableRows((prevRows) =>
      prevRows.filter((_, rowIndex) => rowIndex !== index)
    );
  };

  const deleteFutureRow = (index) => {
    setFutureTableRows((prevRows) =>
      prevRows.filter((_, idx) => idx !== index)
    );
  };

  const deleteOptionsRow = (index) => {
    setOptionsTableRows((prevRows) => prevRows.filter((_, i) => i !== index));
  };

  // Utility functions to get expiry dates and strike prices
  const getExpiryDatesForFutureSymbol = (symbol) => {
    return [
      ...new Set(
        futureSymbol
          .filter((item) => item.sym === symbol)
          .map((item) => item.exp)
      ),
    ];
  };

  const getExpiryDatesForOptionSymbol = (symbol) => {
    return [
      ...new Set(
        optionSymbol
          .filter((item) => item.sym === symbol)
          .map((item) => item.exp)
      ),
    ];
  };

  // const getStrikeForOptionSymbol = (symbol) => {
  //   return [
  //     ...new Set(
  //       optionSymbol
  //         .filter((item) => item.sym === symbol)
  //         .map((item) => item.strike)
  //     ),
  //   ];
  // };

  const getStrikeForOptionSymbol = (symbol) => {
    let x = [
      ...new Set(
        optionSymbol
          .filter((item) => item.sym === symbol)
          .map((item) => item.strike)
      ),
    ].map((strike) => {
      // Remove exactly one trailing zero
      return strike.endsWith("0") ? strike.slice(0, -2) : strike;
    });

    return [
      ...new Set(
        optionSymbol
          .filter((item) => item.sym === symbol)
          .map((item) => item.strike)
      ),
    ].map((strike) => {
      // Remove exactly one trailing zero
      return strike.endsWith("0") ? strike.slice(0, -2) : strike;
    });
  };

  const today = new Date();

  // Set minTime to 9:15 AM and maxTime to 3:20 PM for today's date
  const minTime = new Date(basketData.start_date || today);
  minTime.setHours(9, 15, 0, 0); // 09:15 AM

  const maxTime = new Date(basketData.start_date || today);
  maxTime.setHours(15, 20, 0, 0); // 03:20 PM

  // Format the dates in yyyy-MM-dd'T'HH:mm format
  const formattedToday = format(today, "yyyy-MM-dd'T'HH:mm");
  const formattedMinTime = format(minTime, "yyyy-MM-dd'T'HH:mm");
  const formattedMaxTime = format(maxTime, "yyyy-MM-dd'T'HH:mm");

  console.log(formattedMinTime, "formattedMinTime");
  // Validate the time between 9:15 AM and 3:20 PM
  const validateTime = (selectedDateTime) => {
    const selectedDate = new Date(selectedDateTime);

    const minTime = new Date(selectedDateTime || today);
    minTime.setHours(9, 15, 0, 0); // 09:15 AM

    const maxTime = new Date(selectedDateTime || today);
    maxTime.setHours(15, 20, 0, 0);
    // Ensure the selected time is between 9:15 AM and 3:20 PM
    if (selectedDate >= minTime && selectedDate <= maxTime) {
      return true;
    } else {
      //
      return false;
    }
  };

  const handleRemoveTakeProfit = (rowIndex, profitIndex) => {
    const updatedRows = [...tableRows];
    updatedRows[rowIndex].takeProfits = updatedRows[
      rowIndex
    ].takeProfits.filter((_, index) => index !== profitIndex);
    setTableRows(updatedRows);
  };

  const handleRemoveFutureTakeProfit = (rowIndex, takeProfitIndex) => {
    const updatedRows = [...futureTableRows];
    updatedRows[rowIndex].takeProfits = updatedRows[
      rowIndex
    ].takeProfits.filter((_, index) => index !== takeProfitIndex);
    setFutureTableRows(updatedRows);
  };

  const handleRemoveOptionsTakeProfit = (rowIndex, takeProfitIndex) => {
    const updatedRows = [...optionsTableRows];
    updatedRows[rowIndex].takeProfits = updatedRows[
      rowIndex
    ].takeProfits.filter((_, index) => index !== takeProfitIndex);
    setOptionsTableRows(updatedRows);
  };

  return (
    <Box bg="gray.100" minHeight="100vh">
      <Navbar />

      {/* <Tabs variant="unstyled" mt="10px" borderBottomColor="gray.200">
        <TabList display="flex">
          <Tab
            as={Link}
            to="/dashboard"
            fontWeight="bold"
            color={location.pathname === "/dashboard" ? "#244c9c" : "gray.500"}
            borderBottom={location.pathname === "/dashboard" && "2px solid"}
            borderColor={location.pathname === "/dashboard" && "#244c9c"}
            pb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Idea List
          </Tab>
          <Tab
            as={Link}
            to="/create-basket"
            fontWeight="bold"
            color={
              location.pathname === "/create-basket" ? "#244c9c" : "gray.500"
            }
            borderBottom={location.pathname === "/create-basket" && "2px solid"}
            borderColor={location.pathname === "/create-basket" && "#244c9c"}
            pb={2}
            _hover={{ color: "#244c9c" }}
            _focus={{ outline: "none" }}
          >
            Create Idea
          </Tab>
        </TabList> */}

<Tabs
        position="relative"
        variant="soft-rounded"
        colorScheme="blue"
        isFitted
        defaultIndex={location.pathname==="/create-basket"?1:0}  //sets the inital tab based on the currect route
     
      >
        <TabList
          bg="gray.50"
          borderRadius="md"
          boxShadow="lg"
          maxW="xl"
          mx="auto"
          mt={8}
          p={4}
        >
          <Tab
           as={Link}
            to="/dashboard"
            isSelected={location.pathname==="/dashboard"}  //Highlits the Ideas tab if the route is "/dashboard"
          >Ideas</Tab>

          <Tab  as={Link}
            to="/create-basket"
            
          isSelected={location.pathname==="/create-basket"} // Highlights the Create IDea tab if the route is  "/create-basket"
            >Create Idea</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <form
              onSubmit={handleSubmit}
              style={{ width: "100%", margin: "auto" }}
            >
              <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
                <Heading size="lg" mb={6} textAlign="center" color="#244c9c">
                  Create a New Idea
                </Heading>

                <FormControl
                  mb={4}
                  p={4}
                  borderRadius="md"
                  boxShadow="lg"
                  bg="white"
                >
                  <Box
                    display="flex"
                    flexDirection={["column", "row"]}
                    gap={4}
                    alignItems="stretch"
                  >
                    {/* Left Column: Idea Name, Expiry Date, Risk Level */}
                    <Box flex="1" display="flex" flexDirection="column" gap={4}>
                      {/* Idea Name Field */}
                      <FormControl>
                        <FormLabel
                          htmlFor="basket_name"
                          fontWeight="bold"
                          fontSize="md"
                          color="#244c9c"
                        >
                          Idea Name
                        </FormLabel>
                        <Input
                          type="text"
                          id="basket_name"
                          name="basket_name"
                          maxLength={80}
                          value={basketData.basket_name}
                          onChange={handleInputChange}
                          placeholder="Name of the Idea"
                          isRequired
                          borderColor="#244c9c"
                          _placeholder={{ color: "gray.500" }}
                          _focus={{
                            borderColor: "#244c9c",
                            boxShadow: "0 0 0 1px #244c9c",
                          }}
                        />
                      </FormControl>

                      {/* Start Date Field */}
                      <FormControl>
                        <FormLabel
                          htmlFor="start_date"
                          fontWeight="bold"
                          fontSize="md"
                          color="#244c9c"
                        >
                          Start Date
                        </FormLabel>
                        <Input
                          type="datetime-local"
                          id="start_date"
                          name="start_date"
                          //  min={currentDateTime}
                          min={formattedMinTime}
                          //  max={maxDate}
                          value={basketData.start_date}
                          onChange={handleInputChange}
                          isRequired
                          borderColor="#000d28"
                          _focus={{
                            borderColor: "#244c9c",
                            boxShadow: "0 0 0 1px #244c9c",
                          }}
                        />
                      </FormControl>

                      {/* Expiry Date Field */}
                      <FormControl>
                        <FormLabel
                          htmlFor="expiry_date"
                          fontWeight="bold"
                          fontSize="md"
                          color="#244c9c"
                        >
                          Expiry Date
                        </FormLabel>
                        <Input
                          type="datetime-local"
                          id="expiry_date"
                          name="expiry_date"
                          min={currentDate}
                          max={maxDate}
                          value={basketData.expiry_date}
                          onChange={handleInputChange}
                          isRequired
                          borderColor="#244c9c"
                          _focus={{
                            borderColor: "#244c9c",
                            boxShadow: "0 0 0 1px #244c9c",
                          }}
                        />
                      </FormControl>

                      {/* Risk Level Field */}
                      <FormControl>
                        <FormLabel
                          htmlFor="risk_level"
                          fontWeight="bold"
                          fontSize="md"
                          color="#244c9c"
                        >
                          Risk Level
                        </FormLabel>
                        {/* <Select
                          required
                          value={riskLevel}
                          onChange={(e) => setriskLevel(e.target.value)}
                          placeholder="Select Risk Level"
                          borderColor="#244c9c"
                          _focus={{
                            borderColor: "#244c9c",
                            boxShadow: "0 0 0 1px #244c9c",
                          }}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </Select> */}
                        <RadioGroup
                          required
                          value={riskLevel}
                          onClick={(e) => setriskLevel(e.target.value)}
                        >
                          <Stack spacing={4} direction="row">
                            <Radio value="Low">Low</Radio>
                            <Radio value="Medium">Medium</Radio>
                            <Radio value="High">High</Radio>
                          </Stack>
                        </RadioGroup>
                      </FormControl>
                    </Box>

                    {/* Right Column: Description Field */}
                    <FormControl flex="1">
                      <FormLabel
                        htmlFor="basket_description"
                        fontWeight="bold"
                        fontSize="md"
                        color="#244c9c"
                      >
                        Description
                      </FormLabel>
                      <Textarea
                        id="basket_description"
                        name="basket_description"
                        value={basketData.basket_description}
                        onChange={handleInputChange}
                        placeholder="Description"
                        isRequired
                        borderColor="#244c9c"
                        _placeholder={{ color: "gray.500" }}
                        _focus={{
                          borderColor: "#244c9c",
                          boxShadow: "0 0 0 1px #244c9c",
                        }}
                        height="100%" // Ensures it stretches nicely next to the left column
                      />
                    </FormControl>
                  </Box>

                  {/* Select Idea Type Field */}
                  <Box mt={4}>
                    <FormControl>
                      <FormLabel
                        htmlFor="SelectIdeaType"
                        fontWeight="bold"
                        fontSize="md"
                        color="#244c9c"
                      >
                        Select Idea Type
                      </FormLabel>

                      {/* CheckboxGroup will manage an array of selected values */}
                      <CheckboxGroup value={ideaType} onChange={setIdeaType}>
                        <Stack spacing={4} direction="row">
                          <Checkbox colorScheme="red" value="Cash">
                            Cash
                          </Checkbox>
                          <Checkbox colorScheme="green" value="Futures">
                            Futures
                          </Checkbox>
                          <Checkbox colorScheme="blue" value="Options">
                            Options
                          </Checkbox>
                        </Stack>
                      </CheckboxGroup>
                    </FormControl>
                  </Box>
                </FormControl>

                {/* <====================================If Idea Type is CASH======================================>               */}

                {ideaType.includes("Cash") && (
  <FormControl
    mb={4}
    p={4}
    borderRadius="lg"
    boxShadow="md"
    bg="white"
  >
    <Heading as="h3" size="md" mb={4}>
      Cash
    </Heading>

    {tableRows.map((row, index) => (
      <Box
        key={index}
        mb={4}
        p={3}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="sm"
        bg="gray.50"
        position="relative"
      >
        {/* Row Header and Delete Button */}
        <Flex justifyContent="space-between" alignItems="center" mb={4}>
          <Box fontWeight="bold" fontSize="md">
            #{index + 1}
          </Box>
          <IconButton
            icon={<CloseIcon />}
            size="xs"
            colorScheme="red"
            onClick={() => handleDeleteNumRow(index)}
          />
        </Flex>

        {/* Responsive Grid for Cards */}
        <Grid
          templateColumns={[
            "1fr", // Mobile: 1 card per row
            "repeat(2, 1fr)", // Tablet: 2 cards per row
            "repeat(4, 1fr)"  // Laptop: 4 cards per row
          ]}
          gap={4}
          mb={4}
        >
          {/* Symbol Selection */}
          <FormControl>
            <FormLabel>Symbol</FormLabel>
            <Box position="relative">
              <InputGroup>
                <Input
                  value={tableRows[index].name}
                  onClick={() => handleSearchChange(index, searchTerms[index])}
                  placeholder="Select Symbol"
                  variant="filled"
                  bg="gray.100"
                  _focus={{ bg: "white", borderColor: "gray.300" }}
                  readOnly
                  cursor="pointer"
                />
                <InputRightElement width="2.5rem">
                  <IconButton
                    aria-label="Dropdown icon"
                    icon={<MdArrowDropDown />}
                    variant="ghost"
                    onClick={() => handleSearchChange(index, searchTerms[index])}
                  />
                </InputRightElement>
              </InputGroup>
              {showOptions[index] && (
                <Box
                  position="absolute"
                  top="100%"
                  left={0}
                  right={0}
                  bg="white"
                  boxShadow="lg"
                  zIndex={10}
                  maxHeight="200px"
                  overflowY="auto"
                  borderRadius="md"
                  mt={1}
                  p={2}
                >
                  <InputGroup mb={2}>
                    <Input
                      value={searchTerms[index]}
                      onChange={(e) => handleSearchChange(index, e.target.value)}
                      placeholder="Search Symbols"
                      bg="gray.50"
                      border="1px"
                      borderColor="gray.300"
                      _focus={{
                        bg: "white",
                        borderColor: "blue.500",
                      }}
                    />
                  </InputGroup>
                  <List spacing={1}>
                    {filteredSymbols.length ? (
                      filteredSymbols.map((item) => (
                        <ListItem
                          key={item.symbol}
                          onClick={() => handleSelectChange(index, item.symbol)}
                          cursor="pointer"
                          _hover={{ background: "gray.100" }}
                          px={4}
                          py={2}
                          borderRadius="md"
                          bg="gray.50"
                          mb={1}
                        >
                          {item.name}
                        </ListItem>
                      ))
                    ) : (
                      <Text px={4} py={2} color="gray.500">
                        No options found
                      </Text>
                    )}
                  </List>
                </Box>
              )}
            </Box>
          </FormControl>

          {/* Quantity Input */}
          <FormControl>
            <FormLabel fontSize="sm">Quantity</FormLabel>
            <Input
              bg={"white"}
              value={row.quantity}
              onChange={(e) =>
                handleNumRowsChange(index, "quantity", e.target.value)
              }
              type="number"
              size="sm"
              placeholder="Quantity"
            />
          </FormControl>

          {/* Entry Low Range */}
          <FormControl>
            <FormLabel fontSize="sm">Entry Low Range</FormLabel>
            <Input
              bg={"white"}
              value={row.enterLowRange}
              onChange={(e) =>
                handleNumRowsChange(index, "enterLowRange", e.target.value)
              }
              type="number"
              size="sm"
              placeholder="Low Range"
            />
          </FormControl>

          {/* Entry High Range */}
          <FormControl>
            <FormLabel fontSize="sm">Entry High Range</FormLabel>
            <Input
              bg={"white"}
              value={row.enterHighRange}
              onChange={(e) =>
                handleNumRowsChange(index, "enterHighRange", e.target.value)
              }
              type="number"
              size="sm"
              placeholder="High Range"
            />
          </FormControl>

          {/* Stop Loss */}
          <FormControl>
            <FormLabel fontSize="sm">Stop Loss</FormLabel>
            <Input
              bg={"white"}
              value={row.stopLoss}
              onChange={(e) =>
                handleNumRowsChange(index, "stopLoss", e.target.value)
              }
              type="number"
              size="sm"
              placeholder="Stop Loss"
            />
          </FormControl>

          {/* Quantile */}
          <FormControl>
            <FormLabel fontSize="sm">Quantile</FormLabel>
            <Input
              bg={"white"}
              value={row.quantile}
              onChange={(e) =>
                handleNumRowsChange(index, "quantile", e.target.value)
              }
              type="number"
              size="sm"
              placeholder="Quantile"
            />
          </FormControl>
        </Grid>

        {/* Take Profit Section */}
        <Grid
          templateColumns={["1fr", "repeat(2, 1fr)", "repeat(3, 1fr)"]}
          gap={4}
        >
          {row.takeProfits.map((takeProfit, profitIndex) => (
            <Box
              key={profitIndex}
              borderWidth="1px"
              borderRadius="lg"
              p={4}
              bg="white"
              boxShadow="md"
              _hover={{ transform: "scale(1.05)", bg: "#f0f4f7" }}
            >
              <Flex justifyContent="space-between" alignItems="center" mb={4}>
                <Text fontWeight="bold" fontSize="lg" color="#244c9c">
                  Take Profit {profitIndex + 1}
                </Text>
                <IconButton
                  icon={<CloseIcon />}
                  size="sm"
                  colorScheme="red"
                  aria-label="Remove Take Profit"
                  onClick={() => handleRemoveTakeProfit(index, profitIndex)}
                />
              </Flex>

              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl>
                  <FormLabel fontSize="sm" color="#244c9c">
                    Take Profit
                  </FormLabel>
                  <Input
                    bg="white"
                    value={takeProfit.takeProfit}
                    onChange={(e) =>
                      handleNumRowTakeProfitChange(
                        index,
                        profitIndex,
                        "takeProfit",
                        e.target.value
                      )
                    }
                    type="number"
                    placeholder="Enter Take Profit"
                    borderColor="gray.300"
                    _focus={{ borderColor: "#244c9c", boxShadow: "0 0 0 2px #244c9c" }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm" color="#244c9c">
                    Profit Quantity
                  </FormLabel>
                  <Input
                    bg="white"
                    value={takeProfit.takeProfitQuantity}
                    onChange={(e) =>
                      handleNumRowTakeProfitChange(
                        index,
                        profitIndex,
                        "takeProfitQuantity",
                        e.target.value
                      )
                    }
                    type="number"
                    placeholder="Enter Profit Quantity"
                    borderColor="gray.300"
                    _focus={{ borderColor: "#244c9c", boxShadow: "0 0 0 2px #244c9c" }}
                  />
                </FormControl>
              </Grid>
            </Box>
          ))}
        </Grid>

        {/* Add Take Profit Button */}
        <Button
          colorScheme="blue"
          onClick={() => addNumRowTakeProfit(index)}
          size="sm"
          mt={4}
        >
          Add Take Profit
        </Button>
      </Box>
    ))}

    {/* Add Row Button */}
    <Button
      onClick={addNumRow}
      size="sm"
      bg="#244c9c"
      color="white"
      mt={2}
      _hover={{ bg: "#1e3a5f" }}
    >
      Add Row
    </Button>
  </FormControl>
)}


                {/* <=====================================If Idea Type is Futures===================================> */}

                {ideaType.includes("Futures") && (
  <FormControl
    mb={4}
    p={4}
    borderRadius="md"
    boxShadow="lg"
    bg="white"
  >
    <Heading as="h3" size="md" mb={4} color="#244c9c">
      Future
    </Heading>
    {futureTableRows.map((row, index) => (
      <Box
        key={index}
        mb={4}
        p={3}
        borderWidth="1px"
        borderRadius="md"
        boxShadow="sm"
        bg="gray.50"
        position="relative"
      >
        <Flex justify="space-between" align="center" mb={3}>
          <Text fontWeight="semibold" color="#244c9c" fontSize="sm">
            #{index + 1}
          </Text>
          <IconButton
            icon={<CloseIcon />}
            size="xs"
            colorScheme="red"
            onClick={() => deleteFutureRow(index)}
          />
        </Flex>

        <Flex flexWrap="wrap" justifyContent="space-between">
          {/* First Row: Symbol, Expiry, Lot, Long/Short */}
          <FormControl width={["100%", "22%"]} mb={3}>
            <FormLabel fontSize="sm">Symbol</FormLabel>
            <Select
              size="sm"
              value={row.name}
              required
              onChange={(e) => {
                handleFutureRowChange(index, "name", e.target.value);
                handleFutureRowChange(index, "expiryDate", ""); // Reset expiry date when symbol changes
              }}
              placeholder="Select Symbol"
              variant="outline"
              bg="white"
              _focus={{ bg: "white", borderColor: "#244c9c" }}
            >
              {[...new Set(futureSymbol.map((item) => item.sym))].map(
                (sym, idx) => (
                  <option key={idx} value={sym}>
                    {sym}
                  </option>
                )
              )}
            </Select>
          </FormControl>

          <FormControl width={["100%", "22%"]} mb={3}>
            <FormLabel fontSize="sm">Expiry</FormLabel>
            <Select
              size="sm"
              value={row.expiryDate}
              required
              onChange={(e) =>
                handleFutureRowChange(index, "expiryDate", e.target.value)
              }
              placeholder="Select Expiry"
              variant="outline"
              bg="white"
              _focus={{ bg: "white", borderColor: "#244c9c" }}
            >
              {getExpiryDatesForFutureSymbol(row.name).map((exp, idx) => (
                <option key={idx} value={exp}>
                  {exp}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl width={["100%", "22%"]} mb={3}>
            <FormLabel fontSize="sm">LOT</FormLabel>
            <Input
              size="sm"
              value={row.lot}
              required
              min={1}
              max={100}
              onChange={(e) => handleFutureRowChange(index, "lot", e.target.value)}
              type="number"
              placeholder="LOT"
              bg="white"
              _focus={{ bg: "white", borderColor: "#244c9c" }}
            />
          </FormControl>

          <FormControl width={["100%", "22%"]} mb={3}>
            <FormLabel fontSize="sm">Long/Short</FormLabel>
            <Select
              size="sm"
              placeholder="Select"
              value={row.longShort}
              onChange={(e) =>
                handleFutureRowChange(index, "longShort", e.target.value)
              }
              bg="white"
              _focus={{ bg: "white", borderColor: "#244c9c" }}
            >
              <option value="Long">Long</option>
              <option value="Short">Short</option>
            </Select>
          </FormControl>

          {/* Second Row: Entry Low Range, Entry High Range, Stop Loss */}
          <FormControl width={["100%", "30%"]} mb={3}>
            <FormLabel fontSize="sm">Entry Low Range</FormLabel>
            <Input
              size="sm"
              value={row.enterLowRange}
              required
              onChange={(e) =>
                handleFutureRowChange(index, "enterLowRange", e.target.value)
              }
              type="number"
              placeholder="Low Range"
              bg="white"
              _focus={{ bg: "white", borderColor: "#244c9c" }}
            />
          </FormControl>

          <FormControl width={["100%", "30%"]} mb={3}>
            <FormLabel fontSize="sm">Entry High Range</FormLabel>
            <Input
              size="sm"
              value={row.enterHighRange}
              required
              onChange={(e) =>
                handleFutureRowChange(index, "enterHighRange", e.target.value)
              }
              type="number"
              placeholder="High Range"
              bg="white"
              _focus={{ bg: "white", borderColor: "#244c9c" }}
            />
          </FormControl>

          <FormControl width={["100%", "30%"]} mb={3}>
            <FormLabel fontSize="sm">Stop Loss</FormLabel>
            <Input
              size="sm"
              value={row.stopLoss}
              required
              min={1}
              onChange={(e) => handleFutureRowChange(index, "stopLoss", e.target.value)}
              type="number"
              placeholder="Stop Loss"
              bg="white"
              _focus={{ bg: "white", borderColor: "#244c9c" }}
            />
          </FormControl>

          <FormControl width={["100%", "30%"]} mb={3}>
            <FormLabel fontSize="sm">Quantile</FormLabel>
            <Input
              size="sm"
              value={row.quantile}
              required
              min={1}
              onChange={(e) => handleFutureRowChange(index, "quantile", e.target.value)}
              type="number"
              placeholder="Quantile"
              bg="white"
              _focus={{ bg: "white", borderColor: "#244c9c" }}
            />
          </FormControl>

          {/* Take Profit Fields */}
          <Grid
            templateColumns={["1fr", "repeat(3, 1fr)"]}
            gap={4}
            mt={2}
          >
            {row.takeProfits &&
              row.takeProfits.map((takeProfit, profitIndex) => (
                <Box
                  key={profitIndex}
                  bg="blue.50"
                  p={3}
                  borderRadius="md"
                  boxShadow="md"
                  position="relative"
                >
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontSize="sm" fontWeight="bold" color="#244c9c">
                      Take Profit {profitIndex + 1}
                    </Text>
                    <IconButton
                      icon={<CloseIcon />}
                      size="xs"
                      colorScheme="red"
                      onClick={() => handleRemoveFutureTakeProfit(index, profitIndex)}
                    />
                  </Flex>
                  <Flex justify="space-between">
                    <FormControl width="45%" mb={2}>
                      <FormLabel fontSize="sm">Profit</FormLabel>
                      <Input
                        size="sm"
                        value={takeProfit.takeProfit}
                        required
                        onChange={(e) =>
                          handleFutureTakeProfitChange(index, profitIndex, "takeProfit", e.target.value)
                        }
                        type="number"
                        placeholder="Profit"
                        bg="white"
                        _focus={{ bg: "white", borderColor: "#244c9c" }}
                      />
                    </FormControl>

                    <FormControl width="45%" mb={2}>
                      <FormLabel fontSize="sm">Lot</FormLabel>
                      <Input
                        size="sm"
                        value={takeProfit.takeProfitLot}
                        required
                        onChange={(e) =>
                          handleFutureTakeProfitChange(index, profitIndex, "takeProfitLot", e.target.value)
                        }
                        type="number"
                        placeholder="Lot"
                        bg="white"
                        _focus={{ bg: "white", borderColor: "#244c9c" }}
                      />
                    </FormControl>
                  </Flex>
                </Box>
              ))}
          </Grid>

          {/* Add Future Profit Button */}
          <Button
            size="sm"
            colorScheme="blue"
            onClick={() => addFutureTakeProfit(index)}
            mt={2}
          >
            Add Future Profit
          </Button>
        </Flex>
      </Box>
    ))}

    {/* Add Future Button */}
    <Button
      size="sm"
      onClick={addFutureRow}
      variant="outline"
      bg="#244c9c"
      color="white"
      _hover={{ bg: "#1e3a5f" }}
      mt={4}
    >
      Add Future
    </Button>
  </FormControl>
)}


                {/* <=====================================If Idea Type is Options===================================> */}
                {ideaType.includes("Options") && (
                  <FormControl
                    mb={6}
                    p={6}
                    borderRadius="md"
                    boxShadow="lg"
                    bg="white"
                  >
                    <Heading as="h3" size="lg">
                      Options
                    </Heading>
                    {optionsTableRows.map((row, index) => (
                      <Box
                        key={index}
                        mb={6}
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        boxShadow="sm"
                        bg="gray.50"
                        position="relative"
                      >
                        <Flex justify="space-between" align="center" mb={4}>
                          <Text fontWeight="bold" color="#244c9c">
                            #{index + 1}
                          </Text>
                          <IconButton
                            icon={<CloseIcon />}
                            size="sm"
                            colorScheme="red"
                            onClick={() => deleteOptionsRow(index)}
                          />
                        </Flex>

                        {/* Row 1: Symbol, Expiry, Strike Price, Option Type, Lot */}
                        <Flex
                          flexWrap="wrap"
                          justifyContent="space-between"
                          mb={4}
                        >
                          <FormControl width={["100%", "18%"]} mb={4}>
                            <FormLabel>Symbol</FormLabel>
                            <Select
                              value={row.name}
                              required
                              onChange={(e) => {
                                handleOptionsRowChange(
                                  index,
                                  "name",
                                  e.target.value
                                );
                                handleOptionsRowChange(index, "expiryDate", "");
                              }}
                              placeholder="Select Symbol"
                              variant="outline"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            >
                              {[
                                ...new Set(
                                  optionSymbol.map((item) => item.sym)
                                ),
                              ].map((sym, idx) => (
                                <option key={idx} value={sym}>
                                  {sym}
                                </option>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl width={["100%", "18%"]} mb={4}>
                            <FormLabel>Expiry</FormLabel>
                            <Select
                              value={row.expiryDate}
                              required
                              onChange={(e) =>
                                handleOptionsRowChange(
                                  index,
                                  "expiryDate",
                                  e.target.value
                                )
                              }
                              placeholder="Select Expiry"
                              variant="outline"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            >
                              {getExpiryDatesForOptionSymbol(row.name).map(
                                (exp, idx) => (
                                  <option key={idx} value={exp}>
                                    {exp}
                                  </option>
                                )
                              )}
                            </Select>
                          </FormControl>

                          <FormControl width={["100%", "18%"]} mb={4}>
                            <FormLabel>Strike Price</FormLabel>
                            <Select
                              value={row.strike}
                              required
                              onChange={(e) =>
                                handleOptionsRowChange(
                                  index,
                                  "strike",
                                  e.target.value
                                )
                              }
                              placeholder="Select Strike"
                              variant="outline"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            >
                              {getStrikeForOptionSymbol(row.name).map(
                                (strike, idx) => (
                                  <option key={idx} value={strike}>
                                    {strike}
                                  </option>
                                )
                              )}
                            </Select>
                          </FormControl>

                          <FormControl width={["100%", "18%"]} mb={4}>
                            <FormLabel>Option Type</FormLabel>
                            <Select
                              value={row.optionType}
                              required
                              onChange={(e) =>
                                handleOptionsRowChange(
                                  index,
                                  "optionType",
                                  e.target.value
                                )
                              }
                              placeholder="Select Option Type"
                              variant="outline"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            >
                              <option value="Call">Call</option>
                              <option value="Put">Put</option>
                            </Select>
                          </FormControl>

                          <FormControl width={["100%", "18%"]} mb={4}>
                            <FormLabel>LOT</FormLabel>
                            <Input
                              value={row.lot}
                              required
                              min={1}
                              max={100}
                              onChange={(e) =>
                                handleOptionsRowChange(
                                  index,
                                  "lot",
                                  e.target.value
                                )
                              }
                              type="number"
                              placeholder="LOT"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            />
                          </FormControl>
                        </Flex>

                        {/* Row 2: Long/Short, Entry Low Range, Entry High Range, Stop Loss */}
                        <Flex
                          flexWrap="wrap"
                          justifyContent="space-between"
                          mb={4}
                        >
                          <FormControl width={["100%", "23%"]} mb={4}>
                            <FormLabel>Long/Short</FormLabel>
                            <Select
                              placeholder="Select Long/Short"
                              value={row.longShort}
                              onChange={(e) =>
                                handleOptionsRowChange(
                                  index,
                                  "longShort",
                                  e.target.value
                                )
                              }
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            >
                              <option value="Long">Long</option>
                              <option value="Short">Short</option>
                            </Select>
                          </FormControl>

                          <FormControl width={["100%", "23%"]} mb={4}>
                            <FormLabel>Entry Low Range</FormLabel>
                            <Input
                              value={row.enterLowRange}
                              required
                              onChange={(e) =>
                                handleOptionsRowChange(
                                  index,
                                  "enterLowRange",
                                  e.target.value
                                )
                              }
                              type="number"
                              placeholder="Entry Low Range"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            />
                          </FormControl>

                          <FormControl width={["100%", "23%"]} mb={4}>
                            <FormLabel>Entry High Range</FormLabel>
                            <Input
                              value={row.enterHighRange}
                              required
                              onChange={(e) =>
                                handleOptionsRowChange(
                                  index,
                                  "enterHighRange",
                                  e.target.value
                                )
                              }
                              type="number"
                              placeholder="Entry High Range"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            />
                          </FormControl>

                          <FormControl width={["100%", "23%"]} mb={4}>
                            <FormLabel>Stop Loss</FormLabel>
                            <Input
                              value={row.stopLoss}
                              required
                              min="1"
                              onChange={(e) =>
                                handleOptionsRowChange(
                                  index,
                                  "stopLoss",
                                  e.target.value
                                )
                              }
                              type="number"
                              placeholder="Stop Loss"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            />
                          </FormControl>

                          <FormControl width={["100%", "23%"]} mb={4}>
                            <FormLabel>Quantile</FormLabel>
                            <Input
                              value={row.quantile}
                              required
                              min="1"
                              onChange={(e) =>
                                handleOptionsRowChange(
                                  index,
                                  "quantile",
                                  e.target.value
                                )
                              }
                              type="number"
                              placeholder="Quantile"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            />
                          </FormControl>
                        </Flex>

                        {/* Display Take Profits */}
                        <Grid
                          templateColumns={["1fr", "repeat(3, 1fr)"]} // 1 column on small screens, 3 columns on larger screens
                          gap={6} // spacing between cards
                          mt={4}
                        >
                          {row.takeProfits &&
                            row.takeProfits.map((takeProfit, profitIndex) => (
                              <Box
                                key={profitIndex}
                                bg="blue.50"
                                p={4}
                                borderRadius="md"
                                boxShadow="md"
                                position="relative"
                              >
                                {/* Header for Take Profit with Delete Button */}
                                <Flex
                                  justifyContent="space-between"
                                  alignItems="center"
                                  mb={4}
                                >
                                  <Text fontWeight="bold" color="#244c9c">
                                    Take Profit {profitIndex + 1}
                                  </Text>
                                  <IconButton
                                    icon={<CloseIcon />}
                                    size="sm"
                                    colorScheme="red"
                                    aria-label="Delete Take Profit"
                                    position="absolute"
                                    top={2}
                                    right={2}
                                  
                                    onClick={() =>
                                      handleRemoveOptionsTakeProfit(
                                        index,
                                        profitIndex
                                      )
                                    }
                                  />
                                </Flex>

                                {/* Flex Container to Display Take Profit and LOT Fields Side by Side */}
                                <Flex
                                  flexWrap="wrap"
                                  justifyContent="space-between"
                                >
                                  {/* Take Profit Input */}
                                  <FormControl width="45%" mb={4}>
                                    <FormLabel
                                      fontWeight="bold"
                                      color="#244c9c"
                                    >
                                      Take Profit {profitIndex + 1}
                                    </FormLabel>
                                    <Input
                                      value={takeProfit.takeProfit}
                                      required
                                      onChange={(e) =>
                                        handleOptionsTakeProfitChange(
                                          index,
                                          profitIndex,
                                          "takeProfit",
                                          e.target.value
                                        )
                                      }
                                      type="number"
                                      placeholder="Take Profit"
                                      bg="white"
                                      _focus={{
                                        bg: "white",
                                        borderColor: "#244c9c",
                                      }}
                                    />
                                  </FormControl>

                                  {/* Take Profit LOT Input */}
                                  <FormControl width="45%" mb={4}>
                                    <FormLabel
                                      fontWeight="bold"
                                      color="#244c9c"
                                    >
                                      Take Profit {profitIndex + 1} LOT
                                    </FormLabel>
                                    <Input
                                      value={takeProfit.takeProfitLot}
                                      required
                                      onChange={(e) =>
                                        handleOptionsTakeProfitChange(
                                          index,
                                          profitIndex,
                                          "takeProfitLot",
                                          e.target.value
                                        )
                                      }
                                      type="number"
                                      placeholder="Take Profit Lot"
                                      bg="white"
                                      _focus={{
                                        bg: "white",
                                        borderColor: "#244c9c",
                                      }}
                                    />
                                  </FormControl>
                                </Flex>
                              </Box>
                            ))}
                        </Grid>

                        {/* Add Take Profit Button */}
                        <Button
                          colorScheme="blue"
                          onClick={() => addOptionsTakeProfit(index)}
                          mt={4}
                        >
                          Add Options Profits
                        </Button>
                      </Box>
                    ))}

                    {/* Add Option Button */}
                    <Button
                      variant="outline"
                      onClick={addOptionsRow}
                      bg="#244c9c"
                      color="white"
                      _hover={{ bg: "#1e3a5f" }}
                      mt={4}
                    >
                      Add Option
                    </Button>
                  </FormControl>
                )}

                <Button
                  type="submit"
                  colorScheme="blue"
                  mt={4}
                  isLoading={wait}
                >
                  Create Basket
                </Button>
              </Box>
            </form>
          </TabPanel>

          <TabPanel>
            <form
              onSubmit={handleSubmit}
              style={{ width: "100%", margin: "auto" }}
            >
              <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
                <Heading size="lg" mb={6} textAlign="center" color="#244c9c">
                  Create a New Idea
                </Heading>

                <FormControl
                  mb={4}
                  p={4}
                  borderRadius="md"
                  boxShadow="lg"
                  bg="white"
                >
                  <Box
                    display="flex"
                    flexDirection={["column", "row"]}
                    gap={4}
                    alignItems="stretch"
                  >
                    {/* Left Column: Idea Name, Expiry Date, Risk Level */}
                    <Box flex="1" display="flex" flexDirection="column" gap={4}>
                      {/* Idea Name Field */}
                      <FormControl>
                        <FormLabel
                          htmlFor="basket_name"
                          fontWeight="bold"
                          fontSize="md"
                          color="#244c9c"
                        >
                          Idea Name
                        </FormLabel>
                        <Input
                          type="text"
                          id="basket_name"
                          name="basket_name"
                          maxLength={80}
                          value={basketData.basket_name}
                          onChange={handleInputChange}
                          placeholder="Name of the Idea"
                          isRequired
                          borderColor="#244c9c"
                          _placeholder={{ color: "gray.500" }}
                          _focus={{
                            borderColor: "#244c9c",
                            boxShadow: "0 0 0 1px #244c9c",
                          }}
                        />
                      </FormControl>

                      {/* Start Date Field */}
                      <FormControl>
                        <FormLabel
                          htmlFor="start_date"
                          fontWeight="bold"
                          fontSize="md"
                          color="#244c9c"
                        >
                          Start Date
                        </FormLabel>
                        <Input
                          type="datetime-local"
                          id="start_date"
                          name="start_date"
                          //  min={currentDateTime}
                          min={formattedMinTime}
                          //  max={maxDate}
                          value={basketData.start_date}
                          onChange={handleInputChange}
                          isRequired
                          borderColor="#000d28"
                          _focus={{
                            borderColor: "#244c9c",
                            boxShadow: "0 0 0 1px #244c9c",
                          }}
                        />
                      </FormControl>

                      {/* Expiry Date Field */}
                      <FormControl>
                        <FormLabel
                          htmlFor="expiry_date"
                          fontWeight="bold"
                          fontSize="md"
                          color="#244c9c"
                        >
                          Expiry Date
                        </FormLabel>
                        <Input
                          type="datetime-local"
                          id="expiry_date"
                          name="expiry_date"
                          min={currentDate}
                          max={maxDate}
                          value={basketData.expiry_date}
                          onChange={handleInputChange}
                          isRequired
                          borderColor="#244c9c"
                          _focus={{
                            borderColor: "#244c9c",
                            boxShadow: "0 0 0 1px #244c9c",
                          }}
                        />
                      </FormControl>

                      {/* Risk Level Field */}
                      <FormControl>
                        <FormLabel
                          htmlFor="risk_level"
                          fontWeight="bold"
                          fontSize="md"
                          color="#244c9c"
                        >
                          Risk Level
                        </FormLabel>
                        {/* <Select
                          required
                          value={riskLevel}
                          onChange={(e) => setriskLevel(e.target.value)}
                          placeholder="Select Risk Level"
                          borderColor="#244c9c"
                          _focus={{
                            borderColor: "#244c9c",
                            boxShadow: "0 0 0 1px #244c9c",
                          }}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </Select> */}
                        <RadioGroup
                          required
                          value={riskLevel}
                          onClick={(e) => setriskLevel(e.target.value)}
                        >
                          <Stack spacing={4} direction="row">
                            <Radio value="Low">Low</Radio>
                            <Radio value="Medium">Medium</Radio>
                            <Radio value="High">High</Radio>
                          </Stack>
                        </RadioGroup>
                      </FormControl>
                    </Box>

                    {/* Right Column: Description Field */}
                    <FormControl flex="1">
                      <FormLabel
                        htmlFor="basket_description"
                        fontWeight="bold"
                        fontSize="md"
                        color="#244c9c"
                      >
                        Description
                      </FormLabel>
                      <Textarea
                        id="basket_description"
                        name="basket_description"
                        value={basketData.basket_description}
                        onChange={handleInputChange}
                        placeholder="Description"
                        isRequired
                        borderColor="#244c9c"
                        _placeholder={{ color: "gray.500" }}
                        _focus={{
                          borderColor: "#244c9c",
                          boxShadow: "0 0 0 1px #244c9c",
                        }}
                        height="100%" // Ensures it stretches nicely next to the left column
                      />
                    </FormControl>
                  </Box>

                  {/* Select Idea Type Field */}
                  <Box mt={4}>
                    <FormControl>
                      <FormLabel
                        htmlFor="SelectIdeaType"
                        fontWeight="bold"
                        fontSize="md"
                        color="#244c9c"
                      >
                        Select Idea Type
                      </FormLabel>

                      {/* CheckboxGroup will manage an array of selected values */}
                      <CheckboxGroup value={ideaType} onChange={setIdeaType}>
                        <Stack spacing={4} direction="row">
                          <Checkbox colorScheme="red" value="Cash">
                            Cash
                          </Checkbox>
                          <Checkbox colorScheme="green" value="Futures">
                            Futures
                          </Checkbox>
                          <Checkbox colorScheme="blue" value="Options">
                            Options
                          </Checkbox>
                        </Stack>
                      </CheckboxGroup>
                    </FormControl>
                  </Box>
                </FormControl>

                {/* <====================================If Idea Type is CASH======================================>               */}

                {ideaType.includes("Cash") && (
                  <FormControl
                    mb={4}
                    p={4}
                    borderRadius="lg"
                    boxShadow="md"
                    bg="white"
                  >
                    <Heading as="h3" size="md" mb={4}>
                      Cash
                    </Heading>

                    {tableRows.map((row, index) => (
                      <Box
                        key={index}
                        mb={4}
                        p={3}
                        borderWidth="1px"
                        borderRadius="lg"
                        boxShadow="sm"
                        bg="gray.50"
                        position="relative"
                      >
                        {/* Row Header and Delete Button */}
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                          mb={4}
                        >
                          <Box fontWeight="bold" fontSize="md">
                            #{index + 1}
                          </Box>
                          <IconButton
                            icon={<CloseIcon />}
                            size="xs"
                            colorScheme="red"
                            onClick={() => handleDeleteNumRow(index)}
                          />
                        </Flex>

                        {/* Symbols, Quantity, Entry Low Range, Entry High Range, and Stop Loss in one row */}
                        <Grid templateColumns="repeat(5, 1fr)" gap={4} mb={4}>
                          {/* Symbol Selection */}
                          <FormControl width={["100%", "30%"]} mb={4}>
                                <FormLabel>Symbol</FormLabel>
                                <Box
                                  position="relative"
                                  display="inline-block"
                                  textAlign={"left"}
                                  width="283px"
                                  ref={dropdownRef}
                                >
                                  <InputGroup>
                                    <Input
                                      value={tableRows[index].name}
                                      onClick={() =>
                                        handleSearchChange(
                                          index,
                                          searchTerms[index]
                                        )
                                      }
                                      placeholder="Select Symbol"
                                      variant="filled"
                                      bg="gray.100"
                                      _focus={{
                                        bg: "white",
                                        borderColor: "gray.300",
                                      }}
                                      readOnly
                                      cursor="pointer"
                                    />
                                    <InputRightElement width="2.5rem">
                                      <IconButton
                                        aria-label="Dropdown icon"
                                        icon={<MdArrowDropDown />}
                                        variant="ghost"
                                        onClick={() =>
                                          handleSearchChange(
                                            index,
                                            searchTerms[index]
                                          )
                                        }
                                      />
                                    </InputRightElement>
                                  </InputGroup>
                                  {showOptions[index] && (
                                    <Box
                                      position="absolute"
                                      top="100%"
                                      left={0}
                                      right={0}
                                      bg="white"
                                      boxShadow="lg"
                                      zIndex={10}
                                      maxHeight="200px"
                                      overflowY="auto"
                                      borderRadius="md"
                                      mt={1}
                                      p={2}
                                    >
                                      <InputGroup mb={2}>
                                        <Input
                                          value={searchTerms[index]}
                                          onChange={(e) =>
                                            handleSearchChange(
                                              index,
                                              e.target.value
                                            )
                                          }
                                          placeholder="Search Symbols"
                                          bg="gray.50"
                                          border="1px"
                                          borderColor="gray.300"
                                          _focus={{
                                            bg: "white",
                                            borderColor: "blue.500",
                                          }}
                                        />
                                        <InputRightElement width="2.5rem">
                                          <IconButton
                                            aria-label="Search database"
                                            icon={<SearchIcon color="gray.500" />}
                                            variant="ghost"
                                            onClick={() =>
                                              handleSearchChange(index, "")
                                            }
                                          />
                                        </InputRightElement>
                                      </InputGroup>

                                      <List spacing={1}>
                                        {filteredSymbols.length ? (
                                          filteredSymbols.map((item) => (
                                            <ListItem
                                              key={item.symbol}
                                              onClick={() =>
                                                handleSelectChange(index, item.symbol)
                                              }
                                              cursor="pointer"
                                              _hover={{ background: "gray.100" }}
                                              px={4}
                                              py={2}
                                              borderRadius="md"
                                              bg="gray.50"
                                              mb={1}
                                            >
                                              {item.name}
                                            </ListItem>
                                          ))


                                        ) : (
                                          <Text px={4} py={2} color="gray.500">
                                            No options found
                                          </Text>
                                        )}
                                      </List>
                                    </Box>
                                  )}
                                </Box>
                              </FormControl>

                          {/* Quantity Input */}
                          <FormControl>
                            <FormLabel fontSize="sm">Quantity</FormLabel>
                            <Input
                              bg={"white"}
                              value={row.quantity}
                              onChange={(e) =>
                                handleNumRowsChange(
                                  index,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              type="number"
                              size="sm"
                              placeholder="Quantity"
                            />
                          </FormControl>

                          {/* Entry Low Range */}
                          <FormControl>
                            <FormLabel fontSize="sm">Entry Low Range</FormLabel>
                            <Input
                              bg={"white"}
                              value={row.enterLowRange}
                              onChange={(e) =>
                                handleNumRowsChange(
                                  index,
                                  "enterLowRange",
                                  e.target.value
                                )
                              }
                              type="number"
                              size="sm"
                              placeholder="Low Range"
                            />
                          </FormControl>

                          {/* Entry High Range */}
                          <FormControl>
                            <FormLabel fontSize="sm">
                              Entry High Range
                            </FormLabel>
                            <Input
                              bg={"white"}
                              value={row.enterHighRange}
                              onChange={(e) =>
                                handleNumRowsChange(
                                  index,
                                  "enterHighRange",
                                  e.target.value
                                )
                              }
                              type="number"
                              size="sm"
                              placeholder="High Range"
                            />
                          </FormControl>

                          {/* Stop Loss */}
                          <FormControl>
                            <FormLabel fontSize="sm">Stop Loss</FormLabel>
                            <Input
                              bg={"white"}
                              value={row.stopLoss}
                              onChange={(e) =>
                                handleNumRowsChange(
                                  index,
                                  "stopLoss",
                                  e.target.value
                                )
                              }
                              type="number"
                              size="sm"
                              placeholder="Stop Loss"
                            />
                          </FormControl>
                        </Grid>

                        {/* Take Profit and Take Profit Quantity in two columns, showing 2 pairs per row */}
                        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                          {row.takeProfits.map((takeProfit, profitIndex) => (
                            <Box
                              key={profitIndex}
                              borderWidth="1px"
                              borderRadius="md"
                              p={3}
                              bg="gray.100"
                              mb={4}
                            >
                              <Flex
                                alignItems="center"
                                justifyContent="space-between"
                                mb={3}
                              >
                                <Box>
                                  <Text fontWeight="bold">
                                    Take Profit {profitIndex + 1}
                                  </Text>
                                </Box>
                                <IconButton
                                  icon={<CloseIcon />}
                                  size="xs"
                                  colorScheme="red"
                                  onClick={() =>
                                    handleRemoveTakeProfit(index, profitIndex)
                                  }
                                />
                              </Flex>

                              {/* Grid for displaying two columns (Take Profit and Profit Quantity) */}
                              <Grid
                                templateColumns={["1fr", "repeat(3, 1fr)"]} // 1 column on small screens, 3 columns on larger screens
                                gap={4} // spacing between items
                                mt={4}
                              >
                                {/* Take Profit Input */}
                                <FormControl>
                                  <FormLabel
                                    fontSize="sm"
                                    color="#244c9c"
                                    fontWeight="bold"
                                  >
                                    {" "}
                                    {/* Updated color and fontWeight */}
                                    Take Profit
                                  </FormLabel>
                                  <Input
                                    bg="white"
                                    value={takeProfit.takeProfit}
                                    onChange={(e) =>
                                      handleNumRowTakeProfitChange(
                                        index,
                                        profitIndex,
                                        "takeProfit",
                                        e.target.value
                                      )
                                    }
                                    type="number"
                                    size="sm"
                                    placeholder="Take Profit"
                                    _placeholder={{ color: "gray.500" }} // Lighter placeholder color
                                    _focus={{ borderColor: "#244c9c" }} // Focus border color
                                    borderColor="gray.300" // Border color
                                    borderRadius="md" // Rounded corners
                                  />
                                </FormControl>

                                {/* Profit Quantity Input */}
                                <FormControl>
                                  <FormLabel
                                    fontSize="sm"
                                    color="#244c9c"
                                    fontWeight="bold"
                                  >
                                    {" "}
                                    {/* Updated color and fontWeight */}
                                    Profit Quantity
                                  </FormLabel>
                                  <Input
                                    bg="white"
                                    value={takeProfit.takeProfitQuantity}
                                    onChange={(e) =>
                                      handleNumRowTakeProfitChange(
                                        index,
                                        profitIndex,
                                        "takeProfitQuantity",
                                        e.target.value
                                      )
                                    }
                                    type="number"
                                    size="sm"
                                    placeholder="Profit Quantity"
                                    _placeholder={{ color: "gray.500" }} // Lighter placeholder color
                                    _focus={{ borderColor: "#244c9c" }} // Focus border color
                                    borderColor="gray.300" // Border color
                                    borderRadius="md" // Rounded corners
                                  />
                                </FormControl>
                              </Grid>
                            </Box>
                          ))}
                        </Grid>

                        {/* Add Take Profit Button */}
                        <Button
                          colorScheme="blue"
                          onClick={() => addNumRowTakeProfit(index)}
                          size="sm"
                        >
                          Add Take Profit
                        </Button>
                      </Box>
                    ))}

                    {/* Add Row Button */}
                    <Button
                      onClick={addNumRow}
                      size="sm"
                      bg="#244c9c"
                      color="white"
                      mt={2}
                      _hover={{ bg: "#1e3a5f" }}
                    >
                      Add Row
                    </Button>
                  </FormControl>
                )}

                {/* <=====================================If Idea Type is Futures===================================> */}

                {ideaType.includes("Futures") && (
                  <FormControl
                    mb={6}
                    p={6}
                    borderRadius="md"
                    boxShadow="lg"
                    bg="white"
                  >
                    <Heading as="h3" size="lg">
                      Future
                    </Heading>
                    {futureTableRows.map((row, index) => (
                      <Box
                        key={index}
                        mb={6}
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        boxShadow="sm"
                        bg="gray.50"
                        position="relative"
                      >
                        <Flex justify="space-between" align="center" mb={5}>
                          <Text fontWeight="bold" color="#244c9c">
                            #{index + 1}
                          </Text>
                          <IconButton
                            icon={<CloseIcon />}
                            size="sm"
                            colorScheme="red"
                            onClick={() => deleteFutureRow(index)}
                          />
                        </Flex>

                        <Flex flexWrap="wrap" justifyContent="space-between">
                          {/* First Row: Symbol, Expiry, Lot, Long/Short */}
                          <FormControl width={["100%", "22%"]} mb={4}>
                            <FormLabel>Symbol</FormLabel>
                            <Select
                              value={row.name}
                              required
                              onChange={(e) => {
                                handleFutureRowChange(
                                  index,
                                  "name",
                                  e.target.value
                                );
                                handleFutureRowChange(index, "expiryDate", ""); // Reset expiry date when symbol changes
                              }}
                              placeholder="Select Symbol"
                              variant="outline"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            >
                              {[
                                ...new Set(
                                  futureSymbol.map((item) => item.sym)
                                ),
                              ].map((sym, idx) => (
                                <option key={idx} value={sym}>
                                  {sym}
                                </option>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl width={["100%", "22%"]} mb={4}>
                            <FormLabel>Expiry</FormLabel>
                            <Select
                              value={row.expiryDate}
                              required
                              onChange={(e) =>
                                handleFutureRowChange(
                                  index,
                                  "expiryDate",
                                  e.target.value
                                )
                              }
                              placeholder="Select Expiry"
                              variant="outline"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            >
                              {getExpiryDatesForFutureSymbol(row.name).map(
                                (exp, idx) => (
                                  <option key={idx} value={exp}>
                                    {exp}
                                  </option>
                                )
                              )}
                            </Select>
                          </FormControl>

                          <FormControl width={["100%", "22%"]} mb={4}>
                            <FormLabel>LOT</FormLabel>
                            <Input
                              value={row.lot}
                              required
                              min={1}
                              max={100}
                              onChange={(e) =>
                                handleFutureRowChange(
                                  index,
                                  "lot",
                                  e.target.value
                                )
                              }
                              type="number"
                              placeholder="LOT"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            />
                          </FormControl>

                          <FormControl width={["100%", "22%"]} mb={4}>
                            <FormLabel>Long/Short</FormLabel>
                            <Select
                              placeholder="Select Long/Short"
                              value={row.longShort}
                              onChange={(e) =>
                                handleFutureRowChange(
                                  index,
                                  "longShort",
                                  e.target.value
                                )
                              }
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            >
                              <option value="Long">Long</option>
                              <option value="Short">Short</option>
                            </Select>
                          </FormControl>

                          {/* Second Row: Entry Low Range, Entry High Range, Stop Loss */}
                          <FormControl width={["100%", "30%"]} mb={4}>
                            <FormLabel>Entry Low Range</FormLabel>
                            <Input
                              value={row.enterLowRange}
                              required
                              onChange={(e) =>
                                handleFutureRowChange(
                                  index,
                                  "enterLowRange",
                                  e.target.value
                                )
                              }
                              type="number"
                              placeholder="Entry Low Range"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            />
                          </FormControl>

                          <FormControl width={["100%", "30%"]} mb={4}>
                            <FormLabel>Entry High Range</FormLabel>
                            <Input
                              value={row.enterHighRange}
                              required
                              onChange={(e) =>
                                handleFutureRowChange(
                                  index,
                                  "enterHighRange",
                                  e.target.value
                                )
                              }
                              type="number"
                              placeholder="Entry High Range"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            />
                          </FormControl>

                          <FormControl width={["100%", "30%"]} mb={4}>
                            <FormLabel>Stop Loss</FormLabel>
                            <Input
                              value={row.stopLoss}
                              required
                              min="1"
                              onChange={(e) =>
                                handleFutureRowChange(
                                  index,
                                  "stopLoss",
                                  e.target.value
                                )
                              }
                              type="number"
                              placeholder="Stop Loss"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            />
                          </FormControl>

                          {/* Take Profit Fields */}
                          <Grid
                            templateColumns={["1fr", "repeat(3, 1fr)"]} // 1 column on small screens, 3 columns on larger screens
                            gap={6} // spacing between cards
                            mt={4}
                          >
                            {row.takeProfits &&
                              row.takeProfits.map((takeProfit, profitIndex) => (
                                <Box
                                  key={profitIndex}
                                  bg="blue.50"
                                  p={4}
                                  borderRadius="md"
                                  boxShadow="md"
                                  position="relative"
                                >
                                  {/* Header for Take Profit with Delete Button */}
                                  <Flex
                                    justifyContent="space-between"
                                    alignItems="center"
                                    mb={4}
                                  >
                                    <Text fontWeight="bold" color="#244c9c">
                                      Take Profit {profitIndex + 1}
                                    </Text>
                                    <IconButton
                                      icon={<CloseIcon />}
                                      size="sm"
                                      colorScheme="red"
                                      aria-label="Delete Take Profit"
                                      position="absolute"
                                      top={2}
                                      right={2}
                                      
                                      onClick={() =>
                                        handleRemoveFutureTakeProfit(
                                          index,
                                          profitIndex
                                        )
                                      }
                                    />
                                  </Flex>

                                  {/* Flex Container to Display Take Profit and LOT Fields Side by Side */}
                                  <Flex
                                    flexWrap="wrap"
                                    justifyContent="space-between"
                                  >
                                    {/* Take Profit Input */}
                                    <FormControl width="45%" mb={4}>
                                      <FormLabel
                                        fontWeight="bold"
                                        color="#244c9c"
                                      >
                                        Take Profit {profitIndex + 1}
                                      </FormLabel>
                                      <Input
                                        value={takeProfit.takeProfit}
                                        required
                                        onChange={(e) =>
                                          handleFutureTakeProfitChange(
                                            index,
                                            profitIndex,
                                            "takeProfit",
                                            e.target.value
                                          )
                                        }
                                        type="number"
                                        placeholder="Take Profit"
                                        bg="white"
                                        _focus={{
                                          bg: "white",
                                          borderColor: "#244c9c",
                                        }}
                                      />
                                    </FormControl>

                                    {/* Take Profit LOT Input */}
                                    <FormControl width="45%" mb={4}>
                                      <FormLabel
                                        fontWeight="bold"
                                        color="#244c9c"
                                      >
                                        Take Profit {profitIndex + 1} LOT
                                      </FormLabel>
                                      <Input
                                        value={takeProfit.takeProfitLot}
                                        required
                                        onChange={(e) =>
                                          handleFutureTakeProfitChange(
                                            index,
                                            profitIndex,
                                            "takeProfitLot",
                                            e.target.value
                                          )
                                        }
                                        type="number"
                                        placeholder="Take Profit Lot"
                                        bg="white"
                                        _focus={{
                                          bg: "white",
                                          borderColor: "#244c9c",
                                        }}
                                      />
                                    </FormControl>
                                  </Flex>
                                </Box>
                              ))}
                          </Grid>

                          {/* Add Future Profit button remains unchanged */}
                          <Button
                            colorScheme="blue"
                            onClick={() => addFutureTakeProfit(index)}
                            mt={4}
                          >
                            Add Future Profits
                          </Button>
                        </Flex>
                      </Box>
                    ))}
                    {/* Add Future Button */}
                    <Button
                      onClick={addFutureRow}
                      variant="outline"
                      bg="#244c9c"
                      color="white"
                      _hover={{ bg: "#1e3a5f" }}
                      mt={4}
                    >
                      Add Future
                    </Button>
                  </FormControl>
                )}

                {/* <=====================================If Idea Type is Options===================================> */}
                {ideaType.includes("Options") && (
                  <FormControl
                    mb={6}
                    p={6}
                    borderRadius="md"
                    boxShadow="lg"
                    bg="white"
                  >
                    <Heading as="h3" size="lg">
                      Options
                    </Heading>
                    {optionsTableRows.map((row, index) => (
                      <Box
                        key={index}
                        mb={6}
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        boxShadow="sm"
                        bg="gray.50"
                        position="relative"
                      >
                        <Flex justify="space-between" align="center" mb={4}>
                          <Text fontWeight="bold" color="#244c9c">
                            #{index + 1}
                          </Text>
                          <IconButton
                            icon={<CloseIcon />}
                            size="sm"
                            colorScheme="red"
                            onClick={() => deleteOptionsRow(index)}
                          />
                        </Flex>

                        {/* Row 1: Symbol, Expiry, Strike Price, Option Type, Lot */}
                        <Flex
                          flexWrap="wrap"
                          justifyContent="space-between"
                          mb={4}
                        >
                          <FormControl width={["100%", "18%"]} mb={4}>
                            <FormLabel>Symbol</FormLabel>
                            <Select
                              value={row.name}
                              required
                              onChange={(e) => {
                                handleOptionsRowChange(
                                  index,
                                  "name",
                                  e.target.value
                                );
                                handleOptionsRowChange(index, "expiryDate", "");
                              }}
                              placeholder="Select Symbol"
                              variant="outline"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            >
                              {[
                                ...new Set(
                                  optionSymbol.map((item) => item.sym)
                                ),
                              ].map((sym, idx) => (
                                <option key={idx} value={sym}>
                                  {sym}
                                </option>
                              ))}
                            </Select>
                          </FormControl>

                          <FormControl width={["100%", "18%"]} mb={4}>
                            <FormLabel>Expiry</FormLabel>
                            <Select
                              value={row.expiryDate}
                              required
                              onChange={(e) =>
                                handleOptionsRowChange(
                                  index,
                                  "expiryDate",
                                  e.target.value
                                )
                              }
                              placeholder="Select Expiry"
                              variant="outline"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            >
                              {getExpiryDatesForOptionSymbol(row.name).map(
                                (exp, idx) => (
                                  <option key={idx} value={exp}>
                                    {exp}
                                  </option>
                                )
                              )}
                            </Select>
                          </FormControl>

                          <FormControl width={["100%", "18%"]} mb={4}>
                            <FormLabel>Strike Price</FormLabel>
                            <Select
                              value={row.strike}
                              required
                              onChange={(e) =>
                                handleOptionsRowChange(
                                  index,
                                  "strike",
                                  e.target.value
                                )
                              }
                              placeholder="Select Strike"
                              variant="outline"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            >
                              {getStrikeForOptionSymbol(row.name).map(
                                (strike, idx) => (
                                  <option key={idx} value={strike}>
                                    {strike}
                                  </option>
                                )
                              )}
                            </Select>
                          </FormControl>

                          <FormControl width={["100%", "18%"]} mb={4}>
                            <FormLabel>Option Type</FormLabel>
                            <Select
                              value={row.optionType}
                              required
                              onChange={(e) =>
                                handleOptionsRowChange(
                                  index,
                                  "optionType",
                                  e.target.value
                                )
                              }
                              placeholder="Select Option Type"
                              variant="outline"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            >
                              <option value="Call">Call</option>
                              <option value="Put">Put</option>
                            </Select>
                          </FormControl>

                          <FormControl width={["100%", "18%"]} mb={4}>
                            <FormLabel>LOT</FormLabel>
                            <Input
                              value={row.lot}
                              required
                              min={1}
                              max={100}
                              onChange={(e) =>
                                handleOptionsRowChange(
                                  index,
                                  "lot",
                                  e.target.value
                                )
                              }
                              type="number"
                              placeholder="LOT"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            />
                          </FormControl>
                        </Flex>

                        {/* Row 2: Long/Short, Entry Low Range, Entry High Range, Stop Loss */}
                        <Flex
                          flexWrap="wrap"
                          justifyContent="space-between"
                          mb={4}
                        >
                          <FormControl width={["100%", "23%"]} mb={4}>
                            <FormLabel>Long/Short</FormLabel>
                            <Select
                              placeholder="Select Long/Short"
                              value={row.longShort}
                              onChange={(e) =>
                                handleOptionsRowChange(
                                  index,
                                  "longShort",
                                  e.target.value
                                )
                              }
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            >
                              <option value="Long">Long</option>
                              <option value="Short">Short</option>
                            </Select>
                          </FormControl>

                          <FormControl width={["100%", "23%"]} mb={4}>
                            <FormLabel>Entry Low Range</FormLabel>
                            <Input
                              value={row.enterLowRange}
                              required
                              onChange={(e) =>
                                handleOptionsRowChange(
                                  index,
                                  "enterLowRange",
                                  e.target.value
                                )
                              }
                              type="number"
                              placeholder="Entry Low Range"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            />
                          </FormControl>

                          <FormControl width={["100%", "23%"]} mb={4}>
                            <FormLabel>Entry High Range</FormLabel>
                            <Input
                              value={row.enterHighRange}
                              required
                              onChange={(e) =>
                                handleOptionsRowChange(
                                  index,
                                  "enterHighRange",
                                  e.target.value
                                )
                              }
                              type="number"
                              placeholder="Entry High Range"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            />
                          </FormControl>

                          <FormControl width={["100%", "23%"]} mb={4}>
                            <FormLabel>Stop Loss</FormLabel>
                            <Input
                              value={row.stopLoss}
                              required
                              min="1"
                              onChange={(e) =>
                                handleOptionsRowChange(
                                  index,
                                  "stopLoss",
                                  e.target.value
                                )
                              }
                              type="number"
                              placeholder="Stop Loss"
                              bg="white"
                              _focus={{
                                bg: "white",
                                borderColor: "#244c9c",
                              }}
                            />
                          </FormControl>
                        </Flex>

                        {/* Display Take Profits */}
                        <Grid
                          templateColumns={["1fr", "repeat(3, 1fr)"]} // 1 column on small screens, 3 columns on larger screens
                          gap={6} // spacing between cards
                          mt={4}
                        >
                          {row.takeProfits &&
                            row.takeProfits.map((takeProfit, profitIndex) => (
                              <Box
                                key={profitIndex}
                                bg="blue.50"
                                p={4}
                                borderRadius="md"
                                boxShadow="md"
                                position="relative"
                              >
                                {/* Header for Take Profit with Delete Button */}
                                <Flex
                                  justifyContent="space-between"
                                  alignItems="center"
                                  mb={4}
                                >
                                  <Text fontWeight="bold" color="#244c9c">
                                    Take Profit {profitIndex + 1}
                                  </Text>
                                  <IconButton
                                    icon={<CloseIcon />}
                                    size="sm"
                                    colorScheme="red"
                                    aria-label="Delete Take Profit"
                                    position="absolute"
                                    top={2}
                                    right={2}
                               
                                    onClick={() =>
                                      handleRemoveOptionsTakeProfit(
                                        index,
                                        profitIndex
                                      )
                                    }
                                  />
                                </Flex>

                                {/* Flex Container to Display Take Profit and LOT Fields Side by Side */}
                                <Flex
                                  flexWrap="wrap"
                                  justifyContent="space-between"
                                >
                                  {/* Take Profit Input */}
                                  <FormControl width="45%" mb={4}>
                                    <FormLabel
                                      fontWeight="bold"
                                      color="#244c9c"
                                    >
                                      Take Profit {profitIndex + 1}
                                    </FormLabel>
                                    <Input
                                      value={takeProfit.takeProfit}
                                      required
                                      onChange={(e) =>
                                        handleOptionsTakeProfitChange(
                                          index,
                                          profitIndex,
                                          "takeProfit",
                                          e.target.value
                                        )
                                      }
                                      type="number"
                                      placeholder="Take Profit"
                                      bg="white"
                                      _focus={{
                                        bg: "white",
                                        borderColor: "#244c9c",
                                      }}
                                    />
                                  </FormControl>

                                  {/* Take Profit LOT Input */}
                                  <FormControl width="45%" mb={4}>
                                    <FormLabel
                                      fontWeight="bold"
                                      color="#244c9c"
                                    >
                                      Take Profit {profitIndex + 1} LOT
                                    </FormLabel>
                                    <Input
                                      value={takeProfit.takeProfitLot}
                                      required
                                      onChange={(e) =>
                                        handleOptionsTakeProfitChange(
                                          index,
                                          profitIndex,
                                          "takeProfitLot",
                                          e.target.value
                                        )
                                      }
                                      type="number"
                                      placeholder="Take Profit Lot"
                                      bg="white"
                                      _focus={{
                                        bg: "white",
                                        borderColor: "#244c9c",
                                      }}
                                    />
                                  </FormControl>
                                </Flex>
                              </Box>
                            ))}
                        </Grid>

                        {/* Add Take Profit Button */}
                        <Button
                          colorScheme="blue"
                          onClick={() => addOptionsTakeProfit(index)}
                          mt={4}
                        >
                          Add Options Profits
                        </Button>
                      </Box>
                    ))}

                    {/* Add Option Button */}
                    <Button
                      variant="outline"
                      onClick={addOptionsRow}
                      bg="#244c9c"
                      color="white"
                      _hover={{ bg: "#1e3a5f" }}
                      mt={4}
                    >
                      Add Option
                    </Button>
                  </FormControl>
                )}

                <Button
                  type="submit"
                  colorScheme="blue"
                  mt={4}
                  isLoading={wait}
                >
                  Create Basket
                </Button>
              </Box>
            </form>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
