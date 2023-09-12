function createAlphabetTable() {
    // Очистка результатов шифрования и дешифрования
    document.getElementById('encryptedResult').textContent = '';
    document.getElementById('decryptedResult').textContent = '';

    // Очистка полей ввода
    document.getElementById('inputString').value = '';
    document.getElementById('encryptedInput').value = '';

    const tableWidth = parseInt(document.getElementById('tableWidth').value, 10);
    const tableHeight = parseInt(document.getElementById('tableHeight').value, 10);

    const totalSquares = tableWidth * tableHeight;

    if (isNaN(tableWidth) || isNaN(tableHeight) || totalSquares < 33) {
        alert('Размеры таблицы должны обеспечивать как минимум 33 ячейки.');
        return;
    }

    const alphabetTableContainer = document.getElementById('alphabetTableContainer');
    const alphabetTable = document.createElement('table');

    const maxAlphabetLength = totalSquares;

    // Создание заголовков с номерами столбцов
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = '<th></th>';
    for (let i = 1; i <= tableWidth; i++) {
        const columnHeader = document.createElement('th');
        columnHeader.textContent = i;
        headerRow.appendChild(columnHeader);
    }
    alphabetTable.appendChild(headerRow);

    for (let i = 0; i < tableHeight; i++) {
        const row = document.createElement('tr');
        // Создание номера строки
        const rowNumberCell = document.createElement('td');
        rowNumberCell.textContent = i + 1;
        rowNumberCell.className = 'row-number'; // Add a class for styling
        row.appendChild(rowNumberCell);

        for (let j = 0; j < tableWidth; j++) {
            const cell = document.createElement('td');
            const charCode = 1040 + i * tableWidth + j;
            if (charCode <= 1071 && charCode - 1040 < maxAlphabetLength) {
                cell.textContent = String.fromCharCode(charCode);
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

    if (!alphabetTable) {
        alert('Пожалуйста, создайте таблицу алфавита.');
        return;
    }

    const alphabetRows = alphabetTable.querySelectorAll('tr');
    let encryptedText = '';

    for (const char of inputString.toUpperCase()) {
        for (let i = 0; i < alphabetRows.length; i++) {
            const cells = alphabetRows[i].querySelectorAll('td');
            for (let j = 0; j < cells.length; j++) {
                if (cells[j].textContent === char) {
                    encryptedText += `${i + 1}/${j + 1} + `;
                }
            }
        }
    }

    if (encryptedText) {
        encryptedText = encryptedText.slice(0, -2); // Удаляем последние два символа
        document.getElementById('encryptedResult').textContent = encryptedText;
    } else {
        alert('Ошибка: Некоторые символы невозможно зашифровать. Пожалуйста, проверьте ввод.');
    }
}

function decryptString() {
    const encryptedInput = document.getElementById('encryptedInput').value;
    const alphabetTable = document.querySelector('#alphabetTableContainer table');

    if (!alphabetTable) {
        alert('Пожалуйста, создайте таблицу алфавита.');
        return;
    }

    const parts = encryptedInput.split(' + ');
    const alphabetRows = alphabetTable.querySelectorAll('tr');
    let decryptedText = '';

    for (const part of parts) {
        const [group, index] = part.split('/').map(Number);

        if (!isNaN(group) && !isNaN(index) && group >= 1 && group <= alphabetRows.length && index >= 1) {
            const row = alphabetRows[group - 1];
            const cells = row.querySelectorAll('td');

            if (index <= cells.length) {
                decryptedText += cells[index - 1].textContent;
            }
        }
    }

    if (decryptedText) {
        document.getElementById('decryptedResult').textContent = decryptedText;
    } else {
        alert('Ошибка: Некоторые символы невозможно дешифровать. Пожалуйста, проверьте ввод.');
    }
}