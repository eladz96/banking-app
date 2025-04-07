import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = sessionStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const balanceRes = await axios.get('http://localhost:3000/users/balance', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBalance(balanceRes.data.balance);

        const txnRes = await axios.get('http://localhost:3000/transactions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransactions(txnRes.data);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      }
    };

    fetchData();
  }, [token, navigate]);

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Welcome</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <p><strong>Current Balance:</strong> {balance !== null ? balance : 'Loading...'}</p>

      <h3>Past Transactions</h3>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul>
          {transactions.map((txn) => (
            <li key={txn._id}>
              <strong>{txn.sender === JSON.parse(atob(token.split('.')[1])).email ? 'Sent to' : 'Received from'}</strong> {txn.recipient} — ${txn.amount}
              <br />
              <small>{new Date(txn.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}

      <br />
      <button onClick={() => navigate('/send')}>Send Money</button>
    </div>
  );
}

export default Home;
