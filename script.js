body {
    font-family: 'Segoe UI', Arial, sans-serif;
    background-color: #0d1117;
    color: #c9d1d9;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    padding: 20px;
    box-sizing: border-box;
}

.logo-container {
    text-align: center;
    margin-bottom: 20px;
}

.logo-container img {
    width: 150px;
    height: auto;
}

.container {
    background-color: #161b22;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
    width: 90%;
    max-width: 800px;
    text-align: center;
    margin: 0 auto;
}

.header {
    margin-bottom: 30px;
}

h1 {
    color: #58a6ff;
    border-bottom: 2px solid #30363d;
    padding-bottom: 15px;
    margin-bottom: 10px;
}

p {
    color: #8b949e;
}

.main-section {
    display: flex;
    justify-content: space-around;
    gap: 30px;
    flex-wrap: wrap;
    margin-bottom: 30px;
    text-align: left; /* Alinea el texto a la izquierda en los formularios */
}

.input-form, .json-upload {
    flex: 1;
    min-width: 250px;
    background-color: #21262d;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #30363d;
}

.json-upload {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.form-section {
    border-bottom: 1px solid #30363d;
    padding-bottom: 20px;
    margin-bottom: 20px;
}

.form-section h3 {
    margin-top: 0;
    color: #58a6ff;
}

.input-group {
    margin-bottom: 15px;
}

.input-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input[type="text"] {
    width: calc(100% - 22px);
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #30363d;
    background-color: #010409;
    color: #e6edf3;
}

button {
    background-color: #238636;
    color: #fff;
    border: none;
    padding: 12px 24px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    margin-top: 15px;
}

button:hover {
    background-color: #2ea043;
}

.output-section {
    text-align: center;
}

#outputDictionary {
    width: calc(100% - 22px);
    height: 300px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #30363d;
    background-color: #010409;
    color: #e6edf3;
    margin-top: 15px;
    resize: vertical;
}

#wordCount {
    font-weight: bold;
    color: #58a6ff;
}