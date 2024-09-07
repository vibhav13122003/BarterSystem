import React from 'react';
import {
    Box,
    Button,
    Grid,
    Modal,
    TextField,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { axiosAddBid } from '../../../utils/Api';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const validationSchema = yup.object({
    category: yup.string().required('Category is required'),
    worth: yup.number().required('Worth is required').positive('Worth must be positive'),
    item: yup.string().required('Item is required'),
    details: yup.string().required('Details are required'),
});

export default function PlaceBid({ getProducts, open, handleClose, product }) {
    const user = useSelector((state) => state.user.user); // Current logged-in user
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            category: '',
            worth: '',
            item: '',
            details: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                console.log('Product:', product); // Debugging: Check product object

                if (!product.user_id) {
                    throw new Error('Product user_id is not available');
                }

                const formData = new FormData();
                formData.append('category', values.category);
                formData.append('worth', values.worth);
                formData.append('item', values.item);
                formData.append('details', values.details);
                formData.append('email', user.email);
                formData.append('user_id', product.user_id);  
               
                for (let [key, value] of formData.entries()) {
                    console.log(key, value);
                }

                const response = await axiosAddBid(formData, product._id);
                console.log('API Response:', response);

                if (response.status === 200) {
                    toast.success("Bid has been Placed!");
                    navigate('/home');
                    handleClose();
                } else {
                    toast.error("Failed to place bid. Please try again.");
                }
            } catch (error) {
                console.error('Error occurred:', error);
                toast.error('An error occurred while placing the bid. Please try again.');
            }
        }
    });

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style}>
                <Typography variant="h6" component="h2">
                    Bid for {product.name}
                </Typography>
                <form onSubmit={formik.handleSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    label="Category"
                                    name="category"
                                    value={formik.values.category}
                                    onChange={formik.handleChange}
                                    error={formik.touched.category && Boolean(formik.errors.category)}
                                >
                                    <MenuItem value="mobiles">Mobiles</MenuItem>
                                    <MenuItem value="laptop">Laptop</MenuItem>
                                    <MenuItem value="cars">Cars</MenuItem>
                                    <MenuItem value="bikes">Bikes</MenuItem>
                                    <MenuItem value="games">Games</MenuItem>
                                    <MenuItem value="pets">Pets</MenuItem>
                                </Select>
                                {formik.touched.category && formik.errors.category && (
                                    <Typography color="error">{formik.errors.category}</Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Worth"
                                name="worth"
                                type="number"
                                value={formik.values.worth}
                                onChange={formik.handleChange}
                                error={formik.touched.worth && Boolean(formik.errors.worth)}
                                helperText={formik.touched.worth && formik.errors.worth}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Item"
                                name="item"
                                value={formik.values.item}
                                onChange={formik.handleChange}
                                error={formik.touched.item && Boolean(formik.errors.item)}
                                helperText={formik.touched.item && formik.errors.item}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Details"
                                name="details"
                                multiline
                                rows={3}
                                value={formik.values.details}
                                onChange={formik.handleChange}
                                error={formik.touched.details && Boolean(formik.errors.details)}
                                helperText={formik.touched.details && formik.errors.details}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button fullWidth variant="contained" color="primary" type="submit">
                                Place Bid
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
}
