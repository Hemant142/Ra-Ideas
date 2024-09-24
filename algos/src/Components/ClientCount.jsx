import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClientData } from "../Redux/basketReducer/action";
import { Text, useColorModeValue } from "@chakra-ui/react";
import Cookies from "cookies-js";

const ClientCount = ({ basketId }) => {
  const [clientCount, setClientCount] = useState(0);
  const token = Cookies.get("login_token_zetaMoney");
  const dispatch = useDispatch();
  const clientList = useSelector((store) => store.clientsReducer.clients);
  const textColor = useColorModeValue("gray.700", "gray.200");
// console.log(clientList,"clientList")
  useEffect(() => {
    const getClients = async () => {
      const clientsDataArray = await dispatch(fetchClientData(basketId, token));
console.log(clientsDataArray,"clientsDataArray")
      // Flatten the array if multiple responses (in case basketId is an array)
      const allActiveClientIds = clientsDataArray.flat().filter(client => client.isActive).map((client) => client.clientId);

      // Compare activeClientIds with the clientList from Redux
      const matchedClients = clientList.filter((client) =>
        allActiveClientIds.includes(client._id)
      );

    //   console.log(matchedClients,"matchedClients")
      // Set the matched client count
      setClientCount(matchedClients.length);
    };

    getClients();
  }, [basketId, clientList, token, dispatch]);

  return (
    <Text fontSize="sm" color={textColor}>
      <strong>Clients:</strong> {clientCount}
    </Text>
  );
};

export default ClientCount;
