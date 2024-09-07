import { Button, CircularProgress, TextField } from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { axiosSignin } from '../../utils/Api';
import { useDispatch } from 'react-redux';
import { login } from '../../Store/Actions/user';

const SigninForm = () => {
    const dispatch = useDispatch();

    const initFormInputs = {
        email: '',
        password: '',
    };
    const [formInputs, setFormInputs] = useState(initFormInputs);
    const [isLoading, setLoading] = useState(false);

    const toastOptions = {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    };

    const handlerOnFocus = (event) => {
        if (event.target.value === '') {
            setFormInputs({
                ...formInputs,
                [event.target.name]: ''
            });
        }
    };

    const handleSetFormInputs = (event) => {
        setFormInputs({
            ...formInputs,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password } = formInputs;

        if (!email.trim() || !password.trim()) {
            toast.error("Please fill all fields!", toastOptions);
            return;
        }

        try {
            setLoading(true);
            await axiosSignin(
                {
                    email: email.trim(),
                    password: password.trim(),
                    role: "client",
                },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            ).then((response) => {
                const { data } = response;
                setLoading(false);
                dispatch(login(data));
                toast.success("User logged in successfully!", toastOptions);
            });

        } catch (error) {
            setLoading(false);
            const errorMessage =
                error.response?.data?.message || "An error occurred. Please try again.";
            toast.error(errorMessage, toastOptions);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                InputProps={{
                    startAdornment: <EmailOutlinedIcon style={{ color: 'lightgrey', marginRight: '10px' }} />
                }}
                placeholder='Email'
                value={formInputs.email}
                name="email"
                error={formInputs.email === ''}
                onFocus={handlerOnFocus}
                variant='outlined'
                onChange={handleSetFormInputs}
                type="email"
                size='small'
                fullWidth
            />
            <TextField
                InputProps={{
                    startAdornment: <LockOutlinedIcon style={{ color: 'lightgrey', marginRight: '10px' }} />
                }}
                sx={{ marginTop: '5%' }}
                placeholder='Password'
                value={formInputs.password}
                name="password"
                variant='outlined'
                error={formInputs.password === ''}
                onFocus={handlerOnFocus}
                onChange={handleSetFormInputs}
                type="password"
                size='small'
                fullWidth
            />
            <br />
            <br />
            <Button
                type="submit"
                color="secondary"
                disabled={isLoading}
                variant='contained'
                sx={{ marginTop: '2%', borderRadius: '20px', color: 'white', fontWeight: 'bold' }}
                fullWidth
            >
                {isLoading ? <CircularProgress size={28} /> : 'Signin'}
            </Button>
        </form>
    );
};

export default SigninForm;
