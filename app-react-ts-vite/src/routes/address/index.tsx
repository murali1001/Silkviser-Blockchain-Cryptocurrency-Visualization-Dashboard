import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { IAddress, IAddressTableRow } from '../../shared/types';

import DualAxisChart from './../../shared/components/DualAxisChart';
import KeyValueTable from '../../shared/components/InformationComponent';
import Table from '../../shared/components/AddressTable';
import { formatDate } from '../../shared/utils/utils';

function AddressPage() {
  const { addressHash } = useParams();
  console.log(addressHash);
  const navigate = useNavigate();

  if (!addressHash) navigate('/');

  const [addressData, setAddressData] = useState<IAddress | null>(null);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Array<IAddressTableRow>>();
  useEffect(() => {
    const fetchAddressData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/address/${addressHash}`
        );
        console.log(response);
        setAddressData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching address data:', error);
        setLoading(false);
        navigate('/');
      }
    };
    fetchAddressData();
  }, []);

  useEffect(() => {
    if (addressData) {
      const r: IAddressTableRow[] = addressData.txs.map((tx) => ({
        txhash: tx.hash,
        inaddr: tx.inputs.length,
        outaddr: tx.outputs.length,
        id: tx.hash,
        txtime: formatDate(tx.confirmed),
        confirmations: tx.confirmations,
      }));
      setRows(r);
    }
  }, [addressData]);

  return (
    <>
      {!loading && addressData ? (
        <>
          <KeyValueTable
            data={{
              'Address Hash': addressData.address,
              'Address Balance': `${addressData.balance / 100000000} BTC`,
              'Total Transactions': `${addressData.n_tx}`,
            }}
            title="Address Information"
          />
          {/* <div style={{position: 'absolute',  left: '50%', transform: 'translateX(-50%)'}}> */}
          {/* <h6 style={{ paddingLeft: '72px', color: '#4086ce' }}>
            Address Information Visualization
          </h6>
          <DualAxisChart /> */}
          {/* </div> */}
          <div style={{ paddingTop: '100px' }}>
            <h6 style={{ paddingLeft: '72px', color: '#4086ce' }}>
              Recent Transactions
            </h6>
            <Table rows={rows} />
          </div>
        </>
      ) : null}
    </>
  );
}

export default AddressPage;
