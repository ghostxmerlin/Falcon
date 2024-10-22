import { useEffect, useState } from 'react';
import './eSIM.css';
import QRCode from './QRCode'; // 引入 QRCode 组件
import "./telegram-web-apps";
import qrsample from "./assets/sampleQR.png"
import { useGlobalContext } from './GlobalContext'; 
import axios from 'axios';
import { BACKEND_URL } from './config';

const eSIM = () => {
        const {
          gUsername,
          gTid,
        } = useGlobalContext();
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [isQRCodeOpen, setIsQRCodeOpen] = useState<boolean>(false); // 控制 QRCode 弹窗的状态
    const [qrCodeResult, setQrCodeResult] = useState<string | null>(null); // 用于存储二维码扫描结果
    const [qrCodeError, setQrCodeError] = useState<{ code: number, status: string } | null>(null); // 存储错误信息
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null); // 用于存储选中的eSIM Plan
    const [esimPlans, setEsimPlans] = useState<any[]>([]); // 用于存储获取的 eSIM 信息

    const fetchEsimData = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}getesim`, {
                id: gTid,
                type: 'tid'
            });
            console.log('Test /getesim response:', response.data);
            setEsimPlans(response.data); // 假设 response.data 是一个数组，包含多个 eSIM 信息
        } catch (error) {
            console.error('Error fetching eSIM data:', error);
        }
    };


    // 打开二维码扫描界面
    const openQRCodeScanner = () => {
        console.log('Opening QRCode Scanner');
        setIsQRCodeOpen(true); // 打开 QRCode 页面
        setQrCodeError(null);  // 清空之前的错误信息
        setQrCodeResult(null); // 清空之前的扫描结果
    };

    // 关闭二维码扫描界面
    const closeQRCodeScanner = () => {
        console.log('closeQRCodeScanner triggered, isQRCodeOpen:', isQRCodeOpen);
        setIsQRCodeOpen(false); // 关闭 QRCode 页面
    };

    // 处理扫码成功后的结果
    const handleQRCodeSuccess = (result: string) => {
        console.log('handleQRCodeSuccess:', result);
        setQrCodeResult(result);
        setQrCodeError(null); // 成功后清空错误信息
        setTimeout(() => closeQRCodeScanner(), 500); // 延迟关闭，确保状态同步
    };

    // 处理扫码失败的错误信息
    const handleQRCodeError = (error: { code: number, status: string }) => {
        console.log('handleQRCodeError:', error);
        if (error.code === 500) return;
        setQrCodeError(error);
        setTimeout(() => closeQRCodeScanner(), 500); // 延迟关闭，确保状态同步
    };

    // 处理用户取消扫码操作
    const handleQRCodeCancel = () => {
        console.log('handleQRCodeCancel');
        setQrCodeError({ code: 0, status: 'QR Code scan cancelled' });
        closeQRCodeScanner(); // 用户取消操作后关闭 QRCode 页面
    };

    // 显示 eSIM 的二维码
    const showPlanQRCode = (planName: string) => {
        console.log(`Showing QR Code for plan: ${planName}`);
        setSelectedPlan(planName);
    };

    // 关闭 QR Code 图片弹窗
    const closePlanQRCode = () => {
        setSelectedPlan(null);
    };

    useEffect(() => {
        console.log('useEffect: isQRCodeOpen changed:', isQRCodeOpen);
    }, [isQRCodeOpen]);

    useEffect(() => {
        setUserId(gTid);
        setUserName(gUsername);
        fetchEsimData(); // 获取 eSIM 数据

    }, []);

    return (
        <div className="esim-container">
            <h2 className="header-text">eSIM management</h2>
            {userId && userName ? (
                <table className="id-table">
                    <tbody>
                        <tr>
                            <td className="left-align">User ID:</td>
                            <td className="right-align">{userId}</td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <div>Loading...</div>
            )}

            {/* eSIM 购买列表 */}
            <h3 className="header-text">Purchased eSIMs</h3>
            <table className="esim-table">
            <tbody>
                    {esimPlans.map((index) => (
                        <tr key={index}>
                            <td className="left-align">Destroyer,1GB,7days|100% left</td>
                            <td className="right-align">
                                <button className="show-qr-button" onClick={() => showPlanQRCode('Destroyer')}>
                                    QR
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 显示二维码图片的弹窗 */}
            {selectedPlan && (
                <div className="qr-code-popup">
                    <div className="qr-code-image-container">
                        <img src={qrsample} alt={`${selectedPlan} QR Code`} className="qr-code-image" />
                        <button className="close-qr-button" onClick={closePlanQRCode}>Close</button>
                    </div>

                </div>
            )}

            {/* 扫码结果显示 */}
            {qrCodeResult && (
                <div className="qr-result">
                    QR Code Result: {qrCodeResult}
                </div>
            )}

            {/* 错误信息显示 */}
            {qrCodeError && (
                <div className="qr-error">
                    Error Code: {qrCodeError.code}, Message: {qrCodeError.status}
                </div>
            )}

            {/* 打开二维码扫描的按钮 */}
            <button className="scan-qr-button" onClick={openQRCodeScanner}>
                Link DeSIM Card Reader
            </button>

            {/* 显示扫码后的结果 */}
            {qrCodeResult && (
                <div className="qr-result-text">
                    {qrCodeResult}
                </div>
            )}

            {/* QRCode 弹窗界面 */}
            {isQRCodeOpen && (
                <div className="qrcode-modal">
                    <div className="qrcode-popup">
                        <QRCode
                            onScanSuccess={handleQRCodeSuccess}
                            onImageScan={() => console.log("Image Scan Clicked")}
                            onStartScan={isQRCodeOpen}
                            onError={handleQRCodeError} // 传递错误处理回调
                            onCancel={handleQRCodeCancel} // 传递取消操作回调
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default eSIM;
