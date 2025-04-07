import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({ email: '', password: '', phone: '', balance: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Convert balance to number or undefined
    const payload = {
      email: form.email,
      password: form.password,
      phone: form.phone,
      balance: form.balance ? Number(form.balance) : undefined
    };

    try {
      const res = await axios.post('http://localhost:3000/users', payload);
      alert(`Registered! Assigned balance: ${res.data.assignedBalance}`);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required /><br />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br />
        <input name="phone" type="text" placeholder="Phone" onChange={handleChange} required /><br />
        <input name="balance" type="number" placeholder="Initial Balance (optional)" onChange={handleChange} /><br />
        <button type="submit">Sign Up</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Signup;
