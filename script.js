document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const jsonInput = document.getElementById('jsonInput');
    const downloadBtn = document.getElementById('downloadBtn');
    const outputDictionary = document.getElementById('outputDictionary');
    const wordCountDisplay = document.getElementById('wordCount');

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
            // Información Personal
            addVariations(inputData.name);
            addVariations(inputData.surname1);
            addVariations(inputData.surname2);
            if (inputData.nickname) addVariations(inputData.nickname);
            if (inputData.birthyear) {
                dictionary.add(inputData.birthyear);
                dictionary.add(inputData.birthyear.slice(-2));
            }
            if (inputData.birthdate) {
                const parts = inputData.birthdate.split(/[-/.]/);
                if (parts.length === 3) {
                    dictionary.add(parts[0]);
                    dictionary.add(parts[1]);
                    dictionary.add(parts[2]);
                    dictionary.add(parts[0] + parts[1]);
                    dictionary.add(parts[1] + parts[0]);
                    dictionary.add(parts[0] + parts[1] + parts[2].slice(-2));
                }
            }
            if (inputData.partnerName) addVariations(inputData.partnerName);

            // Familia
            if (inputData.fatherName) addVariations(inputData.fatherName);
            if (inputData.motherName) addVariations(inputData.motherName);
            if (inputData.siblings) {
                inputData.siblings.split(',').forEach(sibling => addVariations(sibling.trim()));
            }
            if (inputData.children) {
                inputData.children.split(',').forEach(child => addVariations(child.trim()));
            }

            // Detalles Adicionales
            if (inputData.pet) addVariations(inputData.pet);
            if (inputData.city) addVariations(inputData.city);
            if (inputData.company) addVariations(inputData.company);
            if (inputData.school) addVariations(inputData.school);
            if (inputData.team) addVariations(inputData.team);
            if (inputData.hobby) addVariations(inputData.hobby);
            if (inputData.dni) dictionary.add(inputData.dni);
            if (inputData.ssn) dictionary.add(inputData.ssn);
            if (inputData.phone) dictionary.add(inputData.phone);

            // Generar la lista de palabras clave para combinaciones
            const allWords = Array.from(dictionary);
            allWords.forEach(word => keywords.push(word));
        }

        processData(data);
        
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

    // Nuevo evento para el botón "Generar desde JSON"
    // Esto simula un clic en el input de archivo oculto
    uploadBtn.addEventListener('click', () => {
        jsonInput.click();
    });

    // Evento para el input de archivo (se activa cuando el usuario selecciona un archivo)
    jsonInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) {
            alert('Por favor, selecciona un archivo JSON.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                generateDictionary(data);
            } catch (error) {
                alert('Error al leer el archivo JSON. Asegúrate de que el formato sea válido.');
                console.error(error);
            }
        };
        reader.readAsText(file);
    });

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
