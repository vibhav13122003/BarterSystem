import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import io from 'socket.io-client';
import { axiosgetProductsById } from "../../../utils/Api";

const socket = io.connect('http://localhost:8000'); // Replace with your server URL

const BidsComponent = ({ productId, currentUserId }) => {
    const [product, setProduct] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
             // Debugging line
            try {
                const response = await axios.get(`http://localhost:8000/products/getProductsById/${productId}`);

                 // Debugging line
                setProduct(response.data);
                setLoading(false);
            } catch (error) {
                 // Debugging line
                setError('Error fetching product details');
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    useEffect(() => {
       
        socket.on('newBid', (data) => {
            if (data.product_id === productId) {
                setProduct((prevProduct) => ({
                    ...prevProduct,
                    bids: [...prevProduct.bids, data.bid]
                }));
            }
        });

        return () => {
            socket.off('newBid');
        };
    }, [productId]);

    const handleBidAction = async (bidId, action) => {
        try {
            const response = await axios.put(`http://localhost:8000/products/acceptBid/${productId}`, {
                bidId,
                action,
            });
            setProduct(response.data.updatedProduct);
            toast.success(`Bid ${action}d successfully!`);
        } catch (error) {
            toast.error(`Failed to update bid status: ${error.response?.data?.message || error.message}`);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>{product.item}</h1>
            <p>Category: {product.category}</p>
            <p>Worth: {product.worth}</p>

            <h2>Bids</h2>
            {product.bids.map((bid) => (
                
                <div key={bid._id} className="bid">
                    <p><strong>Bidder:</strong> {bid.email}</p>
                    <p><strong>Details:</strong> {bid.details}</p>
                    <p><strong>Worth:</strong> {bid.worth}</p>
                    <p><strong>Status:</strong> {bid.status}</p>

                    {product.user_id === currentUserId && bid.status === 'pending' && (
                        <div>
                            <button onClick={() => handleBidAction(bid._id, 'accept')}>Accept</button>
                            <button onClick={() => handleBidAction(bid._id, 'reject')}>Reject</button>
                            <button onClick={() => handleBidAction(bid._id, 'stall')}>Stall</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BidsComponent;
