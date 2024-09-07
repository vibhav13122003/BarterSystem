import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar, Box, Grid, Rating } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { axiosAddFav, axiosGetAllUsers } from '../../../../utils/Api';
import { useDispatch, useSelector } from 'react-redux';
import { updateFav } from '../../../../Store/Actions/user';
import Products from '../Products';
import PlaceBid from '../../PlaceBid/PlaceBid';
import { useNavigate } from 'react-router-dom';

const ProductCard = React.memo(({ product, getProducts }) => {

    const [hover, setHover] = React.useState(false);
    const [date, setDate] = React.useState();
    const user = useSelector(state => state.user.user);
    const [fav, setFav] = React.useState(user.wish_list && user.wish_list.includes(product._id));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [users, setUsers] = React.useState([]);
    var currentUser = users.filter(u => {
        if (u.email === product.user_email)
            return u;
    });
    const [stars, setStars] = React.useState(currentUser[0] ? currentUser[0].stars : 0);

    const getAllUsersHandler = async () => {
        const temp = await axiosGetAllUsers();

        setUsers(temp.data.users);
    }

    React.useEffect(() => {
        getAllUsersHandler();
    }, []);

    React.useEffect(() => {
        var currentUser = users.filter(u => {
            if (u.email === product.user_email)
                return u;
        });

        currentUser.length !== 0 && setStars(currentUser[0].stars);
    }, [users]);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    React.useEffect(() => {
        setFav(user.wish_list && user.wish_list.includes(product._id));
    }, [user.wish_list]);

    const handleFav = async (isAdd) => {
        if (isAdd) {
            const data = {
                id: product.user_id,
                product_id: product._id,
                type: 'add'
            };
            await axiosAddFav(data);
            setFav(true);
            dispatch(updateFav(product._id, true));
        } else {
            const data = {
                id: product.user_id,
                product_id: product._id,
                type: 'remove'
            };
            await axiosAddFav(data);
            setFav(false);
            dispatch(updateFav(product._id, false));
        }
    }

    const calculateTime = async (date) => {
        var date1 = await new Date();
        var date2 = await new Date(date);
        var diff = await new Date(date2.getTime() - date1.getTime());
        var days = diff.getUTCDate(); // Gives day count of difference
        var hours = diff.getUTCHours(); // Gives difference as year
        var minutes = diff.getUTCMinutes(); // Gives month count of difference
        var seconds = diff.getUTCSeconds(); // Gives month count of difference

        setDate(days + " days " + hours + ":" + minutes + ":" + seconds);
    }

    React.useEffect(() => {
        setInterval(() => {
            product.expires_at && calculateTime(product.expires_at._seconds * 1000);
        }, 1000);
    }, [product]);

    const getStars = () => {
        let rows = [];
        for (var i = 1; i <= 5; i++) {
            if (i < stars)
                rows.push(<StarIcon color="secondary" fontSize='small' />);
            else
                rows.push(<StarBorderIcon color="secondary" fontSize='small' />);
        }
        return rows;
    }

    return (
        <div style={{ width: '40vh', cursor: 'pointer' }} >
            <>
                <PlaceBid open={open} getProducts={getProducts} handleOpen={handleOpen} handleClose={handleClose} product={product} />
            </>
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
                        alt="green iguana"
                    />
                    {hover ?
                        <div>
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
                                <Button variant='outlined' onClick={handleOpen} color="secondary" style={{ marginBlock: '50%', borderRadius: '10px' }}><b>Place a Bid</b></Button>
                            </Box>
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
                                {
                                    fav ? <StarIcon fontSize='large' onClick={() => handleFav(false)} /> :
                                        <StarBorderIcon fontSize='large' onClick={() => handleFav(true)} />
                                }
                            </Box>
                        </div> :
                        <>
                            {/* <
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
                                {/* <Typography variant="body2"><b>{date}</b></Typography> */}

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
                                {
                                    fav ? <StarIcon fontSize='large' onClick={() => handleFav(false)} /> :
                                        <StarBorderIcon fontSize='large' onClick={() => handleFav(true)} />
                                }
                            </Box>
                        </>
                    }
                </Box>
                <div style={{ marginTop: '10px' }}>
                    <Grid container onClick={() => {
                        if (product && (product._id || product._id)) {
                            navigate(`/productdetail/${product._id || product._id}`, { state: { product } });
                        } else {

                        }
                    }}>
                        <Grid item xs={10}  >
                            <Typography variant="h5"><b>{product.title ? product.title : product.name}</b></Typography>
                        </Grid>
                        <Grid item xs={2} >
                            <div style={{ background: '#281c83', cursor: 'pointer', borderRadius: '50%', paddingInline: '7px', color: 'white', float: 'right', display: 'flex' }}>{product.bids ? product.bids.length : 0}</div>
                        </Grid>
                    </Grid>
                    <Grid container gap={2} style={{ marginTop: '10px' }}>
                        <Grid item xs={2}>
                            <Avatar style={{ backgroundColor: '#281c83', zIndex: 100 }} onClick={() => navigate(`/userprofile/${user._id}`, { state: { user: { name: product.user_name, email: product.user_email, detail: product.detail, rating: product.user_rating, reported: product.reported }, isOther: true } })} />
                        </Grid>
                        <Grid item xs={2} onClick={() => navigate(`/productdetail/${product._id}`, { state: { product } })}>
                            <Typography variant="body2" color='grey'>creator</Typography>
                            <Typography variant="body1" color='grey'><b>{product.user_name}</b></Typography>
                        </Grid>
                        <Grid item xs={5} onClick={() => navigate(`/productdetail/${product._id}`, { state: { product } })}>
                            <Typography variant="body2" color='grey'>Type: <b>{product.type.toLowerCase() === 'selection' ? product.type : 'Bidding'}</b></Typography>
                            <Rating
                                name="rating"
                                size='large'
                                value={Math.floor(stars)}
                                readOnly={true}
                            />
                        </Grid>
                    </Grid>
                    {/* Add product ID below */}
                    <Typography variant="body2" color='textSecondary' style={{ marginTop: '8px' }}>
                        <b>Product ID:</b> {product._id}
                    </Typography>
                </div>
            </Card>
        </div>
    );
});

export default ProductCard;
