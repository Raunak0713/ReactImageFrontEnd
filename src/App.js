import React, { useState } from 'react';
import './index.css';
import { SignedIn, SignInButton, UserButton, SignedOut } from "@clerk/clerk-react";

const App = () => {
    const [image, setImage] = useState(null);
    const [value, setValue] = useState("");
    const [response, setResponse] = useState("");
    const [error, setError] = useState("");

    const SurpriseOptions = [
        'Does this image have a whale?',
        'Is the image fabulously pink?',
        'Does the image have puppies'
    ];

    const surprise = () => {
        const randomValue = SurpriseOptions[Math.floor(Math.random() * SurpriseOptions.length)];
        setValue(randomValue);
    };

    const analyseImage = async () => {
        setResponse("");
        if (!image) {
            setError("Error! Must have an existing Image");
            return;
        }
        try {
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    message: value
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            };
            const response = await fetch("https://reactimagebackend.onrender.com/openai", options);
            const text = await response.text();
            setResponse(text);
        } catch (error) {
            console.log(error);
            setError("Something didn't work please try again");
        }
    };

    const clear = () => {
        setImage(null);
        setValue("");
        setResponse("");
        setError("");
    };

    const uploadImage = async (e) => {
        const formData = new FormData();
        formData.append('file', e.target.files[0]);
        setImage(e.target.files[0]);
        e.target.value = null;

        try {
            const options = {
                method: 'POST',
                body: formData
            };
            const response = await fetch('https://reactimagebackend.onrender.com/upload', options);
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error uploading file:', error);
            setError("Something didn't work please try again");
        }
    };

    return (
        <div className="app">
            <header className='head'>
                <SignedIn >
                    <UserButton />
                </SignedIn>
                <SignedOut>
                    <SignInButton className='clerksi'/>
                </SignedOut>
            </header>
            <SignedIn>
                <section className='search-section'>
                    <div className='image-container'>
                        {image && <img src={URL.createObjectURL(image)} alt="Uploaded" />}
                    </div>
                    <p className='extra-info'>
                        <span>
                            <label htmlFor="file">Upload an image </label>
                            <input onChange={uploadImage} id="file" type="file" accept="image/*" hidden />
                        </span>
                        to ask questions about
                    </p>
                    <p>
                        What do you want to know about the image?
                        <button className='surprise' onClick={surprise} disabled={response}>Surprise Me</button>
                    </p>
                    <div className='input-container'>
                        <input value={value} placeholder="What is in the Image..." onChange={e => setValue(e.target.value)} />
                        {(!response && !error) && <button onClick={analyseImage}>Ask me</button>}
                        {(response || error) && <button onClick={clear}>Clear</button>}
                    </div>
                    {error && <p>{error}</p>}
                    {response && <p className='answer'>{response}</p>}
                </section>
                
            </SignedIn>
        </div>
    );
};

export default App;
