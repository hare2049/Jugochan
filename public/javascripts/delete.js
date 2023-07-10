/*Mehanizam za brisanje postova.*/

const deleteAnchor1 = document.getElementById('delete1')
deleteAnchor1.addEventListener('click', deleteSelectedDivs)
const deleteAnchor2 = document.getElementById('delete2')
deleteAnchor2.addEventListener('click', deleteSelectedDivs)
function deleteSelectedDivs(){
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked);
    const checkedValues = checkedCheckboxes.map(checkbox => checkbox.value);
    $.ajax({
        url: "/b/delete",
        method: "DELETE",
        data:{
            'ids': checkedValues.join(','),
            'cookie': decodeURIComponent(document.cookie.slice('session_id='.length)),
        },
        success: async (res) => {
            location.reload(true);
        }
    })
}