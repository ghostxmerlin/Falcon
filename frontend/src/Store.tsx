import { useEffect, useState } from 'react';
import './Store.css';
//import cardpng from './assets/card.png';
import logo from './assets/ra.png'; // 确保 logo 图片路径正确
import iconGlobal from "./assets/global-line.png";
import adIcon from './assets/ad-icon.webp'; // 添加广告图标
import Destroyer from './assets/Destroyer.png'
import Cruiser from './assets/Cruiser.png'
import Battleship from './assets/Battleship.png'
import Carrier from './assets/Carrier.png'
import { useGlobalContext } from './GlobalContext'; // 假设 GlobalContext.tsx 在相同目录或合适路径

// eSIM 计划定义
const eSIMs = [
  { id: 1, name: 'Destroyer', data: '1GB', validity: '7 days', price: '5 USD', image: Destroyer },
  { id: 2, name: 'Cruiser', data: '3GB', validity: '30 days', price: '18 USD', image: Cruiser },
  { id: 3, name: 'BattleShip', data: '20GB', validity: '365 days', price: '69 USD', image: Battleship },
  { id: 4, name: 'Carrier', data: '120GB', validity: '365 days', price: '259 USD', image: Carrier },
];

interface StoreProps {
  onStore2pay: () => void;
}

const Store: React.FC<StoreProps> = ({onStore2pay}) => {
  const {
    gTid,
    setgAction,
    setgUid,
    // gIsact,
    // gAddress,
    // gBalance,
    // gIsagent,
    // gRid,
    // gDevid,
  } = useGlobalContext();
  const [tgID, settgID] = useState<string>('Name'); // 默认值为 "Name"
  const [inputValue, setInputValue] = useState<string>('');
  // 通过 telegramWindow 获取用户名
  useEffect(() => {
    settgID(gTid);
  }, []);

  const handleBuyNow = (planType: string) => {
    console.log(`buy plan ${planType}`);
    setgAction(planType);
    if (!inputValue)
      {
        console.log('Input value null')
        setgUid(gTid);
      }    
    else
    {
      console.log(`input value: ${inputValue}`)
      setgUid(inputValue);
    }  
    onStore2pay();
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="store-container">
      {/* Header section with logo, DeSIM.io, and Hello Name */}
      <div className="header-container">
        <div className="left-section">
          <img src={logo} alt="Logo" className="logo" /><a className="header-text">Rebellion</a>
        </div>
        <div className="right-section">
          <span className="hello-text">{tgID}</span> {/* 显示 Telegram 用户名 */}
        </div>
      </div>

      {/* head_rec 矩形背景和广告 */}
      <div className="head-rec">
        <div>
          <div className="ad-title">Data Plas</div>
          <div className="sad-text">
            This the our data plan packages for globally free access. You could choose other eSIM source with our tool's support
          </div>
        </div>
        <img src={adIcon} alt="Ad Icon" className="ad-image" />
      </div>

      <h1 className="title">
        <img src={iconGlobal} alt="Global Icon" className="global-icon" />
        <span className="data-plans-text">Data Plans</span>
      </h1>
      {eSIMs.map(eSIM => (
        <div className="esim-table-container" key={eSIM.id}>
          <table className="esim-table">
            <tbody>
              <tr>
                <td>Global</td>
                <td className="image-cell">
                  <img src={eSIM.image} alt={eSIM.name} className="esim-image" />
                </td>
              </tr>
              <tr>
                <td>Name:</td>
                <td className="right-align">{eSIM.name}</td>
              </tr>
              <tr>
                <td>Data:</td>
                <td className="right-align">{eSIM.data}</td>
              </tr>
              <tr>
                <td>Validity:</td>
                <td className="right-align">{eSIM.validity}</td>
              </tr>
              <tr>
                <td>Price:</td>
                <td className="right-align">{eSIM.price}</td>
              </tr>
              <tr>
                <td>
                  <a href="https://example.com" className="link-button">Global</a>
                </td>
                <td colSpan={1}>
                <input type="text" className="input-textbox" placeholder="Other ID" value={inputValue} onChange={handleInputChange} />
                  <button className="buy-button" onClick={() => handleBuyNow(eSIM.name)}>Buy Now</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Store;
