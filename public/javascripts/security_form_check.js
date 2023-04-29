const textArea = document.getElementById('text');
const errorSpan = document.createElement('span');

textArea.addEventListener('input', () => {
    const textAreaValue = textArea.value;
    if (textArea.value.length > 1999) {
        errorSpan.innerText = `Error: Comment too long (${textAreaValue.length}/2000)`;
        textArea.insertAdjacentElement('afterend', errorSpan)
    } else {
        errorSpan.innerText = '';
    }
});

const floatingTextArea = document.getElementById('floating_text');
const floatingErrorSpan = document.createElement('span');

floatingTextArea.addEventListener('input', () => {
    const textAreaValue = floatingTextArea.value;
    console.log(textAreaValue);
    if (floatingTextArea.value.length > 1999) {
        floatingErrorSpan.innerText = `Error: Comment too long (${textAreaValue.length}/2000)`;
        floatingTextArea.insertAdjacentElement('afterend', floatingErrorSpan)
    } else {
        floatingErrorSpan.innerText = '';
    }
});