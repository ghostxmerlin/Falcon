import React, { useEffect } from 'react';
import { useGlobalContext } from './GlobalContext';
import axios from 'axios';
import { Telegram, WebApp as WebAppTypes } from '@twa-dev/types';
import './Launch.css';
import ship3 from './assets/ship3.png';
import loading from './assets/loading.svg';
import cardH from './assets/cardH2.png';
import ship1 from './assets/ship1.png';
import logo from './assets/ra.png';
import coin from './assets/coinsy64.svg';
import iconsetting from './assets/settings-line.svg';
import starWarsTheme from './assets/starwarmusic.mp3';
import { BACKEND_URL } from './config';

const telegramWindow = window as unknown as Window & { Telegram: Telegram };

interface LaunchProps {
  onLaunchComplete: () => void;
}

const Launch: React.FC<LaunchProps> = ({ onLaunchComplete }) => {
  const {
    gUsername, setgUsername,
    gTid, setgTid,
    gIsact, setgIsact,
    gAddress, setgAddress,
    gBalance,setgBalance,
    gIsagent, setgIsagent,
    gRid, setgRid,
    gDevid, setDevid,
  } = useGlobalContext();
  useEffect(() => {
    const loadImages = async () => {
      // Load initial images
      await Promise.all([
        new Promise((resolve) => {
          const img = new Image();
          img.src = ship3;
          img.onload = resolve;
        }),
        new Promise((resolve) => {
          const img = new Image();
          img.src = loading;
          img.onload = resolve;
        })
      ]);
      // Images loaded, now proceed with login
      getTelegramDataAndLogin();
    };

    loadImages();
  }, []);

  const getTelegramDataAndLogin = () => {
    let telegramData: { telegramId?: string; telegramUsername?: string } = {};
    if (telegramWindow.Telegram) {
      const WebApp: WebAppTypes = telegramWindow.Telegram.WebApp;
      WebApp.ready();
      const initData = WebApp.initData || '';
      if (initData) {
        try {
          const params = new URLSearchParams(initData);
          const userJson = params.get('user');
          if (userJson) {
            const user = JSON.parse(decodeURIComponent(userJson));
            telegramData = {
              telegramId: user.id,
              telegramUsername: user.username,
            };
            setgUsername(user.username);
            setgTid(user.id);
          }
        } catch (error) {
          console.error('Failed to parse Telegram init data:', error);
        }
      }
    }

    const login = async (telegramId: string) => {
      try {
        const response = await axios.post(`${BACKEND_URL}login`, {
          tid: telegramId
        });
        console.log('Login response:', response.data);
        setgAddress(response.data.address);
        setgBalance(response.data.balance);
        setgIsact(response.data.isact);
        setgIsagent(response.data.isagent);
        setgRid(response.data.rid);
        setDevid(response.data.devid);
        await loadRemainingAssets();
        onLaunchComplete();
      } catch (error: any) {
        console.error('Login error:', error.message);
      }
    };

    if (telegramData.telegramId) {
      login(telegramData.telegramId);
    }
  };

  const loadRemainingAssets = async () => {
    await Promise.all([
      new Promise((resolve) => {
        const img = new Image();
        img.src = cardH;
        img.onload = resolve;
      }),
      new Promise((resolve) => {
        const img = new Image();
        img.src = ship1;
        img.onload = resolve;
      }),
      new Promise((resolve) => {
        const img = new Image();
        img.src = logo;
        img.onload = resolve;
      }),
      new Promise((resolve) => {
        const img = new Image();
        img.src = coin;
        img.onload = resolve;
      }),
      new Promise((resolve) => {
        const img = new Image();
        img.src = iconsetting;
        img.onload = resolve;
      }),
      new Promise((resolve) => {
        const audio = new Audio(starWarsTheme);
        audio.onloadeddata = resolve;
      })
    ]);
  };
  

  useEffect(() => {
    console.log(`Updated gUsername ${gUsername}`);
    console.log(`Updated gTid ${gTid}`);
    console.log(`Updated gIsact ${gIsact}`);
    console.log(`Updated gAddress ${gAddress}`);
    console.log(`Updated gIsagent ${gIsagent}`);
    console.log(`Updated gBalance ${gBalance}`);
    console.log(`Updated gRid ${gRid}`);
    console.log(`Updated gDevid ${gDevid}`);
  }, [gUsername,gTid,gIsact,gAddress,gIsagent,gRid,gDevid]);

  return (
    <div className="launch-container">
      <img src={ship3} alt="Ship" className="ship-image" />
      <img src={loading} alt="Loading" className="loading-image" />
    </div>
  );
};

export default Launch;
