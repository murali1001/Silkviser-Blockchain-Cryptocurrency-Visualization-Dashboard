import SankeyDiagram from '../../shared/components/Sankey';
import KeyValueTable from '../../shared/components/InformationComponent';
import InputOutputComponent from '../../shared/components/InputOutputComponent';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

var blockhash: any;

var resdata: { txHash: any; blockhash: any; };

interface AddressItem {
  address: string;
  amount: number;
}

function Transaction() {
  const { txHash } = useParams<{ txHash: string }>();
  const [blockHash, setBlockHash]  = useState();
  const [txTime, settxTime]  = useState();
  const [size, setsize]  = useState();
  const [confirmations, setconfirmations]  = useState();
  const [txFees, settxFees]  = useState<number>(0);
  const [inputAddresses, setInputAddresses] = useState<AddressItem[]>([]);
  const [outputAddresses, setOutputAddresses] = useState<AddressItem[]>([]);

  const [data, setData] = useState();

  console.log(txHash);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataToSend = {
          txHash: txHash
        };
        //const response = await axios.post('http://127.0.0.1:5000/api/getrawtransaction',dataToSend); // API call to Flask server
        const response = await axios.get(
          `http://127.0.0.1:5000/api/gettxdata/${txHash}`
        );
        console.log("<---------->");
        console.log(response);
        const data = response.data;
        return data;
      } catch (error) {
        console.error('Error fetching data:', error);
        return null;
      }
    };
    fetchData().then(TxData => {

      console.log(TxData);
      let inputAddresses;
      let outputAddresses;
      if(TxData.inputs !== null){
        inputAddresses = TxData.inputs.flatMap((input: any) => {
          if (input.addresses !== null && Array.isArray(input.addresses)) {
              return input.addresses.map((address: string | null) => ({
                  address: address !== null ? address : null,
                  amount: input.output_value / 100000000 
              }));
          } else {
              return [{
                  address: "No Address hash",
                  amount: input.output_value / 100000000
              }];
          }
      });
      }

      if(TxData.outputs !== null){

        outputAddresses = TxData.outputs.flatMap((output: any) => {
          if (output.addresses !== null && Array.isArray(output.addresses)) {
              return output.addresses.map((address: string) => ({
                  address,
                  amount: output.value / 100000000 
              }));
          } else {
              return [{
                  address: "No Address hash",
                  amount: output.value / 100000000
              }];
          }
      });
    }

      console.log(inputAddresses);
      setInputAddresses(inputAddresses);
      setOutputAddresses(outputAddresses);

      blockhash = TxData.block_hash;
      setData(TxData);
      setBlockHash(blockhash)
      settxTime(TxData.received)
      setsize(TxData.size)
      setconfirmations(TxData.confirmations)
      settxFees(TxData.fees/100000000)
    });
  }, [txHash, blockHash,txTime]);
  if (!blockHash) {
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
    {/* <div style={{width: '1705px', marginLeft: '-7px'}}> */}
    <KeyValueTable data={{ 'Transaction Hash': txHash, 'Block Hash': blockHash, 'Transaction Time': txTime, 'Transaction Size': size, 'Confirmations': confirmations, 'Transaction Fee': txFees+' BTC' }} title="Transaction Information" />
    {/* </div> */}
    <h6 style={{ paddingLeft: '75px', color: '#4086ce'}}>Visualization of Inputs and Outputs</h6>
    <div style={{paddingTop : '30px', paddingLeft: '110px', paddingBottom: '0px'}}>
    <SankeyDiagram/>
    </div>
    <h6 style={{ paddingLeft: '98px', color: '#4086ce'}}>List of Inputs and Outputs</h6>
    <InputOutputComponent inputAddresses={inputAddresses} outputAddresses={outputAddresses}/>
    </>
    )
}

export default Transaction;