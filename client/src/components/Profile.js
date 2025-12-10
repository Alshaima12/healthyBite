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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Validate the form data
  const validate = () => {
    if (!form.name || !form.email || !form.phone || !form.gender) {
      return 'Name, email, phone, and gender are required.';
    }

    const phoneRegex = /^[97][0-9]{7}$/;
    if (!phoneRegex.test(form.phone)) {
      setError('Phone number must start with 9 or 7 and be exactly 8 digits.');
      return;
    }

    return '';
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

      console.log('Submitting data:', { uid: user._id, name: form.name, email: form.email, phone: form.phone, pic: form.pic, gender: form.gender });

      const res = await axios.post('https://healthybite.onrender.com/updateProfile', {
        uid: user._id, // Ensure user._id is passed correctly
        name: form.name,
        email: form.email,
        phone: form.phone,
        pic: form.pic, // Ensure the image URL or base64 is passed correctly
        gender: form.gender, // Pass the gender to backend
      });

      setMessage(res.data.msg || 'Profile updated.');

      // Update Redux state and frontend form with the new user data
      if (res.data.user) {
        dispatch(loginSuccess(res.data.user)); // Update Redux store with new user data
        setForm({
          name: res.data.user.name,
          email: res.data.user.email,
          phone: res.data.user.phone,
          pic: res.data.user.pic,
          gender: res.data.user.gender, // Update gender
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

        {/* Display user profile info */}
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

        {/* Display error or success messages */}
        {error && <Alert color="danger">{error}</Alert>}
        {message && <Alert color="success">{message}</Alert>}

        {/* Profile Update Form */}
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

          {/* Gender Selection - Using Checkboxes (Single Selection Logic) */}
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

      {/* Profile image and background */}
      <section className="page-right">
        <div className="circle-image">
          <img src={salad} alt="Profile Background" />
        </div>
      </section>
    </main>
  );
}

export default Profile;
