const ImageUpload = ({ images, setImages }) => {
    const handleImageChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setImages(selectedFiles);  // Update state with selected files
    };

    return (
        <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
        />
    );
};
export default ImageUpload