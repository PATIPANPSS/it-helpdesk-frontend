import { useEffect, useState } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthentication, setIsAutentication] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token){
      setIsAutentication(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAutentication(false);
  };

  return (
    <div>
      {isAuthentication ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={() => setIsAutentication(true)} />
      )}
    </div>
  )
}

export default App