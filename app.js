document.body.onload = init();

// Init
function init() {
    createAddBookBtn();
    createForm();
    createAllEventListner();
    hideSearchForm();
    createResultsDivElt();
    createPochListDiv();
    loadPochList();
}

/* Create all div elements */

// Form div
function createDivElt() {

    const divElt = document.createElement("div");
    divElt.id = 'myDiv';
    document.getElementById("myBooks").appendChild(divElt);

}

// Search results div 
function createResultsDivElt() {

    const content = document.getElementById("content");

    const containerContent = document.createElement('div');
    containerContent.id = "container_contents";
    content.before(containerContent);

    const resultsContent = document.createElement('div');
    resultsContent.id = "resultsContent";
    containerContent.appendChild(resultsContent);

    const titleResultsContent = document.createElement('h2');
    titleResultsContent.id = 'titleResultsContent';
    titleResultsContent.className = 'h2';
    titleResultsContent.innerHTML = "Résultats de la recherche";
    titleResultsContent.hidden = true;
    resultsContent.before(titleResultsContent);

}

// PochList div 
function createPochListDiv() {

    const content = document.getElementById("content")
    const pochListDiv = document.createElement('div');
    pochListDiv.id = 'poch-list-content-div';
    content.appendChild(pochListDiv);

}

// Display results div
function displayResults() {

    let resultsContent = document.getElementById('resultsContent');
    resultsContent.style.display = "flex";
    let titleResultsContent = document.getElementById('titleResultsContent');
    titleResultsContent.hidden = false;

}

/* Create all form elements */

// Add search form DOM elements
function createForm() {

    createDivElt();
    createFormElements();

}

// Add button "Ajouter un livre"
function createAddBookBtn() {

    const divElt = document.getElementById('myBooks');

    const addbookBtnElt = document.createElement("button");
    addbookBtnElt.id = "addBookButton";
    addbookBtnElt.className = 'button';
    addbookBtnElt.textContent = "Ajouter un livre";
    addbookBtnElt.hidden = false;
    divElt.appendChild(addbookBtnElt);
}

// All form elements
function createFormElements() {

    const divElt = document.getElementById('myDiv');

    const inputTitleElt = document.createElement("input");
    inputTitleElt.id = "input-title";
    inputTitleElt.className = 'input';
    inputTitleElt.setAttribute("type", "text");
    inputTitleElt.setAttribute("placeholder", "Titre");
    divElt.appendChild(inputTitleElt);

    const inputAuthorElt = document.createElement("input");
    inputAuthorElt.id = "input-author";
    inputAuthorElt.className = 'input';
    inputAuthorElt.setAttribute("type", "text");
    inputAuthorElt.setAttribute("placeholder", "Auteur");
    divElt.appendChild(inputAuthorElt);

    const searchBtnElt = document.createElement("button");
    searchBtnElt.id = "search-button";
    searchBtnElt.className = 'button';
    searchBtnElt.textContent = "Rechercher";
    divElt.appendChild(searchBtnElt);

    const cancelBtnElt = document.createElement("button");
    cancelBtnElt.id = "cancel-button";
    cancelBtnElt.className = 'button';
    cancelBtnElt.textContent = "Annuler";
    divElt.appendChild(cancelBtnElt);

}

// Add all events listner
function createAllEventListner() {

    document.getElementById('addBookButton').addEventListener('click', function() {
        displaySearchForm();
    })
    document.getElementById('search-button').addEventListener('click', function() {
        displayResults();
        bookSearch();
        clearResults();
    })
    document.getElementById('cancel-button').addEventListener('click', function() {
        cancelSearch();
    })

}

/* FN : display and hide form */

// Hide form
function hideSearchForm() {

    const myDiv = document.getElementById('myDiv');
    myDiv.style.display = "none";
    const addbookBtnElt = document.getElementById('addBookButton');
    addbookBtnElt.style.display = "block";

}

// Display form 
function displaySearchForm() {

    const myDiv = document.getElementById('myDiv');
    myDiv.style.display = "flex";
    const addbookBtnElt = document.getElementById('addBookButton');
    addbookBtnElt.style.display = "none";

}

// Clear the pochlist
function clearPochlist() {

    const divElt = document.getElementById('poch-list-content-div');
    divElt.innerHTML = "";

}

// Cancel search
function cancelSearch() {

    const titleResultsContent = document.getElementById('titleResultsContent');
    titleResultsContent.hidden = true;
    hideSearchForm();
    clearPochlist();
    clearResults();
    loadPochList();
}

// Hide results 
function clearResults() {

    const resultsContent = document.getElementById('resultsContent');
    resultsContent.innerHTML = '';

}

/* Fn to search and display books */

// Search a book  
function bookSearch() {

    const request = new XMLHttpRequest();
    const title = document.getElementById('input-title').value;
    const author = document.getElementById('input-author').value;

    request.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {

            let response = JSON.parse(this.response);

            if (response.items.length == 0) {
                alert("Aucun livre trouvé");
            } else {
                response.items.map(item => {
                    displayBook(item.volumeInfo, item.id);
                })
            }
        }
    }
    request.open("GET", "https://www.googleapis.com/books/v1/volumes?q=:" + author + title);
    request.send();
}

