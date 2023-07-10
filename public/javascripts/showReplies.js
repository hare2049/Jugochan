/*Javascript za prikazivanje i sakrivanje odgovora u classic view-u.*/

function showReplies(button) {
    let threadDiv = button.parentElement;
    let repliesDiv = threadDiv.querySelector('.thread_replies_minus_five');
    let revealedDivs = repliesDiv.querySelectorAll('.thread_reply');
    let isExpanded = threadDiv.getAttribute('data-expanded') === 'true';
    let match = threadDiv.id.match(/\d+/);
    let span = document.getElementById('omit' + match);
    if (!isExpanded) {
        threadDiv.setAttribute('data-expanded', 'true');
        span.style.display = 'none';
        button.textContent = '[Sakrij Odgovore]';
        revealedDivs.forEach(element => element.setAttribute('data-hidden', 'false'))
        repliesDiv.style.display = 'block';
    } else {
        threadDiv.setAttribute('data-expanded', 'false');
        span.style.display = 'inline';
        button.textContent = '[Prikaži Sve Odgovore]';
        revealedDivs.forEach(element => element.setAttribute('data-hidden', 'true'))
        repliesDiv.style.display = 'none';
    }
}
