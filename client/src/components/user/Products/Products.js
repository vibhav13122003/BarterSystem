import { CircularProgress, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axiosGetAllProducts } from '../../../utils/Api';
import ProductCard from './ProductCard/ProductCard';
import styles from './Products.module.css';
import { addAllProducts } from '../../../Store/Actions/user';
import NotFound from '../../../assets/notfound.png';

export default function Products({ search, category }) {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    // Fetch products from API
    const getProducts = async () => {
        setLoading(true);
        try {
            const response = await axiosGetAllProducts();
            const allProducts = response.data.products;
            setProducts(allProducts);
            setFilteredProducts(allProducts);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        dispatch(addAllProducts(products));
    }, [products, dispatch]);
    useEffect(() => {
        let filtered = products;
        if (search.trim() !== '') {
            filtered = filtered.filter(product =>
                product.title?.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (category && category !== 'All') {
            filtered = filtered.filter(product => product.category.toLowerCase() === category.toLowerCase());
        }
        setFilteredProducts(filtered);
    }, [search, category, products]);


    return (
        <div className={styles['container']}>
            <br />
            <br />
            <br />
            <br />
            <div style={{ display: 'flex', width: '100%' }}>
                <div style={{ flex: 1 }}>
                    <h1>Products</h1>
                </div>
            </div>
            <div className={styles['scrollbar']}>
                <Grid container rowGap={6}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <Grid item lg={3} key={index}>
                                <ProductCard product={product} getProducts={getProducts} id={product._id} />
                            </Grid>
                        ))
                    ) : !loading ? (
                        <div
                            style={{ justifyContent: 'center', textAlign: 'center', width: '100%' }}
                        >
                            <img alt="not found" width="50%" height="100%" src={NotFound} />
                        </div>
                    ) : null}
                    {loading && (
                        <CircularProgress
                            color="secondary"
                            style={{ position: 'absolute', marginInline: '45%', marginTop: '10vh' }}
                        />
                    )}
                </Grid>
            </div>
        </div>
    );
}
