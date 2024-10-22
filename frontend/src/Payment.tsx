import React, { useEffect, useRef } from 'react';
import paymentfake from './assets/fakepayment.png';
import payed from './assets/payed.png';
import './Payment.css';
import axios from 'axios';
import { useGlobalContext } from './GlobalContext'; // 假设 GlobalContext.tsx 在相同目录或合适路径
import { BACKEND_URL } from './config';

interface PaymentProps {
    onback2page: () => void;
}

const Payment: React.FC<PaymentProps> = ({ onback2page }) => {
    const {
        gTid,
        setgIsact,
        setgAddress,
        setgBalance,
        setgIsagent,
        setgRid,
        setDevid,
        gAction,
    } = useGlobalContext();

    const paymentRef = useRef<HTMLDivElement>(null);
    const payedRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const paymentElement = paymentRef.current;
        if (paymentElement) {
            // Animate the payment image to slide up from the bottom and center
            paymentElement.style.transition = 'transform 1s ease-out';
            paymentElement.style.transform = 'translateY(0)';
        }
    }, []);

    const buyesim = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}sellesim`, {
                tid: gTid,
                uid: gTid // This can be 'tid', 'uid', or 'opid'
            });
            console.log('Buy eSIM response:', response.data);
        } catch (error: any) {
            console.error('Buy eSIM error:', error.message);
        }
        try {
            const response = await axios.post(`${BACKEND_URL}ogin`, {
                tid: gTid
            });
            console.log('Login response:', response.data);
            setgAddress(response.data.address);
            setgBalance(response.data.balance);
            setgIsact(response.data.isact);
            setgIsagent(response.data.isagent);
            setgRid(response.data.rid);
            setDevid(response.data.devid);

        } catch (error: any) {
            console.error('Login error:', error.message);
        }
    }

    const makeagent = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}make_agent`, {
              tid: gTid,
              rid: gAction
            });
            console.log('Test /make_agent response:', response.data);
          } catch (error:any) {
            if (error.response) {
              console.error('Test /make_agent error response:', error.response.data);
            } else {
              console.error('Test /make_agent error:', error.message);
            }
          }

        try {
            const response = await axios.post(`${BACKEND_URL}ogin`, {
                tid: gTid
            });
            console.log('Login response:', response.data);
            setgAddress(response.data.address);
            setgBalance(response.data.balance);
            setgIsact(response.data.isact);
            setgIsagent(response.data.isagent);
            setgRid(response.data.rid);
            setDevid(response.data.devid);

        } catch (error: any) {
            console.error('Login error:', error.message);
        }
    }

    const handlePaymentClick = async () => {
        const payedElement = payedRef.current;

        if (payedElement) {
            payedElement.style.display = 'block';
            try {
            switch (gAction) {
                case "Destroyer":
                case "Cruiser":
                case "BattleShip":
                case "Carrier":
                    console.log("buy");
                    await buyesim();
                    break;
                default:
                    console.log("act");
                    await makeagent();
                    break;
            }
        }catch (error) {
            console.error('Payment error:', error);
        }
            setTimeout(() => {
                onback2page();
            }, 2000);
        }
    };

    if (!gAction || gTid === undefined) {
        return <div>Loading Payment Information...</div>;
    }

    return (
        <div className="payment-container">
            <div ref={paymentRef} className="payment-fake" onClick={handlePaymentClick}>
                <img src={paymentfake} alt="Payment Fake" className="paymentfake-image" />
                <img ref={payedRef} src={payed} alt="Payed" className="payed-image" style={{ display: 'none' }} />
            </div>
        </div>
    );
};

export default Payment;