// Search results: display books 
function displayBook(book, id) {
    const resultsContent = document.getElementById("resultsContent");

    const resultsDivElt = document.createElement("div");
    resultsDivElt.className = "resultsSearchDiv";
    resultsContent.appendChild(resultsDivElt);

    const bookMarkContainer = document.createElement("div");
    bookMarkContainer.className = "bookMarkContainer";
    resultsDivElt.appendChild(bookMarkContainer);

    bookmarkImg = document.createElement('img');
    bookmarkImg.id = 'bookmark-img';
    bookmarkImg.src = 'images/bookmark-solid.svg';
    bookMarkContainer.appendChild(bookmarkImg);

    addBookmarkListner(book, id);

    titleElt = document.createElement('h3');
    titleElt.className = 'h3';
    titleElt.textContent = 'Titre:' + '\t' + book.title;
    resultsDivElt.appendChild(titleElt);

    idElt = document.createElement('h4');
    idElt.className = 'h4';
    idElt.textContent = 'Id -' + '\t' + book.industryIdentifiers[0].type + '\t' + book.industryIdentifiers[0].identifier;
    resultsDivElt.appendChild(idElt);

    authorElt = document.createElement('h4');
    authorElt.className = 'h4';
    authorElt.textContent = 'Auteur:' + '\t' + book.authors[0];
    resultsDivElt.appendChild(authorElt);

    descriptionElt = document.createElement('p');
    descriptionElt.className = 'description';
    descriptionElt.textContent = book.description ? getDescription(book.description) : "Information manquante";
    resultsDivElt.appendChild(descriptionElt);

    img = document.createElement('img');
    img.id = 'img';
    img.src = book.imageLinks && book.imageLinks.smallThumbnail ? book.imageLinks.smallThumbnail : 'images/unavailable.png';
    resultsDivElt.appendChild(img);

}

// Counter description's characters
function getDescription(description) {

    if (description && description.length > 200) {
        return description.substring(0, 199) + "...";
    } else {
        return description;
    }

}

// Manage local storage 
function addBookmarkListner(book, id) {

    bookmarkImg.addEventListener('click', function() {

        if (localStorage.getItem('myBooks') == null) {
            localStorage.setItem('myBooks', JSON.stringify([{...book, id }]));
            displayBookToPochList(book, id);
        } else {
            let currentLocalStorage = JSON.parse(localStorage.getItem('myBooks'));

            let index = currentLocalStorage.findIndex(x => (x.id == id));
            // Check if book already exists in the local storage 
            if (index != -1) {
                alert('Un livre ne pas peut pas être ajouté 2 fois');
            } else {
                // Adding books to local storage 
                currentLocalStorage.push({...book, id });
                displayBookToPochList(book, id);
            }
            localStorage.setItem('myBooks', JSON.stringify(currentLocalStorage));
        }
        let myBooks = JSON.parse(localStorage.getItem('myBooks'));
    })
}

/* Fn adding, delating a book from the Poch'list */

// Add books to the poch'list

function displayBookToPochList(book, id) {

    const resultsContent = document.getElementById('poch-list-content-div');
    const resultsDivElt = document.createElement("div");

    const idBook = id;
    resultsDivElt.id = idBook;
    resultsDivElt.className = 'resultsPochList';
    resultsContent.appendChild(resultsDivElt);

    const trashEltContainer = document.createElement("div");
    trashEltContainer.className = "trashEltContainer";
    resultsDivElt.appendChild(trashEltContainer);

    trashElt = document.createElement('img');
    trashElt.id = 'trash-img';
    trashElt.src = 'images/minus-circle-solid.svg';
    trashEltContainer.appendChild(trashElt);

    addTrashListner(book, idBook);

    titleElt = document.createElement('h3');
    titleElt.className = 'h3';
    titleElt.textContent = 'Titre:' + '\t' + book.title;
    resultsDivElt.appendChild(titleElt);

    idElt = document.createElement('h4');
    idElt.className = 'h4';
    idElt.textContent = 'Id -' + '\t' + book.industryIdentifiers[0].type + '\t' + book.industryIdentifiers[0].identifier;
    resultsDivElt.appendChild(idElt);

    authorElt = document.createElement('h4');
    authorElt.className = 'h4';
    authorElt.textContent = 'Auteur:' + '\t' + book.authors[0];
    resultsDivElt.appendChild(authorElt);

    descriptionElt = document.createElement('p');
    descriptionElt.className = 'description';
    descriptionElt.textContent = book.description ? getDescription(book.description) : "Information manquante";
    resultsDivElt.appendChild(descriptionElt);

    img = document.createElement('img');
    img.id = 'img';
    img.src = book.imageLinks && book.imageLinks.smallThumbnail ? book.imageLinks.smallThumbnail : 'images/unavailable.png';
    resultsDivElt.appendChild(img);

}

// Remove books from the poch'list 
function addTrashListner(book, idBook) {

    trashElt.addEventListener('click', function() {

        const elt = document.getElementById(idBook);
        console.log('idbook' + idBook);
        elt.remove();

        let currentLocalStorage = JSON.parse(localStorage.getItem('myBooks'));
        let index = currentLocalStorage.findIndex(x => (x.id == idBook));
        if (index != -1) {
            currentLocalStorage.splice(index, 1);
        }
        localStorage.setItem('myBooks', JSON.stringify(currentLocalStorage));
    })
}

// Loading pochlist 
function loadPochList() {

    let myPochlist = JSON.parse(localStorage.getItem("myBooks"));

    myPochlist && myPochlist.forEach(book => {
        displayBookToPochList(book, book.id);
    });

}