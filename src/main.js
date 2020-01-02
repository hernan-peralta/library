const $titleInput = document.querySelector("#title-input");
const $authorInput = document.querySelector("#author-input");
const $pagesInput = document.querySelector("#pages-input");
const $status = document.querySelectorAll('.form-check-input');
const $form = document.querySelector("#form");
const $container = document.querySelector('.container');
let myLibrary = [];


function Book(title, author, pages, status) {
    this.Title = title;
    this.Author = author;
    this.Pages = pages;
    this.Status = status;
}


myLibrary.push(new Book("I, Robot","Isaac Asimov", 224, "read"));
myLibrary.push(new Book("Cosmos", "Carl sagan", 384, "read"));


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
    for (let i = 0; i < $status.length; i++) {
        if($status[i].checked){
            return $status[i].value;
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
    });

    if (ammountOfErrors === 0) {
       return true;
   }
}


function close(book) {
    let removeIndex = Number(book.parentNode.dataset.bookId);
    myLibrary.splice(removeIndex, 1);
    render();
}


Book.prototype.toggleStatus = function (){
    if (this.Status === "read"){
        this.Status = "unread";
    }
    else{
       this.Status = "read";
    }
    render();
}


$form.onsubmit = function(){
    addBookToLibrary();
    return false;
}


$container.onclick = function(event) {
    const $element = event.target;
    if ($element.classList.contains('close') || $element.parentNode.classList.contains('close')) { //the second condition is because the click is detected in the span element which doesn't have the 'close' class
        close($element);
    }
    if ($element.classList.contains('toggleStatus')) {
        let bookId = Number($element.parentNode.dataset.bookId);
        myLibrary[bookId].toggleStatus();
    }
}


render();
