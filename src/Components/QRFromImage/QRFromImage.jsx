import { useRef} from 'react';
import QrScanner from 'qr-scanner';
import { QrCode} from 'lucide-react';
    const QRFromImage = (children) => {
    let inputQR=useRef(null);
    function ClickInputQR(){
        inputQR.current.click()
    }
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
        const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true });
        children.setResult(result.data);
        } catch (error) {
        console.error('QR scan failed:', error);
        }
    };

    return (
        <div>
        <input type="file" ref={inputQR} accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }}/>
        <QrCode strokeWidth={1.2} size={27} onClick={()=>{ClickInputQR()}} />
        </div>
    );
};

export default QRFromImage;
