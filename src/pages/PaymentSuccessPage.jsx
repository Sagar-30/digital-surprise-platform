// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import toast from 'react-hot-toast';
// import ShareMessage from '../components/surprise/ShareMessage';
// // import QRCode from 'qrcode.react';

// const PaymentSuccessPage = () => {
//     const { surpriseId } = useParams();
//     const navigate = useNavigate();
//     const [copied, setCopied] = useState(false);
//     const [shareLink, setShareLink] = useState('');

//     useEffect(() => {
//         if (surpriseId) {
//             const link = `${window.location.origin}/surprise/${surpriseId}`;
//             setShareLink(link);
//         }
//     }, [surpriseId]);

//     const copyToClipboard = async () => {
//         try {
//             await navigator.clipboard.writeText(shareLink);
//             setCopied(true);
//             toast.success('Link copied to clipboard! 📋');
//             setTimeout(() => setCopied(false), 2000);
//         } catch (err) {
//             toast.error('Failed to copy link');
//         }
//     };

//     const shareViaWhatsApp = () => {
//         window.open(`https://wa.me/?text=${encodeURIComponent(`🎁 I created a special birthday surprise for you! Click here to open it: ${shareLink}`)}`, '_blank');
//     };

//     const shareViaEmail = () => {
//         window.location.href = `mailto:?subject=Special Birthday Surprise For You!&body=🎁 I created a special surprise for you! Click here to open it: ${shareLink}`;
//     };

//     const viewSurprise = () => {
//         navigate(`/surprise/${surpriseId}`);
//     };

//     const createAnother = () => {
//         navigate('/create');
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-950">
//             {/* Stars background */}
//             <div className="absolute inset-0">
//                 {[...Array(50)].map((_, i) => (
//                     <div
//                         key={i}
//                         className="absolute w-0.5 h-0.5 bg-white rounded-full"
//                         style={{
//                             left: `${Math.random() * 100}%`,
//                             top: `${Math.random() * 100}%`,
//                             animation: `twinkle ${Math.random() * 3 + 2}s infinite`
//                         }}
//                     />
//                 ))}
//             </div>

//             <motion.div
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl relative z-10"
//             >
//                 {/* Success Icon */}
//                 <div className="text-center mb-6">
//                     <motion.div
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         transition={{ type: "spring", duration: 0.6 }}
//                         className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4"
//                     >
//                         <span className="text-4xl">✓</span>
//                     </motion.div>
//                     <h2 className="text-2xl font-bold text-white font-poppins">Payment Successful! 🎉</h2>
//                     <p className="text-sm text-gray-300 mt-2">Your surprise has been created successfully</p>
//                 </div>

//                 {/* Shareable Link Section */}
//                 <div className="mb-6">
//                     <label className="block text-white text-sm font-semibold mb-2 font-poppins">Share this link:</label>
//                     <div className="flex gap-2">
//                         <input
//                             type="text"
//                             value={shareLink}
//                             readOnly
//                             className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-sm font-poppins"
//                         />
//                         <button
//                             onClick={copyToClipboard}
//                             className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold text-sm"
//                         >
//                             {copied ? 'Copied! ✓' : 'Copy'}
//                         </button>
//                     </div>
//                 </div>

//         {/* // QR Code Section - Using API instead of package */}
//                 <div className="text-center mb-6">
//                     <p className="text-white text-sm font-semibold mb-3 font-poppins">Scan QR code to open on mobile:</p>
//                     <div className="inline-block p-3 bg-white rounded-xl">
//                         {shareLink && (
//                             <img
//                                 src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareLink)}`}
//                                 alt="QR Code"
//                                 className="w-[150px] h-[150px]"
//                             />
//                         )}
//                     </div>
//                 </div>

//                 {/* Share Options */}
//                 <div className="mb-6">
//                     <p className="text-white text-sm font-semibold mb-3 text-center font-poppins">Or share via:</p>
//                     <div className="flex gap-3 justify-center">
//                         <button
//                             onClick={shareViaWhatsApp}
//                             className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 transition-all flex items-center justify-center text-xl"
//                         >
//                             💚
//                         </button>
//                         <button
//                             onClick={shareViaEmail}
//                             className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 transition-all flex items-center justify-center text-xl"
//                         >
//                             📧
//                         </button>
//                         <button
//                             onClick={copyToClipboard}
//                             className="w-12 h-12 rounded-full bg-gray-500 hover:bg-gray-600 transition-all flex items-center justify-center text-xl"
//                         >
//                             🔗
//                         </button>
//                     </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-3">
//                     <button
//                         onClick={viewSurprise}
//                         className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold"
//                     >
//                         View Surprise 🎁
//                     </button>
//                     <button
//                         onClick={createAnother}
//                         className="flex-1 py-3 bg-white/20 text-white rounded-xl font-semibold border border-white/30"
//                     >
//                         Create Another ✨
//                     </button>
//                 </div>

//                 {/* Footer */}
//                 <p className="text-center text-xs text-gray-400 mt-4 font-poppins">
//                     Your surprise will be available on the scheduled date and time
//                 </p>
//             </motion.div>

