import React from "react";
import { ButtonGroup, Button } from "@chakra-ui/react";

const ToggleButtonGroup = ({ options, selected, onSelect }) => {
  return (
    <ButtonGroup isAttached variant="outline" mb={4}>
      {options.map((option) => (
        <Button
          key={option.value}
          colorScheme={selected === option.value ? "blue" : "gray"}
          onClick={() => onSelect(option.value)}
          flex="1"
        >
          {option.label}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default ToggleButtonGroup;
