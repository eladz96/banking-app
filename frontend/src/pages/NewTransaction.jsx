import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewTransaction() {
  const [form, setForm] = useState({ recipientEmail: '', amount: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const token = sessionStorage.getItem('token');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3000/transactions', {
        recipientEmail: form.recipientEmail,
        amount: Number(form.amount)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Transaction successful');
      setForm({ recipientEmail: '', amount: '' });

      setTimeout(() => navigate('/home'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Send Money</h2>
      <form onSubmit={handleSubmit}>
        <input name="recipientEmail" type="email" placeholder="Recipient Email" value={form.recipientEmail} onChange={handleChange} required /><br />
        <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} required /><br />
        <button type="submit">Send</button>
      </form>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default NewTransaction;
