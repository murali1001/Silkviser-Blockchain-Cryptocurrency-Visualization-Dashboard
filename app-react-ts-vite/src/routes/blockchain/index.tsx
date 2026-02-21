import { IBlockChain } from '../../shared/types';
import React, { useEffect, useRef, useState } from 'react';
import Ledger from './Ledger';
import { Link } from 'react-router-dom';
import DualAxisChart from '../../shared/components/BlockchainDualChart';
import ToggleButton from '../../shared/components/ToggleButton';
import axios from 'axios';
import CustomDateRangePicker from '../../shared/components/DateRangeFilterDashboard';
import { BeatLoader, PropagateLoader } from 'react-spinners';
import './index.scss'
import silubiumData from '../../../public/silubiumData.json';





function Blockchain() {


  const [blocks1, setBlocks] = useState([]);
  const [blocks, setBlockLedger] = useState([]);
  const [loading, setLoading] = useState(true);


   //  function to convert epoch time to human-readable timestamp
   const convertToTimestamp = (epochTime: number) => {
    const date = new Date(epochTime * 1000);
    const month =  date.toLocaleString('default', { month: 'long' }).substring(0, 3);
    const year = date.getFullYear();
    const formattedDate = `${month} ${year}`;
    return formattedDate;

  };

  useEffect(() => {
    // Function to fetch data from the API
    const fetchData = async () => {
      try {

        const response = await axios.post('http://127.0.0.1:5000/api/get_dual_axis_blockchain'); // API call to Flask server
        const data = response.data;
        console.log(data)
        

        return data;
      } catch (error) {
        console.error('Error fetching data:', error);
        return null;
      }
    };

    const fetchOtherData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/get_block_ledger_data');
        let data = response.data;
        console.log(data);

        const transformData = (data: any[]) => {
          return data.map((item,  index) => {
              // Transform transactions
              const transactions = {
                  completed: item.transactions/70,
                  label: `Transactions: ${item.transactions}`
              };
      
              // Transform blockSize
              const blockSize = {
                  completed: item.blockSize/20000,
                  label: `Block Size: ${item.blockSize} Bytes`
              };
      
              // Transform blockReward
              const blockReward = {
                  completed: item.blockReward/0.08,
                  label: `${item.blockReward} BTC`
              };
      
              // Calculate leftLinkTime
        let leftLinkTime = null;
        if (index > 0) {
            const prevBlockTime = new Date(data[index - 1].time).getTime() / 1000;
            const currBlockTime = new Date(item.time).getTime() / 1000;
            leftLinkTime = currBlockTime - prevBlockTime;
        }

        const formattedBlockHash = `${item.blockHash.substring(0, 5)}...${item.blockHash.substring(item.blockHash.length - 5)}`;
        const formattedPreBlockHash = `${item.preBlockHash.substring(0, 3)}...${item.preBlockHash.substring(item.preBlockHash.length - 3)}`;
        const formattedMerkleRoot = `${item.merkleRoot.substring(0, 4)}...${item.merkleRoot.substring(item.merkleRoot.length - 5)}`;
        const blockHash = `${item.blockHash}`;

        // Return the transformed object
        return {
            ...item,
            blockHash: formattedBlockHash,
            preBlockHash: formattedPreBlockHash,
            merkleRoot: formattedMerkleRoot,
            originalBlockHash: blockHash,
            transactions,
            blockSize,
            blockReward,
            leftLinkTime
        };
    });
  }
      

      const sortedData = data.sort((a: { blockHeight: number; }, b: { blockHeight: number; }) => a.blockHeight - b.blockHeight);

      data = transformData(sortedData);
      console.log(data);
        return data;
      } catch (error) {
        console.error('Error fetching other data:', error);
        return null;
      }
    };

    // Call both API functions simultaneously
    Promise.all([fetchData(), fetchOtherData()])
      .then(([blockData, otherData]) => {
        if (blockData && otherData) {
          console.log(blockData);
          console.log(otherData);
          setBlocks(blockData);
          setBlockLedger(otherData);
          setLoading(false); // Set loading state to false after fetching data
        } else {
          console.error('Failed to fetch data');
        }
      });
  }, []);




  // Render Ledger and DualAxisChart components only if blockData is available and loading state is false
  if (blocks1.length > 0 && !loading) {
    // Delay rendering of Ledger and DualAxisChart components by 3 seconds
    setTimeout(() => {
      // Set loading state to false after 3 seconds to render the components
      setLoading(false);
    }, 0);

      // Convert epoch time to human-readable timestamp
      const humanTimestamp = convertToTimestamp(1713744090);

      // Output human-readable timestamp
      console.log('Human-readable timestamp:', humanTimestamp);
  }


  const [isToggleOn, setIsToggleOn] = useState(false);

  function handleToggle(tOn: boolean) {
    setIsToggleOn(tOn);
  }

  return (
    <>
      {loading ? (<> <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '75vh' }}>
          <h1>Loading Blockchain Page</h1>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '0vh' }}>
          <PropagateLoader color="#4c80c1" size={40} />
        </div></>) : (
         <>
         <Ledger blockChain={blocks} />
         <div style={{paddingTop: '60px'}}>
         <CustomDateRangePicker data={isToggleOn ? silubiumData : blocks1} handleToggle={(t) => handleToggle(t)} />
         </div>
   
         {/* <div style={{marginTop: '400px'}}> */}
         {/* <Link to="/block">Link to Block</Link>
         <br/> */}
         {/* <Link to="/address">Link to Address Page</Link>
         <br/>
         <Link to="/transaction">Link to Transaction Page</Link>
         </div> */}
       </>
      )}
    </>
  );


}

export default Blockchain;