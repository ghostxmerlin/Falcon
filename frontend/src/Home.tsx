import './Home.css';
import { useEffect, useState } from 'react';
import cardH from './assets/cardH2.png';
import ship1 from './assets/ship1.png'
import logo from './assets/ra.png';
import coin from './assets/coinsy64.svg';
import iconsetting from './assets/settings-line.svg';
//import starWarsTheme from './assets/starwarmusic.mp3';
import { useGlobalContext } from './GlobalContext'; 

//let audio: HTMLAudioElement | null = null;
const Home = () => {
  const {
    gUsername,
    gTid,
    gIsact,
    gAddress,
    gBalance,
    gIsagent,
    gRid,
    gDevid,
  } = useGlobalContext();

  console.log(`Home gUsername: ${gUsername}`);
  console.log(`Home gTid: ${gTid}`);
  console.log(`Home gIsact: ${gIsact}`);
  console.log(`Home gAddress: ${gAddress}`);
  console.log(`Home gBalance: ${gBalance}`)
  console.log(`Home gIsagent: ${gIsagent}`);
  console.log(`Home gRid: ${gRid}`);
  console.log(`Home gDevid: ${gDevid}`);

  const [points, setPoints] = useState<number>(0);
  const [address, setAddress] = useState<string>('');
  const [username, setUsername] = useState<string>('Username');
  const [highlightPoints] = useState<boolean>(false);

  const [shipPosition, setShipPosition] = useState({ top: '50%', left: '0%' });
  const [isAgent, setIsAgent] = useState<boolean>(false);

  // 生成随机位置，但确保不在页面的中心区域
  const getRandomPosition = () => {
    const top = Math.random() * 70 + 5 + '%'; // 控制top值在5%-75%之间
    const left = Math.random() * 70 + 5 + '%'; // 控制left值在5%-75%之间
    return { top, left };
  };

  // 每隔几秒钟更新位置，模拟随机漂浮效果
  useEffect(() => {
    const interval = setInterval(() => {
      setShipPosition(getRandomPosition());
    }, 3000); // 每3秒更新一次位置

    return () => clearInterval(interval); // 清除定时器
  }, []);

  // 点击 ship1 时触发的事件
  const handleShipClick = () => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '5%';
    overlay.style.left = '5%';
    overlay.style.width = '90%';
    overlay.style.height = '90%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    overlay.style.color = 'white';
    overlay.style.padding = '20px';
    overlay.style.overflowY = 'auto';
    overlay.style.zIndex = '1000';

    // Close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.backgroundColor = 'red';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.onclick = () => {
      document.body.removeChild(overlay);
    };
    overlay.appendChild(closeButton);

    // Text content
    const content = document.createElement('p');
    content.textContent = 'Russia, Iran, Turkey, Egypt, and other such countries have implemented varying degrees of communication obstruction and surveillance on their citizens. Their growing success threatens world security. Allowing the good people living in these countries to freely access the internet is undoubtedly an act of resistance and suppression against this Sith-like oppressive rule. Our physical eSIM cards enable users to freely download card data from any carrier worldwide, allowing them to connect to the internet from free locations, and once these cards are in the hands of users, they can no longer be revoked. This is the cornerstone of free communication.Therefore, we call upon all those who believe in freedom and love peace to support or join our project, contributing a bit of strength to our galaxy. Resistance is not easy; we urge all rebels to use gray market channels to distribute these cards while avoiding regulatory oversight as much as possible to ensure your own safety. Only in this way can the seeds of freedom thrive on dark lands.';
    overlay.appendChild(content);

    // Join button
    const joinButton = document.createElement('button');
    joinButton.textContent = 'Join The Rebellion';
    joinButton.style.display = 'block';
    joinButton.style.margin = '20px auto';
    joinButton.style.padding = '10px 20px';
    joinButton.style.backgroundColor = '#ffcc00';
    joinButton.style.color = 'black';
    joinButton.style.border = 'none';
    joinButton.style.cursor = 'pointer';
    overlay.appendChild(joinButton);

    document.body.appendChild(overlay);
  };


  // 页面加载后播放音乐和调用登录函数
  useEffect(() => {
    // if (!audio) {
    //   audio = new Audio(starWarsTheme); // 创建音频对象
    //   audio.play(); // 播放音频
    //   audio.loop = false; // 设置不循环播放
    // }
    setUsername(gUsername);
    setPoints(gBalance);
    setAddress(gAddress);
    setIsAgent(gIsagent);

  }, []);

  return (
    <div className="points-container">
      {!isAgent && (
        <img
          src={ship1}
          alt="Ship"
          className="ship1-image"
          style={{
            position: 'absolute',
            top: shipPosition.top,
            left: shipPosition.left,
            transition: 'top 4s ease, left 6s ease' // 平滑过渡
          }}
          onClick={handleShipClick}
        />
      )}
      {/* 广告栏 */}
      <div className="ad-bar">
        <span className="ad-text">The Rebellion aimed to spread physical esim card all over the world as the seed of freedom. A New Hope
        </span>
      </div>

      <div className="top-row">
        {/* 左侧为 DeSIM.io 和 logo */}
        <div className="left-section">
          <img src={logo} alt="Logo" className="logo" />
          <span className="name-text">Rebellion.io</span>
        </div>
        {/* 右侧为 Telegram 的用户名 */}
        <div className="right-section">
          <span className="name-text">{username}</span>
          <img src={iconsetting} alt="Icon" className="icon-image" />
        </div>
      </div>

      {/* Card with overlay layers */}
      <div className="points-table">
        <table className="table-layout">
          <tbody>
            <tr>
              <td className="left-cell">Agent Requied</td>
              <td className="right-cell">Channel Rewards </td>
            </tr>
            <tr>
              <td colSpan={2} className="center-cell">
                <div className="card-container">
                  <img src={cardH} alt="Card" className="card-image" />
                </div>
                <div className="points">
                  <div className="points-text">Force Coin</div>
                  <div className={`points-value ${highlightPoints ? 'highlight' : ''}`}>
                    <img src={coin} alt="Coin Icon" className="coin-icon" />
                    {points}
                  </div>
                </div>
                <div className="points">
                  <div className={`address-value ${highlightPoints ? 'highlight' : ''}`}>
                    {address || 'Loading address...'}
                  </div>
                </div>



              </td>
            </tr>
          </tbody>
        </table>
        {/* 新增的按钮，宽度与表格相同，位置在表格下方 5% 页面高度的距离 */}
        <div className="tail-rec">
          <div className="dad-text">
            <span>To become a Agent of Rebellion.io means you can get 100 real sim cards for free! It can be used to download any eSIM data plans without any limitation on any phones </span><br />
            <span>It means you invite your friends to use eSIM serive whatever device they used, bring them to telegram and make them partners of DeSIM. If that happens, you will get your reward in USDT and get another 100 Millions points!!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
