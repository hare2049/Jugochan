const textArea = document.getElementById('text');
const errorSpan = document.createElement('span');

textArea.addEventListener('input', () => {
    const textAreaValue = textArea.value;
    if (textArea.value.length > 2000) {
        errorSpan.innerText = `Error: Comment too long (${textAreaValue.length}/2000)`;
        textArea.insertAdjacentElement('afterend', errorSpan)
    } else {
        errorSpan.innerText = '';
    }
});

const floatingTextArea = document.getElementById('floatingTexttext');
const floatingErrorSpan = document.createElement('span');

textArea.addEventListener('input', () => {
    const textAreaValue = textArea.value;
    if (floatingTextArea.value.length > 2000) {
        floatingErrorSpan.innerText = `Error: Comment too long (${textAreaValue.length}/2000)`;
        floatingTextArea.insertAdjacentElement('afterend', floatingErrorSpan)
    } else {
        floatingErrorSpan.innerText = '';
    }
});