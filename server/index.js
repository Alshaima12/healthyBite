import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';        // or 'bcryptjs'
import UserModel from './Models/User.js';
import OrderModel from './Models/Order.js';


const app = express();

app.use(cors());
app.use(express.json());

// 🔗 Mongo URI – change <user> <pass> <cluster> if needed
const conn =
  'mongodb+srv://healthybite:EoktteeqjroZQ5Cl@cluster0.cs53ixv.mongodb.net/HealthyBite';


mongoose
  .connect(conn)
  .then(() => console.log('MongoDB connected for HealthyBite'))
  .catch((err) => console.error('MongoDB error:', err));


// =================== Registration ===================
app.post('/registerUser', async (req, res) => {
  try {
    const { name, email, phone, password, pic, gender } = req.body;

    // 1) Basic validation
    if (!name || !email || !phone || !password || !gender) {
      return res.status(400).json({ msg: 'All fields are required.' });
    }

    // 2) Phone validation (must start with 9 or 7, and be 8 digits)
    const phoneRegex = /^[97][0-9]{7}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        msg: 'Phone number must start with 9 or 7 and be exactly 8 digits.',
      });
    }

    // 3) Password validation
    if (password.length < 6) {
      return res.status(400).json({
        msg: 'Password must be at least 6 characters.',
      });
    }

    // 4) Check if email already exists
    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(409).json({ msg: 'Email already registered.' });
    }

    // 5) Hash password
    const hpassword = await bcrypt.hash(password, 10);

    // 6) Create user
    const user = new UserModel({
      name,
      email,
      phone: String(phone), // ensure stored as string
      password: hpassword,
      pic: pic || '',
      gender, // Save gender
    });

    await user.save();

    // Return safe user info (without password)
    const userSafe = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      pic: user.pic,
      gender: user.gender, // Send gender back in the response
    };

    res.status(201).json({ user: userSafe, msg: 'User registered.' });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ msg: 'Server error.' });
  }
});




// =================== Login ===================
// POST /login
app.post('/login', async (req, res) => {
  try {
    const { remail, rpassword } = req.body;

    if (!remail || !rpassword) {
      return res.status(400).json({ msg: 'Email and password required.' });
    }

    const user = await UserModel.findOne({ email: remail });
    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    const passwordMatch = await bcrypt.compare(rpassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ msg: 'Incorrect password.' });
    }

    // here you could generate JWT later
    res.status(200).json({ user, msg: 'Login success.' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ msg: 'Server error.' });
  }
});


// =================== Get Profiles ===================
app.get('/getProfiles', async (req, res) => {
  try {
    const profilesUser = await UserModel.aggregate([
      {
        $lookup: {
          from: 'HealthyBiteUsers', // collection name (see model below)
          localField: 'email',
          foreignField: 'email',
          as: 'user',
        },
      },
    ]);
    res.json({ user: profilesUser });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

// =================== Update User ===================
app.post('/updateProfile', async (req, res) => {
  try {
    const { uid, name, email, phone, pic, gender } = req.body;

    if (!uid || !name || !email || !phone || !gender) {
      return res.status(400).json({ msg: 'All fields are required.' });
    }

    const user = await UserModel.findById(uid);
    if (!user) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    user.name = name;
    user.email = email;
    user.phone = String(phone);
    user.gender = gender;  // Save gender field in the database
    if (typeof pic === 'string') {
      user.pic = pic;
    }

    await user.save();

    const userSafe = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      pic: user.pic,
      gender: user.gender,  // Include gender in the response
    };

    res.json({ user: userSafe, msg: 'Profile updated.' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ msg: 'Server error.' });
  }
});



// =================== Delete User ===================
app.delete('/delUser/:uid', async (req, res) => {
  try {
    const Userid = req.params.uid;
    await UserModel.findOneAndDelete({ _id: Userid });
    res.send({ msg: 'Deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(3002, () => {
  console.log('HealthyBite server connected on port 3002..');
});


// =================== Create Order ===================
// POST /createOrder
app.post('/createOrder', async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;

    if (!userId || !items || !items.length) {
      return res.status(400).json({ msg: 'User and items are required.' });
    }

    const order = new OrderModel({
      user: userId,
      items: items.map((it) => ({
        productId: it.id,
        name: it.name,
        price: it.price,
        qty: it.qty,
        image: it.image || '',
      })),
      totalAmount,
    });

    await order.save();

    res.status(201).json({ msg: 'Order saved.', orderId: order._id });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ msg: 'Server error.' });
  }
});


