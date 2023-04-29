// Hide the reply form initially
document.getElementById("reply_form").style.display = "none";

// Handle the click event on the "Post a reply" link

document.getElementById("reply_link").addEventListener("click", function(e) {
    e.preventDefault(); // Prevent the default link behavior

    // Show the reply form

    document.getElementById("replyLinkSpan").style.display = "none";

    document.getElementById("reply_form").style.display = "block";
});
let x = document.getElementById('draggable_header_x');
x.addEventListener('click', () => {
    floatingForm.style.display = 'none';
    open = false;
})

let draggableHeader = document.getElementById('draggable_header');
let floatingForm = document.getElementById('floating_reply_form')
let floatingText = document.getElementById('floating_text');

const drag = (position) => {
    let styles = floatingForm.getBoundingClientRect();
    let left = styles.left;
    let top = styles.top;
    floatingForm.style.setProperty('left', `${left + position.movementX}px`)
    floatingForm.style.setProperty('top', `${top + position.movementY}px`)
};

draggableHeader.addEventListener('mousedown', () => {
    draggableHeader.style.cursor = 'move';
    document.addEventListener('mousemove', drag);
})

document.addEventListener('mouseup', () => {
    draggableHeader.style.cursor = 'default';
    document.removeEventListener('mousemove', drag);
})


let open = false;
let floatingReplyBottom = document.getElementById('floating_reply_bottom');
floatingReplyBottom.addEventListener('click', ()=> {
    if(open === false){
        let centerX = window.innerWidth / 2 - floatingForm.offsetWidth / 2;
        let centerY = window.innerHeight / 2 - floatingForm.offsetHeight / 2;
        floatingForm.style.left = centerX + 'px';
        floatingForm.style.top = centerY + 'px';
        floatingText.value = '';
        floatingForm.style.display = 'flex';
        open = true;
    }
})


function formPopUp(id){
    if(open === false){
        let rect = id.getBoundingClientRect();
        floatingForm.style.left = rect.left + 30 + "px";
        floatingForm.style.top = rect.top + "px";
        floatingText.value = '>>' + id.getAttribute('data-id') + '\n';
        floatingForm.style.display = 'flex';
        open = true;
    }
    else{
        let rect = id.getBoundingClientRect();
        floatingForm.style.left = rect.left + 30 + "px";
        floatingForm.style.top = rect.top + "px";

        const cursorPosition = floatingText.selectionStart;
        const currentValue = floatingText.value;
        const newValue = currentValue.slice(0, cursorPosition) + '>>' + id.getAttribute('data-id') + '\n' + currentValue.slice(cursorPosition);
        floatingText.value = newValue;
        floatingText.selectionStart = floatingText.selectionEnd = cursorPosition + ('>>' + id.getAttribute('data-id') + '\n').length;

        //floatingText.value = floatingText.value + '>>' + id.getAttribute('data-id') + '\n';
    }
}
