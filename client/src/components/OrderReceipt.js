import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


function OrderReceipt() {
    const { state } = useLocation();
    const { orderDetails } = state || {};
    const navigate = useNavigate();

    if (!orderDetails) {
        return <p>Loading...</p>;
    }

    const handleNextPage = () => {
        navigate('/order-complete');
    }

    return (
        <div className="order-receipt-container">
            <div className="order-receipt-header">
                <h1>Order Receipt</h1>
            </div>

            <div className="customer-info">
                <h2>Customer Details</h2>
                <p><strong>Name:</strong> {orderDetails.customer.name}</p>
                <p><strong>Email:</strong> {orderDetails.customer.email}</p>
                <p><strong>Phone:</strong> {orderDetails.customer.phone}</p>
            </div>

            <div className="order-items">
                <h2>Order Items</h2>
                <ul>
                    {orderDetails.items.map((item) => (
                        <li key={item.productId}>
                            <p>{item.name} x {item.qty} - {item.price} OR</p>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="total-amount">
                <h2><strong>Total Amount:</strong> {orderDetails.totalAmount} OR</h2>
            </div>

            {/* Next Page Button */}
                <button className="primary-btn" onClick={handleNextPage}>Continue</button>
     
        </div>
    );
}

export default OrderReceipt;
