const createToast = acode.require("toast");

export function handleError(message, error) {
  console.error(`${message}:`, error);
  createToast(`${message}: ${error.message}`);
}

export function createDialogHTML(...fields) {
  const res = fields.map(field => {
    const {
      label,
      require = false,
      placeholder = '',
      type = 'input',
      name = label.toLowerCase().replace(/\s+/g, '_')
    } = field;

    const labelClass = require ? 'class="require"' : '';
    const inputAttributes = `id="${name}" name="${name}" ${require ? 'required' : ''} placeholder="${placeholder}"`;

    let inputHtml;
    if (type === 'textarea') {
      inputHtml = `<textarea ${inputAttributes} rows="5"></textarea>`;
    } else {
      inputHtml = `<input type="text" ${inputAttributes}>`;
    }

    return `
      <div class="bs-dialog-item">
        <label ${labelClass} for="${name}">${label}</label>
        ${inputHtml}
      </div>
    `;
  });
  
  return `<div class="bs-dialog">${res.join('')}</div>`
}