//             <style jsx>{`
//         @keyframes twinkle {
//           0%, 100% { opacity: 0; }
//           50% { opacity: 1; }
//         }
//       `}</style>
//         </div>
//     );
// };

// export default PaymentSuccessPage;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ShareMessage from '../components/surprise/ShareMessage';

const PaymentSuccessPage = () => {
    const { surpriseId } = useParams();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [shareLink, setShareLink] = useState('');
    const [showShareModal, setShowShareModal] = useState(false);
    const [surpriseData, setSurpriseData] = useState({ name: '' });

    useEffect(() => {
        if (surpriseId) {
            const link = `${window.location.origin}/surprise/${surpriseId}`;
            setShareLink(link);
            
            // Try to get surprise name from localStorage or API
            const savedData = localStorage.getItem(`surprise_${surpriseId}`);
            if (savedData) {
                try {
                    const data = JSON.parse(savedData);
                    setSurpriseData({ name: data.name || '' });
                } catch (e) {}
            }
        }
    }, [surpriseId]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setCopied(true);
            toast.success('Link copied to clipboard! 📋');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy link');
        }
    };

    const shareViaWhatsApp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(`🎁 I created a special birthday surprise for you! Click here to open it: ${shareLink}`)}`, '_blank');
    };

    const shareViaEmail = () => {
        window.location.href = `mailto:?subject=Special Birthday Surprise For You!&body=🎁 I created a special surprise for you! Click here to open it: ${shareLink}`;
    };

    const handleShareWithMessage = (message) => {
        const fullMessage = `${message}\n\n${shareLink}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(fullMessage)}`, '_blank');
        setShowShareModal(false);
        toast.success('✨ Magic message shared!');
    };

    const viewSurprise = () => {
        navigate(`/surprise/${surpriseId}`);
    };

    const createAnother = () => {
        navigate('/create');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-gray-950 via-blue-950 to-indigo-950">
            {/* Stars background */}
            <div className="absolute inset-0">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-0.5 h-0.5 bg-white rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animation: `twinkle ${Math.random() * 3 + 2}s infinite`
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl relative z-10"
            >
                {/* Success Icon */}
                <div className="text-center mb-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4"
                    >
                        <span className="text-4xl">✓</span>
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white font-poppins">Payment Successful! 🎉</h2>
                    <p className="text-sm text-gray-300 mt-2">Your surprise has been created successfully</p>
                </div>

                {/* Shareable Link Section */}
                <div className="mb-6">
                    <label className="block text-white text-sm font-semibold mb-2 font-poppins">Share this link:</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={shareLink}
                            readOnly
                            className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white text-sm font-poppins"
                        />
                        <button
                            onClick={copyToClipboard}
                            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-semibold text-sm"
                        >
                            {copied ? 'Copied! ✓' : 'Copy'}
                        </button>
                    </div>
                </div>

                {/* QR Code Section - Using API */}
                <div className="text-center mb-6">
                    <p className="text-white text-sm font-semibold mb-3 font-poppins">Scan QR code to open on mobile:</p>
                    <div className="inline-block p-3 bg-white rounded-xl">
                        {shareLink && (
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareLink)}`}
                                alt="QR Code"
                                className="w-[150px] h-[150px]"
                            />
                        )}
                    </div>
                </div>

                {/* Share Options */}
                <div className="mb-6">
                    <p className="text-white text-sm font-semibold mb-3 text-center font-poppins">Or share via:</p>
                    <div className="flex gap-3 justify-center flex-wrap">
                        <button
                            onClick={() => setShowShareModal(true)}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-semibold shadow-lg hover:shadow-green-500/25 transition-all flex items-center gap-2"
                        >
                            💚 Share with Magic
                        </button>
                        <button
                            onClick={shareViaWhatsApp}
                            className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 transition-all flex items-center justify-center text-xl"
                        >
                            💚
                        </button>
                        <button
                            onClick={shareViaEmail}
                            className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 transition-all flex items-center justify-center text-xl"
                        >
                            📧
                        </button>
                        <button
                            onClick={copyToClipboard}
                            className="w-12 h-12 rounded-full bg-gray-500 hover:bg-gray-600 transition-all flex items-center justify-center text-xl"
                        >
                            🔗
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={viewSurprise}
                        className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold"
                    >
                        View Surprise 🎁
                    </button>
                    <button
                        onClick={createAnother}
                        className="flex-1 py-3 bg-white/20 text-white rounded-xl font-semibold border border-white/30"
                    >
                        Create Another ✨
                    </button>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 mt-4 font-poppins">
                    Your surprise will be available on the scheduled date and time
                </p>
            </motion.div>

            {/* Share Message Modal */}
            {showShareModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="w-full max-w-md bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 rounded-2xl p-6 border border-white/30 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white font-poppins">✨ Share with Magic ✨</h3>
                            <button
                                onClick={() => setShowShareModal(false)}
                                className="text-white/60 hover:text-white text-2xl"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <ShareMessage 
                            name={surpriseData.name || 'your loved one'}
                            onSelect={handleShareWithMessage}
                        />
                    </motion.div>
                </div>
            )}

            <style jsx>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default PaymentSuccessPage;