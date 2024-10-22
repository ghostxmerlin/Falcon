import React, { useState, Suspense } from 'react';

//import Launch from './Launch'; // 导入 Launch 组件
// import Home from './Home';
// import Payment from './Payment';
// import Action from './Action';
// import Store from './Store';
import './App.css';

import UeSIM from './eSIM';

import { GlobalProvider } from './GlobalContext';
import { useGlobalContext } from './GlobalContext'; // 假设 GlobalContext.tsx 在相同目录或合适路径
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';//, useNavigate
const Launch = React.lazy(() => import('./Launch'));
const Home = React.lazy(() => import('./Home'));
const Payment = React.lazy(() => import('./Payment'));
const Action = React.lazy(() => import('./Action'));
const Store = React.lazy(() => import('./Store'));

import iconStore_Line from './assets/store-line.png';
import iconStore_Fill from './assets/store-fill.png';
import iconSIM_Line from './assets/sim-card-line.png';
import iconSIM_Fill from './assets/sim-card-fill.png';
import iconToken_Line from './assets/money-dollar-circle-line.png';
import iconToken_Fill from './assets/money-dollar-circle-fill.png';
import iconProfile_Line from './assets/profile-line.png';
import iconProfile_Fill from './assets/profile-fill.png';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Launch');
  const [showTabs, setShowTabs] = useState(false);
  const { gAction, setgAction } = useGlobalContext();
  const handlePaymentBack = () => {
    if (gAction === 'Destroyer' || gAction === 'Cruiser' || gAction === 'BattleShip' || gAction === 'Carrier') {
      setActiveTab('eSIM');
    } else {
      setActiveTab('Action');
    }
    setgAction('idle');
    setShowTabs(true);
  };

  const renderContent = () => {
   
    switch (activeTab) {
      case 'Home':
        return <Home />;
      case 'Store':
        return (
          <Suspense fallback={<div>Loading Store...</div>}>
            <Store onStore2pay={() => {
              setActiveTab('Payment');
              setShowTabs(true);
            }} /></Suspense>
        );
      case 'eSIM':
        return (
          <Suspense fallback={<div>Loading eSIM...</div>}>
            <UeSIM />
          </Suspense>
        );
      case 'Action':
        return(
          <Suspense fallback={<div>Loading Action...</div>}>
           <Action onpayforweapon={() => {
              setActiveTab('Payment');
              setShowTabs(true);
            }} />
           </Suspense>
        );
      case 'Payment':
        return (
          <Suspense fallback={<div>Loading Payment...</div>}>
           <Payment onback2page={handlePaymentBack} /></Suspense>
        );
      case 'Launch':
        return <Launch onLaunchComplete={() => {
          setActiveTab('Home');
          setShowTabs(true);
        }} />;
      default:
        return <Home />;
    }
  };

  return (
    <Routes>
      <Route path="/" element={
        <div>
          {renderContent()}
          {showTabs && (
            <div className="tab-container">
              <button onClick={() => setActiveTab('Home')}>
                <div className="tab-icon-container">
                  <img src={activeTab === 'Home' ? iconToken_Fill : iconToken_Line} alt="Token Icon" className="tab-icon" />
                  <span className={activeTab === 'Home' ? 'active-tab' : ''}>Home</span>
                </div>
              </button>
              <button onClick={() => setActiveTab('Store')}>
                <div className="tab-icon-container">
                  <img src={activeTab === 'Store' ? iconStore_Fill : iconStore_Line} alt="Store Icon" className="tab-icon" />
                  <span className={activeTab === 'Store' ? 'active-tab' : ''}>Store</span>
                </div>
              </button>
              <button onClick={() => setActiveTab('eSIM')}>
                <div className="tab-icon-container">
                  <img src={activeTab === 'eSIM' ? iconSIM_Fill : iconSIM_Line} alt="eSIM Icon" className="tab-icon" />
                  <span className={activeTab === 'eSIM' ? 'active-tab' : ''}>eSIM</span>
                </div>
              </button>
              <button onClick={() => setActiveTab('Action')}>
                <div className="tab-icon-container">
                  <img src={activeTab === 'Action' ? iconProfile_Fill : iconProfile_Line} alt="Earn Icon" className="tab-icon" />
                  <span className={activeTab === 'Action' ? 'active-tab' : ''}>Action</span>
                </div>
              </button>
            </div>
          )}
        </div>
      } />
    </Routes>
  );
};

const WrappedApp: React.FC = () => {
  return (
    <GlobalProvider>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      </Router>
    </GlobalProvider>
  );
};

export default WrappedApp;
