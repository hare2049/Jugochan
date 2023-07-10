/*Povećava sliku.*/
function toggleImageSize(img) {
    console.log(img.parentElement.parentElement.parentElement.clientHeight)
    console.log(img.height)
    if(img.parentElement.parentElement.parentElement.clientHeight < img.height){
        img.parentElement.parentElement.parentElement.style.height = "140px";
    }
    if (img.style.width == "100%") {
        if (img.className.includes("threadImage")){
            img.style.maxWidth = "250px"
            img.style.maxHeight = "250px"
        }
        else{
            img.style.maxWidth = "125px"
            img.style.maxHeight = "125px"
        }
        img.style.width = "";
        img.style.height = "";
    } else {
        img.style.maxWidth = "none"
        img.style.maxHeight = "none"
        img.style.width = "100%";
        img.style.height = "auto";
    }
}
/*Zaustavlja automatski otvaranje threada. (ova funkcija je tu uopšte radi middle click-a ako korisnik tim načinom
* otvara sliku*/
function handleClick(event){
    if(event.button === 0){
        event.preventDefault()
    }
}