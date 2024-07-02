import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProductScreen = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login');
        document.location.reload();
    }
    const fetchProduct = async (id) => {
        const url = `http://192.168.1.75:8000/api/products/${id}/`;
        const headers = {
            'Authorization': `Token ${token}`
        };

        try {
            const response = await fetch(url, { headers });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setProduct(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct(id);
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {product && (
                <div>
                    <h1>{product.name}</h1>
                    <p>{product.description}</p>
                    <p>Price: ${product.price}</p>
                    <p>Size: {product.size}</p>
                    <p>Color: {product.color}</p>
                    <p>Category: {product.category}</p>
                    <p>Barcode: {product.barcode_number}</p>
                    <p>Model Number: {product.model_number}</p>
                    <p>Manufacturer: {product.manufacturer}</p>
                    <p>Inventory Count: {product.inventory_count}</p>
                    <p>Created At: {new Date(product.created_at).toLocaleDateString()}</p>
                    {product.pictures && product.pictures.length > 0 && (
                        <div>
                            {product.pictures.map((picture, index) => (
                                <img key={index} src={picture.image} alt={picture.alt} style={{ width: '200px', height: 'auto' }} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductScreen;
