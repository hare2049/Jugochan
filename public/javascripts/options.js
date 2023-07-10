/*Otvara menu za opcije (trenutno samo za log in admina).*/

const optionsLinks = document.querySelectorAll('.optionsLink');

optionsLinks.forEach(optionsLink => {
    optionsLink.addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.id = 'Overlay';
        const form = document.createElement('form');
        form.id = 'Optionsform';
        form.style.backgroundColor = "#1618a9";
        form.setAttribute('action', '/options');
        form.setAttribute('method', 'GET');
        form.innerHTML = `
              <input type="text" id="OptionsInput" name="OptionsInput">
              <button type="submit">Submit</button>
            `;
        overlay.appendChild(form);
        document.body.appendChild(overlay);
        form.addEventListener('click', (event) => {
            event.stopPropagation();
        });
        overlay.addEventListener('click', () => {
            overlay.remove();
        });
    });
});