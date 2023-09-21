window.onload = function () {
    createAlphabetTable();
};

function createAlphabetTable() {
    // Clear previous encryption/decryption results and input fields
    document.getElementById('encryptedResult').textContent = '';
    document.getElementById('decryptedResult').textContent = '';
    document.getElementById('inputString').value = '';
    document.getElementById('encryptedInput').value = '';

    // Get table dimensions from user input
    const tableWidth = parseInt(document.getElementById('tableWidth').value, 10);
    const tableHeight = parseInt(document.getElementById('tableHeight').value, 10);
    const totalSquares = tableWidth * tableHeight;

    // Validate table dimensions
    if (isNaN(tableWidth) || isNaN(tableHeight)) {
        alert('Введите корректные размеры таблицы');
        return;
    }

    // Get language selection from user input
    const language = document.getElementById('languageSelection').value;
    let startCharCode;
    let endCharCode;

    // Set character code range based on language
    switch (language) {
        case 'ru':
            startCharCode = 1040;
            endCharCode = 1071; // 'Я' in Cyrillic
            break;
        case 'en':
            startCharCode = 65; // 'A' in English
            endCharCode = 90; // 'Z' in English
            break;
        case 'es':
            startCharCode = 65; // 'A' in Spanish
            endCharCode = 90; // 'Z' in Spanish
            break;
    }

    // Create an array of all possible characters
    const allChars = [];
    for (let i = startCharCode; i <= endCharCode; i++) {
        allChars.push(String.fromCharCode(i));
    }
    allChars.push(' '); // Add space character

    // If the table is larger than the alphabet, fill the remaining cells with random Unicode characters
    while (allChars.length < totalSquares) {
        let randomChar = String.fromCharCode(Math.floor(Math.random() * (126 - 33) + 33));
        // Ensure the random character is not already in the alphabet
        if (!allChars.includes(randomChar)) {
            allChars.push(randomChar);
        }
    }

    // Randomize the array
    allChars.sort(() => Math.random() - 0.5);

    // Create alphabet table
    const alphabetTableContainer = document.getElementById('alphabetTableContainer');
    const alphabetTable = document.createElement('table');

    // Create table headers
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th></th>';
    for (let i = 1; i <= tableWidth; i++) {
        const columnHeader = document.createElement('th');
        columnHeader.textContent = i;
        headerRow.appendChild(columnHeader);
    }
    alphabetTable.appendChild(headerRow);

    // Create table rows
    for (let i = 0; i < tableHeight; i++) {
        const row = document.createElement('tr');

        // Create row number
        const rowNumberCell = document.createElement('td');
        rowNumberCell.textContent = i + 1;
        rowNumberCell.className = 'row-number'; // Add a class for styling
        row.appendChild(rowNumberCell);

        // Create cells
        for (let j = 0; j < tableWidth; j++) {
            const cell = document.createElement('td');
            cell.textContent = allChars[i * tableWidth + j];
            row.appendChild(cell);
        }

        alphabetTable.appendChild(row);
    }

    // Append table to container
    alphabetTableContainer.innerHTML = '';
    alphabetTableContainer.appendChild(alphabetTable);
}


function encryptString() {
    const inputString = document.getElementById('inputString').value;
    const alphabetTable = document.querySelector('#alphabetTableContainer table');
    const unencryptedElement = document.getElementById('unencryptedCharacters'); // Reference to the new <p> element

    if (!alphabetTable) {
        alert('Пожалуйста, создайте таблицу алфавита.');
        return;
    }

    const alphabetRows = alphabetTable.querySelectorAll('tr');
    let encryptedText = '';
    const unencryptedCharacters = new Set(); // Use a Set to store unique unencrypted characters

    for (const char of inputString.toUpperCase()) {
        let charEncrypted = false;
        for (let i = 1; i < alphabetRows.length; i++) {
            const cells = alphabetRows[i].querySelectorAll('td');
            for (let j = 1; j < cells.length; j++) {
                if (cells[j].textContent === char) {
                    encryptedText += `${i}${j}, `; // Add a space after the comma
                    charEncrypted = true;
                    break;
                }
            }
            if (charEncrypted) {
                break; // Exit the loop if the character is encrypted
            }
        }
        if (!charEncrypted) {
            unencryptedCharacters.add(char); // Add unencrypted characters to the Set
        }
    }

    if (encryptedText) {
        encryptedText = encryptedText.slice(0, -2); // Remove the trailing comma and space
        document.getElementById('encryptedResult').textContent = encryptedText;
    } else {
        alert('Ошибка: Некоторые символы невозможно зашифровать. Пожалуйста, проверьте ввод.');
    }

    if (unencryptedCharacters.size > 0) {
        const unencryptedChars = Array.from(unencryptedCharacters).join(', '); // Create a comma-separated list of unencrypted characters
        unencryptedElement.textContent = `Не удалось зашифровать следующие символы: ${unencryptedChars}`;
    } else {
        unencryptedElement.textContent = ''; // Clear the unencrypted characters if there are none
    }
}

function decryptString() {
    const encryptedInput = document.getElementById('encryptedInput').value;
    const alphabetTable = document.querySelector('#alphabetTableContainer table');
    const parts = encryptedInput.split(', ');

    if (!alphabetTable) {
        alert('Пожалуйста, создайте таблицу алфавита.');
        return;
    }

    const alphabetRows = alphabetTable.querySelectorAll('tr');
    let decryptedText = '';

    for (const part of parts) {
        const rowColumn = part.split('').map(Number);

        if (rowColumn.length === 2) {
            const [row, column] = rowColumn;
            const rowElement = alphabetRows[row];
            const cells = rowElement.querySelectorAll('td');

            if (column >= 1 && column < cells.length) {
                decryptedText += cells[column].textContent;
            }
        }
    }

    if (decryptedText) {
        document.getElementById('decryptedResult').textContent = decryptedText;
    } else {
        alert('Ошибка: Некоторые символы невозможно дешифровать. Пожалуйста, проверьте ввод.');
    }
}