import React, { useEffect, useState } from 'react';
import { Form, FormGroup, Input, Button, Alert, Label } from 'reactstrap';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import useRequireAuth from '../hooks/useRequireAuth';
import { loginSuccess } from '../slices/authSlice';
import salad from "../images/salad-illustration.png";

function Profile() {
  const user = useRequireAuth(); // Get user details from the state
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    pic: '',
    gender: '', // Add gender field
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-fill form with existing user data
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        pic: user.pic || '',
        gender: user.gender || '', // Ensure gender is prefilled
      });
    }
  }, [user]);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      // Allow only letters and spaces
      if (/^[A-Za-z\s]*$/.test(value)) {
        setForm((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validate the form data
  const validate = () => {
    if (!form.name || !form.email || !form.phone || !form.gender) {
      return 'Name, email, phone, and gender are required.';
    }

    // Name validation (letters and spaces only)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(form.name)) {
      return 'Full name can only contain letters and spaces.';
    }

    // Phone validation (starts with 9 or 7, 8 digits)
    const phoneRegex = /^[97][0-9]{7}$/;
    if (!phoneRegex.test(form.phone)) {
      return 'Phone number must start with 9 or 7 and be exactly 8 digits.';
    }

    return ''; // Valid
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const errMsg = validate();
    if (errMsg) {
      setError(errMsg);
      return;
    }

    if (!user || !user._id) {
      setError('You must be logged in.');
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post('https://healthybite.onrender.com/updateProfile', {
        uid: user._id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        pic: form.pic,
        gender: form.gender,
      });

      setMessage(res.data.msg || 'Profile updated.');

      // Update Redux state and frontend form with new user data
      if (res.data.user) {
        dispatch(loginSuccess(res.data.user));
        setForm({
          name: res.data.user.name,
          email: res.data.user.email,
          phone: res.data.user.phone,
          pic: res.data.user.pic,
          gender: res.data.user.gender,
        });
      }

    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="page-left form-left">
        <h1 className="form-title">My Profile</h1>

        {user && (
          <div className="user-summary-card">
            <div className="profile-img">
              <img src={form.pic || salad} alt="User Profile" />
            </div>
            <div className="user-details">
              <h2>{form.name || user.name}</h2>
              <p>{form.email || user.email}</p>
            </div>
          </div>
        )}

        {error && <Alert color="danger">{error}</Alert>}
        {message && <Alert color="success">{message}</Alert>}

        <Form className="form" onSubmit={handleSubmit}>
          <FormGroup>
            <Input
              name="name"
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Input
              name="phone"
              type="tel"
              placeholder="Phone (8 digits, start 9 or 7)"
              value={form.phone}
              onChange={handleChange}
              maxLength={8}
            />
          </FormGroup>
          <FormGroup>
            <Input
              name="pic"
              type="text"
              placeholder="Profile Picture URL (Optional)"
              value={form.pic}
              onChange={handleChange}
            />
          </FormGroup>

          {/* Gender Selection */}
          <div className="gender-selection">
            <Label check>
              <Input
                type="checkbox"
                name="gender"
                value="male"
                checked={form.gender === 'male'}
                onChange={() => setForm({ ...form, gender: 'male' })}
              />
              {' '}Male
            </Label>
            <Label check>
              <Input
                type="checkbox"
                name="gender"
                value="female"
                checked={form.gender === 'female'}
                onChange={() => setForm({ ...form, gender: 'female' })}
              />
              {' '}Female
            </Label>
          </div>

          <Button type="submit" className="primary-btn" disabled={loading} block>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Form>
      </section>

      <section className="page-right">
        <div className="circle-image">
          <img src={salad} alt="Profile Background" />
        </div>
      </section>
    </main>
  );
}

export default Profile;
