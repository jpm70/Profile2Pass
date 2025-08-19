document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const jsonInput = document.getElementById('jsonInput');
    const downloadBtn = document.getElementById('downloadBtn');
    const outputDictionary = document.getElementById('outputDictionary');
    const wordCountDisplay = document.getElementById('wordCount');
    const fileNameDisplay = document.getElementById('fileName');

    let loadedFile = null;

    const commonNumbers = ['1', '123', '321', '11', '01', '02', '10', '100', '1234', '12345'];

    function generateDictionary(data) {
        console.log("Datos de perfil recibidos:", data);

        const dictionary = new Set();
        const keywords = [];

        function addVariations(word) {
            if (!word) return;
            word = word.toLowerCase();
            dictionary.add(word);
            dictionary.add(word.charAt(0).toUpperCase() + word.slice(1));
            if (word.length > 3) {
                dictionary.add(word.toUpperCase());
            }
        }
        
        function processData(inputData) {
            function processString(value) {
                if (typeof value === 'string') {
                    // Limpia la cadena de caracteres no deseados y divide por espacios
                    const cleanedWords = value.replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(word => word.length > 2);
                    cleanedWords.forEach(word => addVariations(word.trim()));
                }
            }

            if (Array.isArray(inputData)) {
                inputData.forEach(row => {
                    Object.values(row).forEach(processString);
                });
            } else if (typeof inputData === 'object' && inputData !== null) {
                Object.values(inputData).forEach(processString);
            } else {
                console.error("Formato de datos no válido.");
                return;
            }

            // Generar la lista de palabras clave para combinaciones
            const allWords = Array.from(dictionary);
            allWords.forEach(word => keywords.push(word));
        }

        // Si los datos son un array (de CSV), procesamos todas las filas
        if (Array.isArray(data)) {
            data.forEach(item => processData(item));
        } else {
            // Si los datos son un objeto (de JSON), los procesamos directamente
            processData(data);
        }

        // Verificar si se generó alguna palabra clave antes de continuar
        if (keywords.length === 0) {
            outputDictionary.value = "No se encontraron palabras clave válidas en el archivo para generar un diccionario. Asegúrate de que el archivo contiene datos de perfil como nombres, apellidos, etc.";
            wordCountDisplay.textContent = "Total de palabras: 0";
            return;
        }

        // Generar combinaciones
        const combinedWords = new Set();
        keywords.forEach(word => {
            commonNumbers.forEach(num => {
                combinedWords.add(word + num);
                combinedWords.add(num + word);
            });
            if (data.birthyear) {
                combinedWords.add(word + data.birthyear);
                combinedWords.add(data.birthyear + word);
            }
        });
        
        // Combinaciones entre palabras clave
        for (let i = 0; i < keywords.length; i++) {
            for (let j = 0; j < keywords.length; j++) {
                if (i !== j) {
                    combinedWords.add(keywords[i] + keywords[j]);
                }
            }
        }
        
        const finalDictionary = new Set([...dictionary, ...combinedWords]);
        const dictionaryArray = Array.from(finalDictionary);
        outputDictionary.value = dictionaryArray.join('\n');
        wordCountDisplay.textContent = `Total de palabras: ${dictionaryArray.length}`;
    }

    // Evento para el botón de generar desde el formulario
    generateBtn.addEventListener('click', () => {
        const profileData = {
            name: document.getElementById('name').value.trim(),
            surname1: document.getElementById('surname1').value.trim(),
            surname2: document.getElementById('surname2').value.trim(),
            nickname: document.getElementById('nickname').value.trim(),
            birthdate: document.getElementById('birthdate').value.trim(),
            birthyear: document.getElementById('birthyear').value.trim(),
            partnerName: document.getElementById('partnerName').value.trim(),
            fatherName: document.getElementById('fatherName').value.trim(),
            motherName: document.getElementById('motherName').value.trim(),
            siblings: document.getElementById('siblings').value.trim(),
            children: document.getElementById('children').value.trim(),
            pet: document.getElementById('pet').value.trim(),
            city: document.getElementById('city').value.trim(),
            company: document.getElementById('company').value.trim(),
            school: document.getElementById('school').value.trim(),
            team: document.getElementById('team').value.trim(),
            hobby: document.getElementById('hobby').value.trim(),
            dni: document.getElementById('dni').value.trim(),
            ssn: document.getElementById('ssn').value.trim(),
            phone: document.getElementById('phone').value.trim()
        };
        generateDictionary(profileData);
    });

    // Evento para cuando el usuario elige un archivo
    jsonInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            loadedFile = file;
            fileNameDisplay.textContent = file.name;
        } else {
            loadedFile = null;
            fileNameDisplay.textContent = 'Ningún archivo seleccionado';
        }
    });

    // Evento para el botón de generar desde JSON/CSV
    uploadBtn.addEventListener('click', () => {
        if (!loadedFile) {
            alert('Por favor, selecciona un archivo JSON o CSV primero.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const fileContent = event.target.result;
            const fileName = loadedFile.name.toLowerCase();
            let data = null;

            try {
                if (fileName.endsWith('.json')) {
                    data = JSON.parse(fileContent);
                } else if (fileName.endsWith('.csv')) {
                    data = parseCSV(fileContent);
                } else {
                    alert('Formato de archivo no compatible. Por favor, sube un archivo .json o .csv.');
                    return;
                }
                generateDictionary(data);
            } catch (error) {
                alert('Error al leer el archivo. Asegúrate de que el formato sea válido.');
                console.error(error);
            }
        };
        reader.readAsText(loadedFile);
    });
    
    // Función para procesar CSV
    function parseCSV(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) return [];
        
        const headers = lines[0].split(',').map(header => header.trim());
        const result = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(value => value.trim());
            if (values.length !== headers.length) continue;
            
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index];
            });
            result.push(row);
        }
        return result;
    }

    // Evento para el botón de descarga
    downloadBtn.addEventListener('click', () => {
        const content = outputDictionary.value;
        if (!content) {
            alert('No hay nada que descargar.');
            return;
        }
        const blob = new Blob([content], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'diccionario_osint.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});
