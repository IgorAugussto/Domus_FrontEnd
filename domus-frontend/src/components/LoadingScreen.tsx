import { useState, useEffect } from "react";

export default function LoadingScreen() {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-900 to-blue-700">
      
      {/* Spinner */}
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-300 border-t-transparent"></div>

      {/* Mensagem */}
      {showMessage && (
        <p className="mt-6 text-center text-blue-100 max-w-sm text-sm">
          🚀 Iniciando servidor...<br />
          Isso pode levar alguns segundos na primeira vez.
        </p>
      )}
    </div>
  );
}