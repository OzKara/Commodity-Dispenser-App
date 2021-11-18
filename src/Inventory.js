import React, { useState, useEffect, useRef } from "react";
import { useDataQuery, useDataMutation } from "@dhis2/app-runtime";
import Select from "react-select";
import {
  Card,
  CircularLoader,
  Input,
  Button,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableRowHead,
  TableCellHead,
  TableBody,
} from "@dhis2/ui";
import "./Styles.css";
import mockData from "./mock-data";
import * as Utils from "./Utils";

export const Inventory = () => {
  const [stockLevels, setStockLevels] = useState(mockData);

  const onBalanceChange = (id, newBalance) => {
    const newStockLevels = [...stockLevels];
    const indexToUpdate = newStockLevels.findIndex((v) => v.id === id);
    newStockLevels[indexToUpdate].newBalance = parseInt(newBalance);

    setStockLevels(newStockLevels);
  };

  const reset = () => {
    const newStockLevels = [...stockLevels];
    newStockLevels.forEach((c) => (c.newBalance = c.endBalance));
    setStockLevels(newStockLevels);
  };

  const isModified = () => {
    return stockLevels.find((c) => c.newBalance !== c.endBalance) !== undefined;
  };

  const tableRows = stockLevels.map((commodity) => {
    return (
      <Row
        id={commodity.id}
        displayName={commodity.displayName}
        endBalance={commodity.endBalance}
        newBalance={commodity.newBalance}
        key={commodity.id}
        onBalanceChange={onBalanceChange}
      />
    );
  });

  return (
    <div className='main-container'>
      <div className='main-header'>
        <div className='header-label'>Manage inventory</div>
        <DiscardChanges reset={reset} isModified={isModified} />
      </div>
      <div className='inventory-table-container'>
        <Table className="inventory-table">
          <TableHead>
            <TableRowHead>
              <TableCellHead>Commodities</TableCellHead>
              <TableCellHead>Current balance</TableCellHead>
              <TableCellHead>Adjusted balance</TableCellHead>
            </TableRowHead>
          </TableHead>
          <TableBody>{tableRows}</TableBody>
        </Table>
      </div>
      <div className='main-footer'>
        <SaveChanges />
      </div>
    </div>
  );
};

const BalanceInput = (props) => {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    if (e.target.value !== props.newBalance) {
      props.onBalanceChange(props.id, e.target.value);
    }
  };

  useEffect(() => {
    if (inputRef.current.value !== props.newBalance) {
      inputRef.current.value = props.newBalance;
    }
  });

  return (
    <input
      className='balance-input'
      onBlur={handleChange}
      ref={inputRef}
      type='number'
    />
  );
};

const Row = (props) => {
  const className = props.endBalance !== props.newBalance ? "modified" : "";

  return (
    <TableRow key={props.id} className={className}>
      <TableCell>{props.displayName}</TableCell>
      <TableCell>{props.endBalance}</TableCell>
      <TableCell>
        <BalanceInput
          id={props.id}
          newBalance={props.newBalance}
          onBalanceChange={props.onBalanceChange}
        />
      </TableCell>
    </TableRow>
  );
};

const SaveChanges = (props) => {
  const options = [
    { value: "Shrinkage", label: "Shrinkage" },
    { value: "Network outage", label: "Network outage" },
    { value: "Expiration", label: "Expiration" },
    { value: "Incoming supplies", label: "Incoming supplies" },
    { value: "Other", label: "Other" },
  ];

  return (
    <div className='header-ui-container'>
      <Select
        options={options}
        placeholder='Select reason…'
        menuPlacement='auto'
      />
      <Button primary onClick={props.saveChanges}>
        Save
      </Button>
    </div>
  );
};

const DiscardChanges = (props) => {
  return (
    <Button destructive onClick={props.reset} disabled={!props.isModified()}>
      Discard changes
    </Button>
  );
};
