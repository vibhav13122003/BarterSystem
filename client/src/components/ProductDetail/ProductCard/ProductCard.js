import React, { useState, useEffect, memo } from 'react';
import { Card, CardMedia, Button, Typography, Box, Grid, Avatar, Rating } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { useDispatch, useSelector } from 'react-redux';
import { updateFav } from '../../../../Store/Actions/user';
import { axiosAddFav, axiosGetAllUsers } from '../../../../utils/Api';
import PlaceBid from '../../PlaceBid/PlaceBid';
import { useNavigate } from 'react-router-dom';

const ProductCard = memo(({ product, getProducts, index }) => {
    const [hover, setHover] = useState(false);
    const [date, setDate] = useState('');
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [fav, setFav] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(state => state.user.user);

    useEffect(() => {
        setFav(user.wish_list?.includes(product._id));
    }, [user.wish_list, product._id]);

    useEffect(() => {
        const getAllUsersHandler = async () => {
            const response = await axiosGetAllUsers();
            setUsers(response.data.users);
        };
        getAllUsersHandler();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (product.expires_at) {
                calculateTime(product.expires_at._seconds * 1000);
            }
        }, 1000);

        return () => clearInterval(intervalId); // Clean up interval on unmount
    }, [product]);

    const calculateTime = (expiresAt) => {
        const now = new Date();
        const expiration = new Date(expiresAt);
        const diff = new Date(expiration - now);
        const days = diff.getUTCDate() - 1;
        const hours = diff.getUTCHours();
        const minutes = diff.getUTCMinutes();
        const seconds = diff.getUTCSeconds();
        setDate(`${days} days ${hours}:${minutes}:${seconds}`);
    };

    const handleFav = async (isAdd) => {
        const data = {
            id: product.user_id,
            product_id: product._id,
            type: isAdd ? 'add' : 'remove'
        };
        await axiosAddFav(data);
        setFav(isAdd);
        dispatch(updateFav(product._id, isAdd));
    };

    const currentUser = users.find(u => u.email === product.user_email);
    const stars = currentUser ? currentUser.stars : 0;

    const renderStars = () => {
        return [...Array(5)].map((_, i) =>
            i < stars ? <StarIcon key={i} color="secondary" fontSize='small' /> : <StarBorderIcon key={i} color="secondary" fontSize='small' />
        );
    };

    return (
        <div style={{ width: '40vh', cursor: 'pointer' }}>
            <PlaceBid open={open} getProducts={getProducts} handleOpen={() => setOpen(true)} handleClose={() => setOpen(false)} product={product} />
            <Card style={{ paddingInline: '3vh', paddingBottom: '2vh', borderRadius: '15px' }}>
                <Box
                    sx={{ position: 'relative', paddingTop: '20px' }}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    <CardMedia
                        component="img"
                        height="280vh"
                        width="100%"
                        style={{ objectFit: 'contain', backgroundColor: 'rgb(0,0,0,.3)', width: '100%', borderRadius: '20px' }}
                        image={product.image?.url || 'fallback-image-url.jpg'}
                        alt={product.name || "Product Image"}
                    />
                    {hover ? (
                        <HoverOverlay onFavClick={handleFav} fav={fav} onPlaceBid={() => setOpen(true)} />
                    ) : (
                        <>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    marginTop: '-17%',
                                    marginInline: '20%',
                                    width: '42%',
                                    bgcolor: 'rgb(255,255,255,.8)',
                                    color: '#87208c',
                                    padding: '5px 20px',
                                    borderRadius: '20px',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                }}
                            >
                                <Typography variant="body2"><b>{date}</b></Typography>
                            </Box>
                            <FavButton fav={fav} onClick={handleFav} />
                        </>
                    )}
                </Box>
                {/* Other content goes here */}
            </Card>
        </div>
    );
});

const HoverOverlay = ({ onFavClick, fav, onPlaceBid }) => (
    <Box
        sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgb(255,255,255,.8)',
            color: 'purple',
            borderRadius: '20px',
            justifyContent: 'center',
            textAlign: 'center',
        }}
    >
        <Button variant='outlined' onClick={onPlaceBid} color="secondary" style={{ marginBlock: '50%', borderRadius: '10px' }}>
            <b>Place a Bid</b>
        </Button>
        <FavButton fav={fav} onClick={onFavClick} />
    </Box>
);

const FavButton = ({ fav, onClick }) => (
    <Box
        sx={{
            position: 'absolute',
            top: 20,
            right: 5,
            color: '#281c83',
            justifyContent: 'center',
            textAlign: 'center',
        }}
    >
        {fav ?
            <StarIcon fontSize='large' onClick={() => onClick(false)} /> :
            <StarBorderIcon fontSize='large' onClick={() => onClick(true)} />
        }
    </Box>
);

export default ProductCard;
