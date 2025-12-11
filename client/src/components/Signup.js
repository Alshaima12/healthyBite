import React, { useState } from 'react';
import { Form, FormGroup, Input, Button, Alert, Label } from 'reactstrap';
import axios from 'axios';
import salad from "../images/salad-illustration.png";
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
    pic: '',
    gender: '', // Store gender
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.name || !form.email || !form.phone || !form.password || !form.confirm || !form.gender) {
      return 'All fields are required.';
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(form.name)) {
      return 'Full name can only contain letters and spaces.';
    }

    const phoneRegex = /^[97][0-9]{7}$/;
    if (!phoneRegex.test(form.phone)) {
      return 'Phone number must start with 9 or 7 and be exactly 8 digits.';
    }

    if (form.password.length < 6) {
      return 'Password must be at least 6 characters.';
    }

    if (form.password !== form.confirm) {
      return 'Passwords do not match.';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const errMsg = validate();
    if (errMsg) {
      setError(errMsg);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post('https://healthybite.onrender.com/registerUser', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        pic: form.pic,
        gender: form.gender, // Send gender to the backend
      });

      setMessage(res.data.msg || 'Registered successfully.');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError('Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="page-left form-left">
        <h1 className="form-title">Create Account</h1>

        {error && <Alert color="danger">{error}</Alert>}
        {message && <Alert color="success">{message}</Alert>}

        <Form className="form" onSubmit={handleSubmit}>
          <FormGroup>
            <Input
              name="name"
              type="text"
              placeholder="Enter your Name"
              value={form.name}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Input
              name="email"
              type="email"
              placeholder="Enter your Email"
              value={form.email}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Input
              name="phone"
              type="tel"
              placeholder="Enter your Phone.No"
              value={form.phone}
              onChange={handleChange}
              maxLength={8}
            />
          </FormGroup>
          <FormGroup>
            <Input
              name="password"
              type="password"
              placeholder="Enter your Password"
              value={form.password}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Input
              name="confirm"
              type="password"
              placeholder="Confirm your Password"
              value={form.confirm}
              onChange={handleChange}
            />
          </FormGroup>

          {/* Gender selection - checkboxes */}
          <div className="gender-selection">
            <Label check>
              <Input
                type="checkbox"
                name="gender"
                value="male"
                checked={form.gender === 'male'}
                onChange={() => setForm((prev) => ({ ...prev, gender: 'male' }))}
              />
              {' '}Male
            </Label>
            <Label check>
              <Input
                type="checkbox"
                name="gender"
                value="female"
                checked={form.gender === 'female'}
                onChange={() => setForm((prev) => ({ ...prev, gender: 'female' }))}
              />
              {' '}Female
            </Label>
          </div>

          <Button type="submit" className="primary-btn" disabled={loading} block>
            {loading ? 'Loading...' : 'Sign Up'}
          </Button>
        </Form>
      </section>

      <section className="page-right">
        <div className="circle-image">
          <img src={salad} alt="Healthy food" />
        </div>
      </section>
    </main>
  );
}

export default Signup;
