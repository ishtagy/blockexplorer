import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";

import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockInfo, setBlockInfo] = useState();
  const [listOfTransaction, setListOfTransactions] = useState();
  const [transactionDetails, setTransactionDetails] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        // Get the latest block number
        const latestBlockNumber = await alchemy.core.getBlockNumber();
        setBlockNumber(latestBlockNumber);

        // Get block information
        const blockData = await alchemy.core.getBlock(latestBlockNumber);
        setBlockInfo(blockData);

        // Get list of transactions
        const blockWithTransactions =
          await alchemy.core.getBlockWithTransactions(latestBlockNumber);
        if (blockWithTransactions.transactions.length > 0) {
          setListOfTransactions(blockWithTransactions.transactions[0].hash);
        }

        // Get details for each transaction

        let details = await alchemy.core.getTransactionReceipt(
          blockWithTransactions.transactions[0].hash
        );

        setTransactionDetails(details);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="App">
      <h1>Block Number {blockNumber} information</h1>;
      {blockInfo ? (
        <>
          <div>Block Hash: {blockInfo.hash}</div>
          <div>Block Parent Hash: {blockInfo.parentHash}</div>
        </>
      ) : (
        <div>Loading block info...</div>
      )}
      {listOfTransaction ? (
        <li>Hash of the first transaction in the block: {listOfTransaction}</li>
      ) : (
        <div>Loading transactions info...</div>
      )}
      {transactionDetails ? (
        <div>
          <p>The first transaction of the block brief information</p>
          <ul>
            <li>to: {transactionDetails.to}</li>
            <li> from: {transactionDetails.from} </li>
            <li> blockNumber: {transactionDetails.blockNumber} </li>
          </ul>
        </div>
      ) : (
        <div>Loading transactions info...</div>
      )}
    </div>
  );
}

export default App;
