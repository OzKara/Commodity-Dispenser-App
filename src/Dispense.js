import React, { useState, useEffect, useRef } from "react";
import { useDataQuery, useDataMutation } from "@dhis2/app-runtime";
import { Card, CircularLoader, Input, Button } from "@dhis2/ui";
import Select from 'react-select';
import "./Styles.css";
import mockData from "./mock-data";
import * as Utils from "./Utils";

export const Dispense = () => {
  const { loading, error, data, refetch } = useDataQuery(
    Utils.commoditiesQuery
  );
  const [dispenseQuery] = useDataMutation(Utils.dispenseMutationQuery);
  const [transactionLogQuery] = useDataMutation(
    Utils.mutateTransactionLogQuery(
      Utils.DATASTORE_NAMESPACE,
      Utils.DATASTORE_KEY
    )
  );
  const [commodities, setCommodities] = useState([]);
  const [searchString, setSearchString] = useState({value: '', name: 'defaultName'});
  const [selectedGroups, setSelectedGroups] = useState([
    {
        "label": "Child Health",
        "value": "KJKWrWBcJdf"
    },
    {
        "label": "Maternal Health",
        "value": "idD1wcvBISQ"
    },
    {
        "label": "Newborn Health",
        "value": "rioWDAi1S7z"
    },
    {
        "label": "Reproductive Health",
        "value": "IyIa0h8CbCZ"
    }
]);
 
  useEffect(() => {
    if (data) {
      setCommodities(Utils.createStateFromData(data));
    }
  }, [data]);

  const updateBasketAmount = (id, newBasketAmount) => {
    const updatedCommodities = [...commodities];
    const indexToUpdate = updatedCommodities.findIndex(
      (commodity) => commodity.id === id
    );
    updatedCommodities[indexToUpdate].inBasket = newBasketAmount;

    setCommodities(updatedCommodities);
  };

  const isEmpty = () => {
    return commodities.find((c) => c.inBasket > 0) === undefined;
  };

  const dispenseBasket = (recipient) => {
    const updatedCommodities = [...commodities];
    const dataValues = [];
    const transaction = [];

    updatedCommodities.forEach((commodity) => {
      if (commodity.inBasket > 0) {
        const newBalance = commodity.endBalance - commodity.inBasket;
        dataValues.push({
          dataElement: commodity.id,
          categoryOptionCombo: Utils.COC_END_BALANCE,
          value: commodity.endBalance - commodity.inBasket,
        });
        transaction.push({
          dataElement: commodity.id,
          displayName: commodity.displayName,
          dispensed: commodity.inBasket,
          newBalance: newBalance,
        });

        commodity.endBalance = newBalance;
        commodity.inBasket = 0;
      }
    });
    console.log(dataValues);
    dispenseQuery({ dispensedCommodities: dataValues });
    setCommodities(updatedCommodities);

    // Log transaction
    let newTransactionLog = Utils.appendTransactionLog({
      transactionLog: data.dataStoreData,
      dispensedBy: data.me.name,
      dispensedTo: recipient,
      transactionItems: transaction,
      date: new Date(),
      transactionType: "Dispense",
    });
    transactionLogQuery(newTransactionLog);
  };

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <CircularLoader large />;
  }

  if (data) {
    let commodityGroupsOptions = Utils.commodityGroups(data.commodityCategories.dataElementGroups)
    const cards = Utils.filterCards(commodities, searchString, selectedGroups,data.commodityCategories.dataElementGroups).map((commodity) => (
      <CommodityCard
        name={commodity.displayName}
        key={commodity.id}
        id={commodity.id}
        balance={commodity.endBalance}
        inBasket={commodity.inBasket}
        updateBasketAmount={updateBasketAmount}
      ></CommodityCard>
    ));

    return (
      <React.Fragment>
        <div className="main-container">
          <div className="main-header">
            <div className="header-label">Commodities</div>
          </div>
          <div>
            <div className="filter-box">
            <Input 
              name="defaultName"
              type="text"
              placeholder="Filter"
              onChange={setSearchString} 
            />
            </div>
            <div className="filter-group-options">
            <Select 
              options={commodityGroupsOptions} 
              isMulti={true} 
              onChange={setSelectedGroups}
              defaultValue={selectedGroups}
            />
            </div>
          </div>
          
          <div className="cards-container">{cards}</div>
        </div>
        <Basket
          commodities={commodities}
          updateBasketAmount={updateBasketAmount}
          dispenseBasket={dispenseBasket}
          isEmpty={isEmpty}
        />
      </React.Fragment>
    );
  }
};

