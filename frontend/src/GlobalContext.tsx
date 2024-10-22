import React, { createContext, useContext, useState, ReactNode } from 'react';

// 定义全局状态的类型
interface GlobalContextType {
  gUsername: string;
  setgUsername: React.Dispatch<React.SetStateAction<string>>;
  gTid: string;
  setgTid: React.Dispatch<React.SetStateAction<string>>;
  gIsact: boolean;
  setgIsact: React.Dispatch<React.SetStateAction<boolean>>;
  gAddress: string;
  setgAddress: React.Dispatch<React.SetStateAction<string>>;
  gBalance: number;
  setgBalance: React.Dispatch<React.SetStateAction<number>>;
  gIsagent: boolean;
  setgIsagent: React.Dispatch<React.SetStateAction<boolean>>;
  gRid: string;
  setgRid: React.Dispatch<React.SetStateAction<string>>;
  gUid: string;
  setgUid: React.Dispatch<React.SetStateAction<string>>;
  gDevid: string;
  setDevid: React.Dispatch<React.SetStateAction<string>>;
  gAction: string;
  setgAction: React.Dispatch<React.SetStateAction<string>>;

}

// 创建 Context
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// 创建 Provider 组件
export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const [gUsername, setgUsername] = useState<string>('');
  const [gTid, setgTid] = useState<string>('');
  const [gIsact, setgIsact] = useState<boolean>(false);
  const [gAddress, setgAddress] = useState<string>('');
  const [gBalance, setgBalance] = useState<number>(0);
  const [gIsagent, setgIsagent] = useState<boolean>(false);
  const [gRid, setgRid] = useState<string>('');
  const [gUid, setgUid] = useState<string>('');
  const [gDevid, setDevid] = useState<string>('');
  const [gAction, setgAction] = useState<string>('idle');

  return (
    <GlobalContext.Provider value={{ 
      gUsername, setgUsername, 
      gTid, setgTid,
      gIsact,setgIsact, 
      gAddress, setgAddress,
      gBalance, setgBalance,
      gIsagent, setgIsagent,
      gRid, setgRid,
      gUid, setgUid,
      gDevid, setDevid,
      gAction,setgAction
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

// 创建一个自定义 Hook 来使用全局状态
export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};
