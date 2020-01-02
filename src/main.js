const $titleInput = document.querySelector("#title-input");
const $authorInput = document.querySelector("#author-input");
const $pagesInput = document.querySelector("#pages-input");
const $status = document.querySelectorAll('.form-check-input');
const $form = document.querySelector("#form");
const $container = document.querySelector('.container');
let myLibrary = [{title: "I, Robot", author: "Isaac Asimov", pages: 224, status: "read"}, {title: "Cosmos", author: "Carl sagan", pages: 384, status: "read"}];

//incorporar validacion custom https://getbootstrap.com/docs/4.4/components/forms/?#custom-styles
//para arreglar del bug de que siempre pone "read" en status primero hay que sacar el valor con un loop, y en la comprobación tiene que estar tildada aunque sea una casilla

function Book(title, author, pages, status) {
    this.Title = title;
    this.Author = author;
    this.Pages = pages;
    this.Status = status;
}


function addBookToLibrary() {
    if (validateForm($titleInput.value, $authorInput.value, $pagesInput.value)){
        myLibrary.push(new Book($titleInput.value, $authorInput.value, $pagesInput.value, validateStatus($status)));
        $form.reset(); 
        render();
    }
}


function render() {
    // loops through the array and displays each book on the page.
    $container.innerHTML = '';
    
    for (let i = 0; i < myLibrary.length; i++) {
        let div = document.createElement("div");
        div.classList.add("d-inline-flex", "m-3", "p-3", "card");
        div.setAttribute("data-book-id", [i])

        let text = '';
        Object.keys(myLibrary[i]).forEach(key=>{
            text += `${key} : ${myLibrary[i][key]}`+'\n';
         });

        div.innerText = text;

        let closeButton = document.createElement("button");
        closeButton.classList.add("close", "text-right");
        closeButton.setAttribute("aria-label", "Close");
        let span = document.createElement("span");
        span.setAttribute("aria-hidden", "true");
        span.innerHTML= "&times;";
        closeButton.appendChild(span);
        div.appendChild(closeButton);

        let toggleStatus = document.createElement("button");
        toggleStatus.classList.add("toggleStatus");
        toggleStatus.innerHTML = "Toggle read status"
        div.appendChild(toggleStatus);

        $container.appendChild(div);
    }
    
}


function validateTitle(title) {
    if (title.length === 0) {
        return 'You must specify a title.'
    }
    if (title.length > 100) {
        return 'You have up to 100 characters to specify a title.';
    }
    else {
        return '';
    }
}


function validateAuthor(author) {
    if (author.length === 0){
        return 'You must specify an author.';
    }
    if (author.length > 50) {
        return 'You have up to 50 characters to specify an author.';
    }
    if (!/^[A-z]+$/i.test(author)){
        return 'This field must contain valid characters.';
    }
    else {
        return '';
    }
    
}


function validatePageNumber(pages) {
    if (!/^[0-9]*$/.test(pages)){
        return 'This field only accepts numbers';
    }
    else{
        return '';
    }
}


function validateStatus($status) {
    let checked;
    for (let i = 0; i < $status.length; i++) {
        if($status[i].checked){
            checked = $status[i];
        }
    }
    
}


function validateForm(title, author, pages) {
    const errors = {
        title: validateTitle(title),
        author: validateAuthor(author),
        pages: validatePageNumber(pages)
    }
    return handleErrors(errors);
}


function handleErrors(errors) {
    const keys = Object.keys(errors);
    let ammountOfErrors = 0;

    keys.forEach(key => {
       const error = errors[key];

       if (error) {
           ammountOfErrors++;
       }
    })

    if (ammountOfErrors === 0) {
       return true;
   }
}


function close(book) {
    let removeIndex = Number(book.parentNode.dataset.bookId);
    myLibrary.splice(removeIndex, 1);
    render();
}


function toggleReadStatus(book){
    let bookId = Number(book.parentNode.dataset.bookId);
    if (myLibrary[bookId].status === "read"){
        myLibrary[bookId].status = "unread";
    }
    else{
        myLibrary[bookId].status = "read";
    }
    render();
}


$form.onsubmit = function(){
    addBookToLibrary();
    return false;
}


$container.onclick = function(event) {
    const $element = event.target;
    if ($element.classList.contains('close')) {
        close($element);
    }
    if ($element.classList.contains('toggleStatus')) {
        toggleReadStatus($element);
    }
}


render();
