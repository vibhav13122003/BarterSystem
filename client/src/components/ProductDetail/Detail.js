import React, { useEffect, useState } from 'react';
import { Avatar, Button, Grid, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PlaceBid from '../user/PlaceBid/PlaceBid';
import { useDispatch, useSelector } from 'react-redux';
import { axiosGetAllProducts } from '../../utils/Api';
import { addAllProducts } from '../../Store/Actions/user';
import { useNavigate } from 'react-router-dom';

export default function Detail() {
    const location = useLocation();
    const product = location.state?.product || {};
    const [products, setProducts] = useState([]);
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const user = useSelector(state => state.user.user); // Current logged-in user
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }, []);

    async function getProducts() {
        const response = await axiosGetAllProducts();
        setProducts(response.data.products);
    }

    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        dispatch(addAllProducts(products));
    }, [products, dispatch]);

    const canPlaceBid = user?.id !== product?.user_id;

    return (
        <>
            <PlaceBid open={open} handleOpen={handleOpen} handleClose={handleClose} product={product} />

            <Grid container spacing={3} mt={6} pl={2} width="100%">
                <Grid item lg={4} xs={12}>
                    {/* Main Image */}
                    <div style={{ width: "100%", height: '40vh', borderRadius: '2vh', border: '5px solid rgb(0,0,130)' }}>
                        <img
                            src={product.image?.url || 'fallback-image-url.jpg'}
                            alt="Product_image_main"
                            style={{ width: "100%", height: '100%' }}
                        />
                    </div>
                </Grid>
                <Grid item lg={8} xs={12} style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {/* Title, Worth, and Detail */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <div style={{ padding: '2vh', borderRadius: '2vh', backgroundColor: 'rgb(0,0,0,.07)' }}>
                                <Typography variant="h6">Title: {product.title}</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <div style={{ padding: '2vh', borderRadius: '2vh', backgroundColor: 'rgb(0,0,0,.07)' }}>
                                <Typography variant="h6">Worth: {product.worth} Rs.</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            <div style={{ padding: '2vh', borderRadius: '2vh', backgroundColor: 'rgb(0,0,0,.07)' }}>
                                <Typography variant="body1">{product.detail}</Typography>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item lg={12} style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpen}
                        startIcon={<RocketLaunchIcon />}
                        style={{ padding: '10px 20px', fontSize: '16px' }}
                    >
                        Place Bid
                    </Button>
                </Grid>


                <Grid item lg={12}>
                    {/* Secondary Images */}
                    <Grid container spacing={2}>
                        {[product.image1, product.image2, product.image3].map((img, index) => (
                            img ? (
                                <Grid item xs={12} sm={4} key={index}>
                                    <div style={{ width: "100%", height: '20vh', borderRadius: '2vh', border: '5px solid rgb(130,0,130)' }}>
                                        <img
                                            src={img.url || 'fallback-image-url.jpg'}
                                            alt={`Product_image_${index}`}
                                            style={{ width: "100%", height: '100%' }}
                                        />
                                    </div>
                                </Grid>
                            ) : null
                        ))}
                    </Grid>
                </Grid>

                <Grid item lg={12}>
                    {/* Creator and Expires At */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <div style={{ color: 'black', background: 'rgb(0,0,0,.07)', borderRadius: '25vh', paddingInline: '3vh', height: '6vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Avatar style={{ backgroundColor: 'rgb(128,0,129)' }} />
                                <div style={{ marginLeft: '1vh' }}>
                                    <Typography variant="body2" color="textSecondary">Creator</Typography>
                                    <Typography variant="body1">{product.user_name}</Typography>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <div style={{ color: 'black', background: 'rgb(0,0,0,.07)', borderRadius: '25vh', paddingInline: '1vh', height: '6vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="body1">Expires at: {new Date(product.expires_at).toDateString()}</Typography>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item lg={12}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '1vh', width: '100%' }}>
                        <div style={{ width: '48%', border: '2px solid rgb(0,0,130)', borderRadius: '1.5vh', padding: '2vh' }}>
                            <Typography variant="h6">Total Bids</Typography>
                            <Typography variant="body1">{product.bids.length}</Typography>
                        </div>
                        <div style={{ width: '48%', border: '2px solid rgb(0,0,130)', borderRadius: '1.5vh', padding: '2vh' }}>
                            <Typography variant="h6">Bid Details</Typography>
                            {product.bids.map((bid, index) => (
                                <div key={index} style={{ border: '2px solid rgb(128,0,128)', borderRadius: '1.5vh', padding: '2vh', marginBottom: '1vh' }}>
                                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>{bid.user_name}</Typography>
                                    <Typography variant="body1">{bid.worth} Rs.</Typography>
                                </div>
                            ))}
                        </div>
                    </div>
                </Grid>
            </Grid>
        </>
    );
}
