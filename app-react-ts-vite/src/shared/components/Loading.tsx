import { PropagateLoader } from 'react-spinners';

function Loading() {
  return (
    <>
      {' '}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '75vh',
        }}
      >
        <h1>Loading</h1>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '0vh',
        }}
      >
        <PropagateLoader color="#4c80c1" size={40} />
      </div>
    </>
  );
}

export default Loading;
