import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Form, FormGroup, Input, Button, Alert } from 'reactstrap';
import axios from 'axios';
import salad from "../images/salad-illustration.png";
import { loginSuccess } from '../slices/authSlice';


function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [remail, setRemail] = useState('');
  const [rpassword, setRpassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!remail || !rpassword) {
      setError('Email and password are required.');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('https://healthybite.onrender.com/login', {
        remail,
        rpassword,
      });

      // Save user data in Redux
      dispatch(loginSuccess(res.data.user));

      // Navigate to the Welcome page after successful login
      navigate('/welcome');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError('Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="page-left form-left">
        <h1 className="form-title">Login to your Account</h1>

        {error && <Alert color="danger">{error}</Alert>}

        <Form className="form" onSubmit={handleSubmit}>
          <FormGroup>
            <Input
              type="email"
              placeholder="Enter your Email"
              value={remail}
              onChange={(e) => setRemail(e.target.value)}
              data-testid="email"
            />
          </FormGroup>
          <FormGroup>
            <Input
              type="password"
              placeholder="Enter your Password"
              value={rpassword}
              onChange={(e) => setRpassword(e.target.value)}
              data-testid="password"
            />
          </FormGroup>
          <Button
            type="submit"
            className="primary-btn"
            disabled={loading}
            block
          >
            {loading ? 'Loading...' : 'Login'}
          </Button>
        </Form>

        <p className="form-footer">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="link-text">
            Sign Up
          </Link>
        </p>
      </section>

      <section className="page-right">
        <div className="circle-image">
          <img src={salad} alt="Healthy food" />
        </div>
      </section>
    </main>
  );
}

export default Login;
