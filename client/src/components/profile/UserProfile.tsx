import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAPIEndpoint } from '../../api';
import { ENDPOINTS } from '../../api/endpoints';

const UserProfile = () => {
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length) {
            setSelectedFile(event.target.files[0]);
            setPreview(URL.createObjectURL(event.target.files[0]));
        }
    };

    const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (selectedFile) {
            const formData = new FormData();
            formData.append('image', selectedFile);
            createAPIEndpoint(ENDPOINTS.uploadImage).upload(formData, {"id": 1})
        }
        navigate("/orders")
    };

    return (
        <div>
            <h2>User Profile</h2>
            <form onSubmit={onFormSubmit}>
                <input type="file" accept="image/*" onChange={onFileChange} />
                {preview && (
                    <div>
                    <p>Preview:</p>
                    <img src={preview} alt="Preview" style={{ width: '200px', height: 'auto' }} />
                    </div>
                )}
                <br />
                <button type="submit">Upload Photo</button>
            </form>
            
            <br />
            <button onClick={() => navigate(-1)}>Back to Home</button>
        </div>
    );
};

export default UserProfile;