export function showTable(data, fields, colHeading, rowHeading) {
    console.log("showTable() is running");

    const defaultColor = 'goldenrod';
    const defaultPadding = '0.4em 0.8em';
    const defaultBorder = `1px solid ${defaultColor}`;

    // === CREATE TABLE ===
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.margin = '0em 0';
    table.style.width = '50%';
    // table.style.margin = '0.5em 0';
    // table.style.width = '100%';
    table.style.textAlign = 'center';

    // === HEADER ROW ===
    const headerRow = document.createElement('tr');

    // Top-left empty corner cell
    const cornerCell = document.createElement('th');
    cornerCell.style.border = defaultBorder;
    cornerCell.style.padding = defaultPadding;
    headerRow.appendChild(cornerCell);

    // Build column headers dynamically from the colHeading field
    data.forEach(item => {
        const th = document.createElement('th');
        th.textContent = item[colHeading] ?? ' ';
        th.style.border = defaultBorder;
        th.style.padding = defaultPadding;
        th.style.backgroundColor = '#333';
        th.style.color = defaultColor;
        th.style.fontWeight = 'bold';
        headerRow.appendChild(th);
    });

    console.log(headerRow);
    table.appendChild(headerRow);

    // === DATA ROWS ===
    fields.forEach(field => {
        const row = document.createElement('tr');

        // Row header (e.g. STR, SPD, LUK)
        const labelCell = document.createElement('td');
        labelCell.textContent = field[rowHeading] ?? field.name ?? field.label ?? '—';
        labelCell.style.border = defaultBorder;
        labelCell.style.padding = defaultPadding;
        labelCell.style.fontWeight = 'bold';
        labelCell.style.backgroundColor = '#222';
        labelCell.style.color = defaultColor;
        row.appendChild(labelCell);

        // Data cells for each item
        data.forEach(item => {
            const valCell = document.createElement('td');
            valCell.textContent = item[field.label] ?? item[field.name] ?? '';
            valCell.style.border = defaultBorder;
            valCell.style.padding = defaultPadding;
            valCell.style.backgroundColor = '#111';
            valCell.style.color = '#eee';
            // Add responsive label (for mobile view)
            valCell.setAttribute('data-label', field.name || field.label);
            row.appendChild(valCell);
        });

        table.appendChild(row);
    });

    return table;
}
