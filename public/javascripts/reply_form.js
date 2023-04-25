// Hide the reply form initially
document.getElementById("reply_form").style.display = "none";

// Handle the click event on the "Post a reply" link
document.getElementById("reply_link").addEventListener("click", function(e) {
    e.preventDefault(); // Prevent the default link behavior

    // Show the reply form
    document.getElementById("reply_link").style.display = "none";

    document.getElementById("reply_form").style.display = "block";
});

let x = document.getElementById('draggable_header_x');
x.addEventListener('click', () => {
    console.log('testiranje')
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
let floatingReply = document.getElementById('floating_reply');
floatingReply.addEventListener('click', ()=> {
    if(open === false){
        floatingForm.style.display = 'flex'
        open = true
    }
    else{
        floatingForm.style.display = 'flex'
        open = false
    }
})


function formPopUp(id){
    if(open === false){
        let rect = id.getBoundingClientRect();
        floatingForm.style.left = rect.left + window.scrollX + "px";
        floatingForm.style.top = rect.top + window.scrollY + "px";
        open = true;
    }
    floatingForm.style.display = 'flex';
    floatingText.value = floatingText.value + '>>' + id.getAttribute('data-id') + '\n';
}