window.onload = function () {
    createAlphabetTable();
};

// Add an event listener to the radio buttons to recreate the table when a radio button is checked
document.querySelectorAll('input[name="tableDimensions"]').forEach(function (radio) {
    radio.addEventListener('change', createAlphabetTable);
});

// Function to create the alphabet table
function createAlphabetTable() {
    // Clear previous encryption/decryption results and input fields
    document.getElementById('encryptedResult').textContent = '';
    document.getElementById('decryptedResult').textContent = '';
    document.getElementById('inputString').value = '';
    document.getElementById('encryptedInput').value = '';

    // Get table dimensions from the selected radio button
    const tableWidth = parseInt(document.querySelector('input[name="tableDimensions"]:checked').value, 10);

    // Get language selection from the combobox
    const language = document.getElementById('languageSelection').value; // Correctly get the selected language

    // Set character code range based on language
    let startCharCode;
    let endCharCode;
    switch (language) {
        case 'ru':
            startCharCode = 1040; // 'А' in Cyrillic
            endCharCode = 1071;   // 'Я' in Cyrillic
            break;
        case 'en':
            startCharCode = 65; // 'A' in English
            endCharCode = 90;   // 'Z' in English
            break;
        case 'es':
            startCharCode = 65; // 'A' in Spanish
            endCharCode = 90;   // 'Z' in Spanish
            break;
    }

    // Calculate the number of letters in the alphabet for the selected language
    const numberOfLetters = endCharCode - startCharCode + 1;

    // Calculate the number of rows required to fit the alphabet in the specified number of columns
    const tableHeight = Math.ceil((numberOfLetters + 1) / tableWidth); // Add 1 for the space character

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

    // Create table rows for the alphabet letters and space
    let charCode = startCharCode;
    for (let i = 0; i < tableHeight; i++) {
        const row = document.createElement('tr');

        // Create row number
        const rowNumberCell = document.createElement('td');
        rowNumberCell.textContent = i + 1;
        rowNumberCell.className = 'row-number'; // Add a class for styling
        row.appendChild(rowNumberCell);

        // Create cells with alphabet characters and space
        for (let j = 0; j < tableWidth; j++) {
            const cell = document.createElement('td');
            if (charCode <= endCharCode) {
                cell.textContent = String.fromCharCode(charCode);
                charCode++;
            } else if (charCode === endCharCode + 1) {
                cell.textContent = ' '; // Treat space as an alphabet letter
                charCode++;
            }
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