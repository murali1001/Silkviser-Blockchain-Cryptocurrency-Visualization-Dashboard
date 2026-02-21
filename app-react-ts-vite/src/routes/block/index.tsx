import AddressesHistogram from '../../shared/components/AddressesHistogram';
import TxFeeHistogram from '../../shared/components/TxFeeHistogram';
import TxSizeHistogram from '../../shared/components/TxSizeHistogram';
import StickyHeadTable from './../../shared/components/Table';
import CoinGlyphGroup from './CoinGlyphGroup';
// import { ITransactionList } from '../../shared/types';
import KeyValueTable from '../../shared/components/BlockInformationComponent';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function BlockPage() {
  const [blockData, setBlockData] = useState<any>(null);
  const [topTransactions, setTopTransactions] = useState<any[]>([]);
  const [selectedTransactions, setSelectedTransactions] = useState<any[]>([]); // State for selected transactions
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  let blockHash = searchParams.get('hash');
  const height = searchParams.get('height');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (height) {
          const response = await axios.get(
            `https://api.blockcypher.com/v1/btc/main/blocks/${height}`
          );
          blockHash = response.data.hash;
        }
        if (!blockHash) throw new Error('Error fetching data');
        const [blockResponse, topTransactionsResponse] = await Promise.all([
          axios.get(
            `http://127.0.0.1:5000/api/get_block_page?blockHash=${blockHash}`
          ),
          fetchTopTransactions(blockHash)
        ]);

        const blockData = blockResponse.data;
        console.log(blockData);

        const transformedData = {
          'Block Height': blockData.blockHeight,
          'Block Hash': blockData.blockHash,
          'Block Time': blockData.time,
          Confirmation: blockData.confirmation,
          'Block Size': blockData.blockSize,
          'Block Subsidy': blockData.blockSubsidy,
          'Block Transaction Fee': blockData.blockFee,
        };

        setBlockData(transformedData);
        setTopTransactions(topTransactionsResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // Set loading state to false whether successful or not
      }
    };

    fetchData();
  }, [blockHash]);

  const fetchTopTransactions = async (blockHash: string | undefined) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/top_transactions/${blockHash}`
      );
      const transactions = response.data;
      console.log(transactions);
      return transactions;
    } catch (error) {
      console.error('Error fetching top transactions:', error);
      return [];
    }
  };


  if (loading) {
    // Return a loading indicator until data is fetched
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <>
      <KeyValueTable data={[blockData]} title="Block Information" />
      <CoinGlyphGroup transactions={selectedTransactions.length > 0 ? selectedTransactions : topTransactions} />
      <h6
        style={{ paddingLeft: '70px', color: '#4086ce', paddingBottom: '15px' }}
      >
        Visualization of Block Transactions
      </h6>

      <div
        id="blockcharts"
        style={{
          display: 'flex',
          justifyContent: 'center',
          maxWidth: '98%',
          paddingLeft: '50px',
        }}
      >
        <AddressesHistogram transactions={topTransactions} onSelectTransactions={setSelectedTransactions} />
        <TxSizeHistogram transactions={topTransactions} onSelectTransactions={setSelectedTransactions} />
        <TxFeeHistogram transactions={topTransactions} onSelectTransactions={setSelectedTransactions}/>
      </div>
      {/* <div id="table-container" style={{ width:'90%', position: 'absolute', top: '100%', left: '50%', transform: 'translate(-50%, -50%)'}}> */}
      {/* <div style={{ position: 'absolute', top: '15px', left: '0', paddingLeft: '86px', color: '#4086ce' }}>
      </div> */}
      <h6 style={{ paddingLeft: '70px', color: '#4086ce' }}>
        List of Block Transactions
      </h6>

      <StickyHeadTable rows={selectedTransactions.length > 0 ? selectedTransactions : topTransactions} />
      {/* </div> */}
    </>
  );
}

export default BlockPage;
