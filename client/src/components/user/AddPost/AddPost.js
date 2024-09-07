import React, { useState ,useEffect} from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
    Button,
    TextField,
    Box,
    Typography,
    Checkbox,
    FormControlLabel,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Paper
} from '@mui/material';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { axiosAddProduct } from '../../../utils/Api';

const AddProduct = () => {
    const [images, setImages] = useState({});
    const stars = 0;

    const user = useSelector((state) => state.user.user);
    const { name, email } = user;
    const [location, setLocation] = useState({
        lat: 0,
        long: 0
    })

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(function (position) {
            setLocation({
                lat: position.coords.latitude,
                long: position.coords.longitude,
            })
        });
    }, [])

    const formik = useFormik({
        initialValues: {
            detail: '',
            featured: false,
            type: '',
            title: '',
            worth: '',
            category: 'mobile', // default category
            expires_at: 30, // default expiration in days
        },
        validationSchema: yup.object({
            detail: yup.string().required('Product detail is required'),
            type: yup.string().required('Product type is required'),
            title: yup.string().required('Product title is required'),
            worth: yup.number().required('Product worth is required').positive('Worth must be a positive number'),
        }),
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append('user_name',name);
            formData.append('user_id', user._id);
            formData.append('user_email', email);
            formData.append('long', location.long);
            formData.append('lat', location.lat);
            formData.append('stars', stars);

            Object.keys(values).forEach((key) => {
                formData.append(key, values[key]);
            });

            Object.keys(images).forEach((key) => {
                formData.append(key, images[key]);
            });

            try {
                const response = await axiosAddProduct(formData);
                console.log(response.data);
                toast.success('Product added successfully!');
            } catch (err) {
                console.error('Error uploading product:', err);
                toast.error('Failed to add product. Please try again.');
            }
        },
    });

    const handleImageChange = (e) => {
        const { name, files } = e.target;
        setImages((prevImages) => ({
            ...prevImages,
            [name]: files[0],
        }));
    };

    return (
        <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600, margin: '0 auto', padding: 3 }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                Add Product
            </Typography>
            <TextField
                label="Product Detail"
                name="detail"
                value={formik.values.detail}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.detail && Boolean(formik.errors.detail)}
                helperText={formik.touched.detail && formik.errors.detail}
                fullWidth
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={formik.values.featured}
                        onChange={formik.handleChange}
                        name="featured"
                    />
                }
                label="Featured"
            />
            <TextField
                label="Product Type"
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.type && Boolean(formik.errors.type)}
                helperText={formik.touched.type && formik.errors.type}
                fullWidth
            />
            <TextField
                label="Product Title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                fullWidth
            />
            <TextField
                label="Worth"
                name="worth"
                type="number"
                value={formik.values.worth}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.worth && Boolean(formik.errors.worth)}
                helperText={formik.touched.worth && formik.errors.worth}
                fullWidth
            />
            <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                    name="category"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                >
                    <MenuItem value="mobile">Mobile</MenuItem>
                    <MenuItem value="laptop">Laptop</MenuItem>
                    <MenuItem value="bikes">Bikes</MenuItem>
                    <MenuItem value="cars">Cars</MenuItem>
                    <MenuItem value="clothes">Clothes</MenuItem>
                    <MenuItem value="pets">Pets</MenuItem>
                </Select>
            </FormControl>
            <Grid container spacing={2}>
                {['image', 'image1', 'image2', 'image3'].map((imageName, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                        <Button
                            variant="contained"
                            component="label"
                            color="secondary"
                            sx={{ width: '100%' }}
                        >
                            Upload {imageName.charAt(0).toUpperCase() + imageName.slice(1)}
                            <input
                                type="file"
                                name={imageName}
                                hidden
                                onChange={handleImageChange}
                            />
                        </Button>
                        {images[imageName] && (
                            <Paper elevation={3} sx={{ marginTop: 1, padding: 1 }}>
                                <img
                                    src={URL.createObjectURL(images[imageName])}
                                    alt="preview"
                                    style={{ width: '100%', maxHeight: 100, objectFit: 'cover' }}
                                />
                            </Paper>
                        )}
                    </Grid>
                ))}
            </Grid>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Add Product
            </Button>
        </Box>
    );
};

export default AddProduct;
