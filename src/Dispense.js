import React, { useState, useEffect, useRef } from "react";
import { useDataQuery, useDataMutation } from "@dhis2/app-runtime";
import { Card, CircularLoader, Input, Button } from "@dhis2/ui";
import "./Styles.css";
import * as Utils from "./Utils";

export const Dispense = () => {
  const { loading, error, data, refetch } = useDataQuery(
    Utils.commoditiesQuery
  );

  const [dispenseQuery] = useDataMutation(Utils.dispenseMutationQuery);

  const [commodities, setCommodities] = useState([]);

  useEffect(() => {
    if (data) {
      console.log(data);
      setCommodities(Utils.createStateFromData(data));
    }
  });

  const updateBasketAmount = (id, newBasketAmount) => {
    const updatedCommodities = [...commodities];
    const indexToUpdate = updatedCommodities.findIndex(
      (commodity) => commodity.id === id
    );
    updatedCommodities[indexToUpdate].inBasket = newBasketAmount;

    setCommodities(updatedCommodities);
  };

  const dispenseBasket = () => {
    const updatedCommodities = [...commodities];
    const dataValues = [];

    updatedCommodities.forEach((commodity) => {
      if (commodity.inBasket > 0) {
        dataValues.push({
          dataElement: commodity.id,
          categoryOptionCombo: Utils.COC_END_BALANCE,
          value: commodity.endBalance - commodity.inBasket,
        });

        commodity.endBalance -= commodity.inBasket;
        commodity.inBasket = 0;
      }
    });

    dispenseQuery({ dispensedCommodities: dataValues });
    setCommodities(updatedCommodities);
  };

  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <CircularLoader large />;
  }

  if (data) {
    const cards = commodities.map((commodity) => (
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
        <div className='dispense-container'>
          <div className='dispense-header'>
            <div className='header-label'>Commodities</div>
          </div>
          <div className='cards-container'>{cards}</div>
        </div>
        <Basket
          commodities={commodities}
          updateBasketAmount={updateBasketAmount}
          dispenseBasket={dispenseBasket}
        />
      </React.Fragment>
    );
  }
};

const CommodityCard = (props) => {
  return (
    <div className='commodity-card'>
      <div className='card-label'>{props.name}</div>
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
    <div className='basket-adder-container'>
      <StockCount balance={props.balance - props.inBasket} />
      <div className='basket-adder'>
        <button
          className='decrement'
          onClick={decrement}
          disabled={decrementDisabled()}
        >
          &ndash;
        </button>
        <input
          className='basket-amount'
          onBlur={handleChange}
          ref={inputRef}
          type='number'
          disabled={inputDisabled()}
        ></input>
        <button
          className='increment'
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

  const isEmpty = () => {
    return props.commodities.find((c) => c.inBasket > 0) === undefined;
  };

  return (
    <div className='basket-container'>
      <div className='basket-header'>
        <div className='header-label'>Basket</div>
        <Button destructive disabled={isEmpty()} onClick={clearBasket}>
          Clear
        </Button>
      </div>
      <div className='basket'>
        <div className='basket-items'>{basketItems}</div>
        <BasketCheckout dispenseBasket={props.dispenseBasket} />
      </div>
    </div>
  );
};

const BasketItem = (props) => {
  const removeItem = () => {
    props.updateBasketAmount(props.id, 0);
  };
  return (
    <div className='basket-item'>
      <div className='basket-delete-icon' onClick={removeItem}>
        &#215;
      </div>
      <div className='basket-item-name'>{props.name}</div>
      <div className='basket-item-count'>{props.amount}</div>
    </div>
  );
};

const BasketCheckout = (props) => {
  return (
    <div className='basket-checkout'>
      <Input placeholder='Recipient' />
      <Button primary onClick={props.dispenseBasket}>
        Dispense
      </Button>
    </div>
  );
};
