import { useEffect, useState } from "react";

function App() {
    const [serverData, setServerData] = useState([{}]);
    const [inputValue, setInputValue] = useState(""); // State for the input field value

    useEffect(() => {
        fetch("http://localhost:5000/api").then(
            response => response.json()
        ).then(
            data => {
                setServerData(data);
            }
        )
    }, [])

    // Update the state when the input field changes
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    // Function to handle button click
    const handleButtonClick = () => {
        fetch("http://localhost:5000/sendData", { // Replace with your API endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                data: inputValue,
                "next": inputValue
            }), // Send the input value in the request body
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    return (
        <div>
            {serverData["users"]}
            <input type="text" value={inputValue} onChange={handleInputChange} />
            <button onClick={handleButtonClick}>Send Data</button>
        </div>
    )
}

export default App;
