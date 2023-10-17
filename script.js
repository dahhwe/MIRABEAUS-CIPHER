document.getElementById('languageSelection').addEventListener('change', function () {
    const language = this.value;
    const selectElem = document.getElementById('tableDimensionsSelection');
    let maxColumns;

    switch (language) {
        case 'ru':
            maxColumns = 33;
            break;
        case 'en':
            maxColumns = 27;
            break;
    }

    selectElem.innerHTML = '';
    for (let i = 1; i <= maxColumns; i++) {
        const optionElem = document.createElement('option');
        optionElem.value = i;
        optionElem.textContent = i + (i === 1 ? " столбец" : " столбцов");
        if (i === 5) {
            optionElem.selected = true;  // Устанавливаем 5 столбцов по умолчанию
        }
        selectElem.appendChild(optionElem);
    }

    createAlphabetTable();
});

window.onload = function () {
    document.getElementById('languageSelection').dispatchEvent(new Event('change'));
};

function createAlphabetTable() {
    const encryptedResultElem = document.getElementById('encryptedResult');
    const decryptedResultElem = document.getElementById('decryptedResult');
    const inputStringElem = document.getElementById('inputString');
    const encryptedInputElem = document.getElementById('encryptedInput');


    encryptedResultElem.textContent = '';
    decryptedResultElem.textContent = '';
    inputStringElem.value = '';
    encryptedInputElem.value = '';

    const tableWidth = parseInt(document.getElementById('tableDimensionsSelection').value, 10) || 5; // Если значение не выбрано, по умолчанию используется 5
    const language = document.getElementById('languageSelection').value;

    let startCharCode;
    let endCharCode;
    switch (language) {
        case 'ru':
            startCharCode = 1040;
            endCharCode = 1071;
            break;
        case 'en':
        case 'es':
            startCharCode = 65;
            endCharCode = 90;
            break;
    }

    const numberOfLetters = endCharCode - startCharCode + 1;
    const tableHeight = Math.ceil((numberOfLetters + 1) / tableWidth);

    const alphabetTableContainer = document.getElementById('alphabetTableContainer');
    const alphabetTable = document.createElement('table');

    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th></th>';
    for (let i = 1; i <= tableWidth; i++) {
        const columnHeader = document.createElement('th');
        columnHeader.textContent = i;
        headerRow.appendChild(columnHeader);
    }
    alphabetTable.appendChild(headerRow);

    let charCode = startCharCode;
    for (let i = 0; i < tableHeight; i++) {
        const row = document.createElement('tr');
        const rowNumberCell = document.createElement('td');
        rowNumberCell.textContent = i + 1;
        rowNumberCell.className = 'row-number';
        row.appendChild(rowNumberCell);

        for (let j = 0; j < tableWidth; j++) {
            const cell = document.createElement('td');
            if (charCode <= endCharCode) {
                cell.textContent = String.fromCharCode(charCode);
                charCode++;
            } else if (charCode === endCharCode + 1) {
                cell.textContent = ' ';
                charCode++;
            }
            row.appendChild(cell);
        }

        alphabetTable.appendChild(row);
    }

    alphabetTableContainer.innerHTML = '';
    alphabetTableContainer.appendChild(alphabetTable);
}

function encryptString() {
    const inputString = document.getElementById('inputString').value;
    const alphabetTable = document.querySelector('#alphabetTableContainer table');
    const unencryptedElement = document.getElementById('unencryptedCharacters');

    if (!alphabetTable) {
        alert('Пожалуйста, создайте таблицу алфавита.');
        return;
    }

    const alphabetRows = alphabetTable.querySelectorAll('tr');
    let encryptedText = '';
    const unencryptedCharacters = new Set();

    for (const char of inputString.toUpperCase()) {
        let charEncrypted = false;
        for (let i = 1; i < alphabetRows.length; i++) {
            const cells = alphabetRows[i].querySelectorAll('td');
            for (let j = 1; j < cells.length; j++) {
                if (cells[j].textContent === char) {
                    encryptedText += `${i}/${j}, `;
                    charEncrypted = true;
                    break;
                }
            }
            if (charEncrypted) {
                break;
            }
        }
        if (!charEncrypted) {
            unencryptedCharacters.add(char);
        }
    }

    if (encryptedText) {
        encryptedText = encryptedText.slice(0, -2);
        document.getElementById('encryptedResult').textContent = encryptedText;
    } else {
        alert('Ошибка: Некоторые символы невозможно зашифровать. Пожалуйста, проверьте ввод.');
    }

    if (unencryptedCharacters.size > 0) {
        const unencryptedChars = Array.from(unencryptedCharacters).join(', ');
        unencryptedElement.textContent = `Не удалось зашифровать следующие символы: ${unencryptedChars}`;
    } else {
        unencryptedElement.textContent = '';
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
        const rowColumn = part.split('/').map(Number);
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
