import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './QRCode.css'; // 引入CSS

const QRCode = ({ onScanSuccess, onImageScan, onStartScan, onError, onCancel }: { onScanSuccess: (result: string) => void, onImageScan: () => void, onStartScan: boolean, onError: (error: { code: number, status: string }) => void, onCancel: () => void }) => {
  const [scanError, setScanError] = useState<string | null>(null); // 扫描错误信息
  const scannerRef = useRef<any>(null);
  const scannerContainerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [scanInitialized, setScanInitialized] = useState<boolean>(false); // 标记摄像头是否初始化
  const [scanAttempted, setScanAttempted] = useState<boolean>(false); // 标记是否尝试启动过
  const scannerId = 'qr-code-scanner';

  // 启动摄像头扫码
  const handleStartScan = () => {
    console.log('handleStartScan');

    // 如果摄像头已打开或正在初始化，则不重复调用
    if (isCameraOn || scanInitialized) {
      console.log('Camera is already on or initializing, returning early.');
      return;
    }
    setScanInitialized(true); // 标记摄像头初始化中

    if (!scannerRef.current) {
      const scannerElement = scannerContainerRef.current;
      if (!scannerElement) {
        console.error(`HTML Element with id=${scannerId} not found`);
        setScanInitialized(false); // 重置状态
        return;
      }
      scannerRef.current = new Html5Qrcode(scannerId); // 初始化实例
    }

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    Html5Qrcode.getCameras()
      .then((devices) => {
        console.log('Available devices:', devices);
        if (devices && devices.length) {
          const rearCameras = devices.filter(device =>
            device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('rear')
          );
          const cameraId = rearCameras.length > 0 ? rearCameras[0].id : devices[0].id;
          console.log('Using camera ID:', cameraId);
          
          scannerRef.current
            .start(
              cameraId,
              config,
              (decodedText: string) => {
                console.log('onScanSuccess:', decodedText);
                onScanSuccess(decodedText); // 扫码成功后，将结果传递回 eSIM.tsx
                setScanError(null); // 清除错误
                console.log('handleStartScan onScanSuccess handleStopScan');
                handleStopScan(false); // 成功后不会立即停止扫描
              }
            )
            .then(() => {
              console.log('Camera started successfully');
              setIsCameraOn(true);
              setScanAttempted(true);
              setTimeout(() => setScanError(null), 200); // 避免 "Failed to start scanner" 一闪而过
            })
            .catch((err: any) => {
              console.error('Error starting scanner:', err);
              setScanError('Failed to start scanner');
              setScanInitialized(false);
              onError({ code: 200, status: 'Camera start error' });
            });
        } else {
          setScanError('No cameras found');
          setScanInitialized(false);
          onError({ code: 404, status: 'No cameras found' });
        }
      })
      .catch((/*err*/) => {
        //console.error('Error accessing cameras:', err);
        //setScanError('Failed to access cameras');
        setScanInitialized(false);
        //onError({ code: 500, status: 'Camera access error' });
      });
  };

  // 停止扫码并销毁实例
  const handleStopScan = async (fromError = true) => {
    console.log('handleStopScan called with fromError:', fromError);
    if (scannerRef.current && isCameraOn) {
      try {
        console.log('Stopping scanner...');
        await scannerRef.current.stop();
        await scannerRef.current.clear();
        scannerRef.current = null;
        setIsCameraOn(false);
        setScanInitialized(false); // 重置初始化标记
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    } else {
      console.log('Scanner is not running');
    }
  };

  // 点击上传二维码图片进行识别
  const handleImageScan = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 触发文件选择
    }

    if (scannerRef.current && isCameraOn) {
      console.log('handleImageScan scannerRef.current && isCameraOn handleStopScan');
      handleStopScan().then(onImageScan); // 停止摄像头后进入图片上传模式
    } else {
      onImageScan(); // 进入图片上传模式
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        if (!scannerRef.current) {
          scannerRef.current = new Html5Qrcode(scannerId); // 重新初始化实例
        }

        scannerRef.current.scanFile(file, true)
          .then((decodedText: string) => {
            console.log('handleFileChange onScanSuccess:', decodedText);
            onScanSuccess(decodedText); // 成功解码二维码，将结果传递回 eSIM.tsx
            setScanError(null);
            console.log('handleFileChange handleStopScan');
            handleStopScan(false); // 成功后关闭页面
          })
          .catch(() => {
            setScanError('Failed to decode QR code');
            onError({ code: 400, status: 'QR code decode error' }); // 解码失败，传递错误信息
            console.log('handleFileChange catch handleStopScan');
            handleStopScan(false); // 失败后关闭页面
          });
      };
    }
  };

  // 用户点击关闭按钮，停止摄像头并退出
  const handleClose = () => {
    console.log('handleClose handleStopScan');
    handleStopScan(true); // 停止扫描
    onCancel(); // 通知父组件用户主动取消
  };

  useEffect(() => {
    if (onStartScan && !scanAttempted) {
      if (scannerContainerRef.current) {
        setTimeout(() => {
          console.log('Starting QR Code Scanner');
          handleStartScan(); // 延迟启动扫码，确保 scanner 初始化完成
        }, 200); // 延迟 500 毫秒
      }
    }
    return () => {
      if (scannerRef.current && isCameraOn) {
        console.log('useEffect return handleStopScan');
        handleStopScan(true);
      }
    };
  }, [onStartScan, scanAttempted]);

  return (
    <div className="qrcode-modal"> {/* 添加 qrcode-modal 作为弹窗背景 */}
      <div className="scanner-container">
        <div ref={scannerContainerRef} id={scannerId} className="scanner"></div>
        {scanError && <p className="error-text">{scanError}</p>}
        {/* 使用链接样式的按钮 */}
        <div className="link-buttons">
          <a href="#" className="link-button left-link" onClick={handleImageScan}>
            Use Existing Image
          </a>
          <a href="#" className="link-button right-link" onClick={handleClose}>
            Close
          </a>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

export default QRCode;
