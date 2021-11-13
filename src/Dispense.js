import React from "react";
import { useDataQuery } from "@dhis2/app-runtime";
import { Card, CircularLoader, Input, Button } from "@dhis2/ui";
import "./Styles.css";
import mockData from "./mock-data";

const DATASET_ID = "ULowA8V3ucd"; // Life-saving commodities
const ORGANISATION_UNIT_ID = "ImspTQPwCqd"; // Sierra Leone

const dataQuery = {
  commodities: {
    resource: "dataSets",
    id: DATASET_ID,
    params: {
      fields: ["name", "id", "dataSetElements[dataElement[displayName, id]]"],
    },
  },
};

export const Dispense = () => {
  const data = mockData;

  // const { loading, error, data } = useDataQuery(dataQuery);

  /*
  if (error) {
    return <span>ERROR: {error.message}</span>;
  }

  if (loading) {
    return <CircularLoader large />;
  }
  */

  if (data) {
    const cards = data[0].commodities.map((commodity) => (
      <CommodityCard
        name={commodity.displayName}
        id={commodity.id}
        key={commodity.id}
      ></CommodityCard>
    ));

    return (
      <div className='dispense-container'>
        <div>
          <div className='dispense-header'>
            <div className='header-label'>Dispense</div>
          </div>
          <div className='cards-container'>{cards}</div>
        </div>
        <Basket />
      </div>
    );
  }
};

const Basket = (props) => {
  return (
    <div className='basket-container'>
      <div className='basket-header'>
        <div className='header-label'>Basket</div>
        <Button destructive disabled>
          Clear
        </Button>
      </div>
      <div className='basket'>
        <div className='basket-items'>
          <div className='basket-item'>
            {/* <div className='basket-delete-icon'>&#215;</div> */}
            <div className='basket-delete-icon'>&#215;</div>
            <div className='basket-item-name'>Antenatal Corticosteroids</div>
            <div className='basket-item-count'>420</div>
          </div>
          <div className='basket-item'>
            <div className='basket-delete-icon'>&#215;</div>
            <div className='basket-item-name'>Antenatal Corticosteroids</div>
            <div className='basket-item-count'>420</div>
          </div>
        </div>
        <div className='basket-checkout'>
          <Input placeholder='Recipient' />
          <Button primary>Dispense</Button>
        </div>
      </div>
    </div>
  );
};

const CommodityCard = (props) => {
  return (
    <div className='commodity-card'>
      <div>
        <div className='card-label'>{props.name}</div>
        <div className='stock-count'>
          <span>420 available</span>
        </div>
      </div>
      <OrderForm available='100' />
    </div>
  );
};

const OrderForm = (props) => {
  return (
    <div className='order-form'>
      <Input type='number' step='1' min='0' max={props.available} />
      <Button type='button'>Add</Button>
    </div>
  );
};