const CommodityCard = (props) => {
  return (
    <div className="commodity-card">
      <div className="card-label">{props.name}</div>
      <BasketAdder
        id={props.id}
        balance={props.balance}
        inBasket={props.inBasket}
        updateBasketAmount={props.updateBasketAmount}
      />
    </div>
  );
};

const BasketAdder = (props) => {
  const inputRef = useRef(null);

  const incrementDisabled = () => props.balance - props.inBasket <= 0;
  const decrementDisabled = () => props.inBasket <= 0;
  const inputDisabled = () => props.balance <= 0;

  const increment = () => {
    props.updateBasketAmount(props.id, props.inBasket + 1);
  };

  const decrement = () => {
    props.updateBasketAmount(props.id, props.inBasket - 1);
  };

  const handleChange = (e) => {
    if (e.target.value !== props.inBasket) {
      props.updateBasketAmount(props.id, parseInt(e.target.value));
    }
  };

  useEffect(() => {
    if (inputRef.current.value !== props.inBasket) {
      inputRef.current.value = props.inBasket;
    }
  });

  return (
    <div className="basket-adder-container">
      <StockCount balance={props.balance - props.inBasket} />
      <div className="basket-adder">
        <button
          className="decrement"
          onClick={decrement}
          disabled={decrementDisabled()}
        >
          &ndash;
        </button>
        <input
          className="basket-amount"
          onBlur={handleChange}
          ref={inputRef}
          type="number"
          disabled={inputDisabled()}
        ></input>
        <button
          className="increment"
          onClick={increment}
          disabled={incrementDisabled()}
        >
          +
        </button>
      </div>
    </div>
  );
};

const StockCount = (props) => {
  let className = "stock-count ";

  if (props.balance >= 100) {
    className += "high";
  } else if (props.balance >= 50) {
    className += "low";
  } else if (props.balance > 0) {
    className += "critical";
  } else {
    className += "no-stock";
  }

  return <div className={className}>{props.balance} in stock</div>;
};

const Basket = (props) => {
  const basketItems = props.commodities.map((commodity) => {
    if (commodity.inBasket > 0) {
      return (
        <BasketItem
          id={commodity.id}
          key={commodity.id}
          name={commodity.displayName}
          amount={commodity.inBasket}
          updateBasketAmount={props.updateBasketAmount}
        />
      );
    }
  });

  const clearBasket = () => {
    props.commodities.forEach((commodity) =>
      props.updateBasketAmount(commodity.id, 0)
    );
  };

  return (
    <div className="basket-container">
      <div className="basket-header">
        <div className="header-label">Basket</div>
        <Button destructive disabled={props.isEmpty()} onClick={clearBasket}>
          Clear
        </Button>
      </div>
      <div className="basket">
        <div className="basket-items">{basketItems}</div>
        <BasketCheckout
          dispenseBasket={props.dispenseBasket}
          isEmpty={props.isEmpty}
        />
      </div>
    </div>
  );
};

const BasketItem = (props) => {
  const removeItem = () => {
    props.updateBasketAmount(props.id, 0);
  };
  return (
    <div className="basket-item">
      <div className="basket-delete-icon" onClick={removeItem}>
        &#215;
      </div>
      <div className="basket-item-name">{props.name}</div>
      <div className="basket-item-count">{props.amount}</div>
    </div>
  );
};

const BasketCheckout = (props) => {
  const [recipient, setRecipient] = useState("");
  return (
    <div className="basket-checkout">
      <Input
        name="input"
        placeholder="Recipient"
        value={recipient}
        onChange={(e) => setRecipient(e.value)}
      />
      <Button
        disabled={props.isEmpty() || recipient === ""}
        onClick={() => props.dispenseBasket(recipient)}
      >
        Dispense
      </Button>
    </div>
  );
};
