import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInStart, signInFailure, signInSuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import OAuth from '../components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent refreshing the page when we submit the form
    try {
      dispatch(signInStart());
      const res = await fetch('/backend/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

  return (
    <div 
      className="bg-cover bg-center min-h-screen flex items-center justify-center" 
      style={{ backgroundImage: `url('https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')` }}>
      <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8 bg-opacity-90">
        <h1 className="text-3xl text-center font-semibold mb-6">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="email" 
            placeholder="Email" 
            id="email" 
            className="bg-slate-100 p-3 rounded-lg" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            id="password" 
            className="bg-slate-100 p-3 rounded-lg" 
            onChange={handleChange} 
            required 
          />
          <button 
            disabled={loading} 
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          <OAuth />
        </form>
        <div className="flex gap-2 mt-5">
          <p>Don't have an account?</p>
          <Link to="/sign-up">
            <span className="text-blue-500">Sign Up</span>
          </Link>
        </div>
        <p className="text-red-700 mt-5">{error ? error.message || 'Something went wrong!' : ''}</p>
      </div>
    </div>
  );
}
