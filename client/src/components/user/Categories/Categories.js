import React from 'react';
import Carousel from './Carousel/Carousel.js';
import './Categories.css';
import Logo from '../../../assets/user.png';
import Laptop from '../../../assets/laptop.png';
import Cars from '../../../assets/cars.png';
import Bike from '../../../assets/bike.png';
import Shirt from '../../../assets/shirt.png';
import Xbox from '../../../assets/xbox.png';
import Pet from '../../../assets/pet.png';
import Decoration from '../../../assets/decoration.png';

export default function Categories({ setCategory }) {
    const items = [
        { label: 'All', value: '' },
        { label: 'Mobiles', value: 'mobile' },
        { label: 'Laptop', value: 'laptop' },
        { label: 'Cars', value: 'cars' },
        { label: 'Bikes', value: 'bikes' },
        { label: 'Clothes', value: 'clothes' },
        { label: 'Games', value: 'games' },
        { label: 'Pets', value: 'pets' }
    ];

    const images = [Decoration, Logo, Laptop, Cars, Bike, Shirt, Xbox, Pet];
    const colors = ['rgb(248 209 81)', 'rgb(127 184 160)', 'rgb(239 173 234)', 'rgb(188 131 255)', 'rgb(176 243 68)', 'rgb(127 184 160)', 'rgb(248 209 81)', 'rgb(127 184 160)', 'rgb(239 173 234)'];

    const setting = {
        dragSpeed: 1.25,
    };

    return (
        <>
            <div className={'pattern1'}></div>
            <div className={'pattern2'}></div>
            <div className='container'>
                <br />
                <br />
                <h1>Categories</h1>
                <br />
                <Carousel _data={items} {...setting}>
                    {
                        items.map((item, index) => (
                            <div className={'card-container'} onClick={() => setCategory(item.value)} key={index}>
                                <div
                                    className={'card'}
                                    style={{ background: colors[index] }}
                                >
                                    <div style={{ justifyContent: 'center', textAlign: 'center', marginLeft: '-1vh' }}>
                                        <img src={images[index]} width='100vh' height="100vh" alt={item.label} />
                                    </div>
                                </div>
                                <p>{item.label}</p>
                            </div>
                        ))
                    }
                </Carousel>
            </div>
        </>
    );
}
