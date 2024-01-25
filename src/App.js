import { useState } from 'react';
import './App.css';
import MainMint from './MainMint';
import NavBar from './NavBar';

function App() {
  const [accounts, setAccounts] = useState([])
  return (
    <>
    <div className='overlay'>
    <div className="App">
      <NavBar accounts={accounts} setAccounts={setAccounts} />
      <MainMint accounts={accounts} setAccounts={setAccounts} />
    </div>
    <video width="100%" height="100%" className='moving-bg'></video>
    </div>
    </>
  );
}

export default App;
