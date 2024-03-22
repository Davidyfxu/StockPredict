import { Line } from "@ant-design/charts";
import { useEffect, useState } from "react";
import { Button, Divider, Input, Modal, Spin, Typography } from "antd";
import { searchStockPrice } from "./apis";
import { sum, round, isEmpty } from "lodash-es";
const { Search } = Input;
import mockData from "./mock.json";
const Stocks = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [equity, setEquity] = useState("AAPL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setLoading(true);
    setTimeout(() => {
      setIsModalOpen(true);
      setLoading(false);
    }, 1000);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getPrediction = (values = []) =>
    round(sum(values) / values.length + Math.random(), 2);

  const onSearch = (value) => setEquity(value);
  const asyncFetch = async () => {
    try {
      setLoading(true);
      const res = await searchStockPrice(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${equity}&apikey=330NAY2DUDMV67W2`,
      );
      setData(
        Object.keys(res["Time Series (Daily)"])
          .map((k) => ({
            name: "close",
            date: k,
            price: Number(res["Time Series (Daily)"][k]["4. close"]),
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date)),
      );
    } catch (e) {
      console.error("searchStockPrice", e);
      setData(
        Object.keys(mockData["Time Series (Daily)"])
          .map((k) => ({
            name: "close",
            date: k,
            price: Number(mockData["Time Series (Daily)"][k]["4. close"]),
          }))
          .sort((a, b) => new Date(a.date) - new Date(b.date)),
      );
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   void asyncFetch();
  // }, [equity]);

  // const config = {
  //   title: {
  //     visible: true,
  //     text: "The Stock Price",
  //   },
  //   padding: "auto",
  //   forceFit: true,
  //   data,
  //   xField: "date",
  //   yField: "price",
  //   legend: equity,
  //   xAxis: { type: "date" },
  //   yAxis: {
  //     label: {
  //       formatter: (v) =>
  //         `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
  //     },
  //   },
  //   responsive: true,
  // };
  const fakeData = [
    { year: "1991", value: 3 },
    { year: "1992", value: 4 },
    { year: "1993", value: 3.5 },
    { year: "1994", value: 5 },
    { year: "1995", value: 4.9 },
    { year: "1996", value: 6 },
    { year: "1997", value: 7 },
    { year: "1998", value: 9 },
    { year: "1999", value: 13 },
  ];

  const config = {
    data: fakeData,
    height: 400,
    xField: "year",
    yField: "value",
  };

  return (
    <div>
      <Typography.Title>
        Retrieve and Predict the stock historical data
      </Typography.Title>
      <Search
        placeholder={
          "Please input the name of the equity. The sample below is Apple inc.(APPL)"
        }
        size={"large"}
        onSearch={onSearch}
        enterButton
      />
      <Spin spinning={loading}>
        <Divider>
          <Typography.Title level={5}> The Stock of {equity}</Typography.Title>
        </Divider>
        <Line {...config} />
      </Spin>

      <Button
        disabled={isEmpty(data)}
        onClick={showModal}
        block
        danger
        type="primary"
        loading={loading}
      >
        One click to Predict next price
      </Button>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleCancel}
        onCancel={handleCancel}
      >
        Predict the next value is{" "}
        {getPrediction(data.slice(-2).map((d) => d?.price || 0))}
      </Modal>
    </div>
  );
};

export default Stocks;
