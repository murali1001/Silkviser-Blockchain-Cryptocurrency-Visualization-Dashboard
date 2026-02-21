import React, { useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const Searchbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>();
  const [searchParam, setSearchParam] = useState<string>('height');

  const navigate = useNavigate();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        maxWidth: '1537px',
        margin: '0 auto',
        paddingTop: '80px',
      }}
    >
      <div style={{ width: '100%' }}>
        <div>
          <span
            style={{ color: '#4086ce', fontWeight: '500', fontSize: '16px' }}
          >
            Welcome to the Bitcoin blockchain
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: '7px',
            padding: '-10px',
          }}
        >
          <div
            style={{
              backgroundColor: '#3982c6',
              textAlign: 'center',
              fontSize: '10px',
            }}
          >
            <select
              className="form-select"
              style={{ borderRadius: 0 }}
              value={searchParam}
              onChange={(e) => setSearchParam(e.target.value)}
            >
              <option value="height">Block Height</option>
              <option value="hash">Block Hash</option>
              <option value="transaction">Transaction</option>
              <option value="address">Address</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Block Height or Block Hash or Transaction Hash or Address"
            style={{
              flex: 1,
              padding: '2px',
              border: '1px solid #ced4da',
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              width: '100%',
              height: '38px',
            }}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            style={{
              backgroundColor: '#3982c6',
              border: '1px solid #ced4da',
              color: '#fff',
              padding: '6px 12px',
              borderTopRightRadius: '5px',
              borderBottomRightRadius: '5px',
              cursor: 'pointer',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              height: '38px',
            }}
          >
            <BsSearch
              size={16}
              onClick={() => {
                if (searchParam === 'hash') {
                  navigate(`/block?hash=${searchQuery}`);
                } else if (searchParam === 'transaction') {
                  navigate(`/transaction/${searchQuery}`);
                } else if (searchParam === 'address') {
                  navigate(`/address/${searchQuery}`);
                } else if (searchParam === 'height') {
                  navigate(`/block?height=${searchQuery}`);
                }
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
