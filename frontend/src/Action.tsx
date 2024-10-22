import { useEffect, useState } from 'react';
import axios from 'axios';
import "./telegram-web-apps";
import './Action.css';
import { useGlobalContext } from './GlobalContext';
import ww from './assets/weapons.png'
import { BACKEND_URL } from './config';

interface ActionProps {
  onpayforweapon: () => void;
}

const Action: React.FC<ActionProps> = ({ onpayforweapon }) => {
  const {
    gUsername,
    gTid,
    gIsact,
    gAddress,
    gBalance,
    gIsagent,
    gRid,
    gDevid,
    setgAction,
  } = useGlobalContext();

  const [isAgent, setIsAgent] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [inviteLink, setInviteLink] = useState<string>("");
  const [agentList, setAgentList] = useState<Array<{ address: string; isagent: boolean }>>([]);

  useEffect(() => {
    // 检查用户是否是代理
    setIsAgent(gIsagent);
  }, [gIsagent]);

  useEffect(() => {
    console.log(`gIsagent ${gIsagent}`);
    // 获取代理用户列表
    const fetchAgentList = async () => {
      if (gIsagent) {
        try {
          console.log(`${BACKEND_URL}getagent`);
          const response = await axios.post(`${BACKEND_URL}getagent`, {
            tid: gTid
          });
          console.log('Test /testgetagent response:', response.data);
          setAgentList(response.data);
        } catch (error: any) {
          if (error.response) {
            console.error('Test /testgetagent error response:', error.response.data);
          } else {
            console.error('Test /testgetagent error:', error.message);
          }
        }

      };


    }
    fetchAgentList();
  }, [gIsagent]);

  const handleInviteClick = () => {
    const inviteLink = gTid;
    if (document.hasFocus()) {
      navigator.clipboard.writeText(inviteLink).then(() => {
        alert("Invite Link Copied");
      }).catch(err => {
        console.error("Failed to copy: ", err);
      });
    } else {
      alert("Please focus on the document to copy the link");
    }
  };

  const handleBecomeAgentClick = () => {
    if (!email || !inviteLink)
      return;
    console.log(`inviteLink ${inviteLink}`);
    setgAction(inviteLink);
    onpayforweapon();
  };

  return (
    <div className="profile-container">
      <h2>Agent System</h2>
      <table className="profile-table">
        <tbody>
          <tr>
            <td>Usr:</td>
            <td>{gUsername}</td>
            <td>ID:</td>
            <td>{gTid}</td>
          </tr>
          <tr>
            <td>Act:</td>
            <td>{gIsact ? "Yes" : "No"}</td>
            <td>Bal:</td>
            <td>{gBalance}</td>
          </tr>
          <tr>
            <td>Agt:</td>
            <td>{isAgent ? "Yes" : "No"}</td>
            <td>RefID:</td>
            <td>{gRid}</td>
          </tr>
          <tr>
            <td>DevID:</td>
            <td>{gDevid}</td>
            <td colSpan={2}></td>
          </tr>
          <tr>
            <td>Addr:</td>
            <td colSpan={3}>{gAddress}</td>
          </tr>
        </tbody>
      </table>
      {isAgent ? (
        <button className="invite-button" onClick={handleInviteClick}>Invite Agent</button>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Email address"
            className="email-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter invite link"
            className="invite-input"
            value={inviteLink}
            onChange={(e) => setInviteLink(e.target.value)}
          />
          <button className="invite-button" onClick={handleBecomeAgentClick}>Pay for weapon 199USDT</button>
          <img src={ww} className="ww-image" />
        </div>
      )}
      {isAgent && agentList.length > 0 && (
        <>
          <h2>Agent List</h2>
          <table className="profile-table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Is Agent</th>
              </tr>
            </thead>
            <tbody>
              {agentList.map((agent, index) => (
                  <tr key={index}>
                    <td>{agent.address}</td>
                  </tr>
                
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default Action;
