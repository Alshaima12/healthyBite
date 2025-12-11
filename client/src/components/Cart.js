import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'reactstrap';
import { increaseQty, decreaseQty, removeFromCart, clearCart } from '../slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import useRequireAuth from '../hooks/useRequireAuth';
import axios from 'axios';
import fallbackImg from '../images/meal1.png';

function Cart() {
  const user = useRequireAuth(); // ensure logged-in
  const { items, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!items.length) return;
    if (!user || !user._id) {
      alert('You must be logged in to place an order.');
      return;
    }

    try {
      // 1) send order to backend
      await axios.post('https://healthybite.onrender.com/createOrder', {
        userId: user._id,
        items,
        totalAmount,
      });

      // 2) clear cart
      dispatch(clearCart());

      // 3) Prepare order details to pass to the receipt page
      const orderDetails = {
        customer: {
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        items: items,
        totalAmount: totalAmount,
      };

      // 4) Go to order-complete page with order details
      navigate('/order-receipt', { state: { orderDetails } });
    } catch (err) {
      console.error('Order error:', err);
      alert('Failed to submit order. Please try again.');
    }
  };

  return (
    <main className="page">
      <section className="page-left">
        <h1 className="section-title center">Cart</h1>

        <div className="cart-box">
          {items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="cart-row">
                <div className="cart-img">
                  <img src={item.image || fallbackImg} alt={item.name} />
                </div>

                <div className="cart-info">
                  <p className="cart-name">{item.name}</p>
                  <p className="cart-price">{item.price.toFixed(3)} OR</p>

                  {/* Display Size for Drinks */}
                  {item.size && (
                    <div className="cart-details">
                      <p><strong>Size:</strong> {item.size}</p>
                    </div>
                  )}
                </div>

                <div className="cart-qty">
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => dispatch(decreaseQty(item.id))}
                  >
                    –
                  </button>
                  <span className="qty-value">{item.qty}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    onClick={() => dispatch(increaseQty(item.id))}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="trash-btn"
                  onClick={() => dispatch(removeFromCart(item.id))}
                >
                  🗑
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <>
            <p style={{ marginTop: '20px', fontWeight: '600' }}>
              Total: {totalAmount.toFixed(3)} OR
            </p>
            <Button
              className="primary-btn big-btn"
              style={{ marginTop: '16px' }}
              onClick={handleSubmit}
              block
            >
              Submit Order
            </Button>
          </>
        )}
      </section>

      <section className="page-right">
        {/* Empty green panel as per consistency requirement, or add image if desired */}
      </section>
    </main>
  );
}

export default Cart;
