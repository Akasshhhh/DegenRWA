import { useState } from 'react';
import './App.css';
import MainMint from './components/MainMint';
import NavBar from './components/NavBar';

function App() {
  const [accounts, setAccounts] = useState([])
  const [isMainMintSelected,setIsMainMintSelected] = useState("MainMint")
  return (
    <>
      <div className='overlay'>
        <div className="App">
          <NavBar accounts={accounts} setAccounts={setAccounts} isMainMintSelected={isMainMintSelected} setIsMainMintSelected={setIsMainMintSelected} />
          <MainMint accounts={accounts} setAccounts={setAccounts} isMainMintSelected={isMainMintSelected} setIsMainMintSelected={setIsMainMintSelected} />
        </div>
        <video width="100%" height="100%" className='moving-bg'>
        </video>
      </div>
    </>
  );
}

export default App;
