const form = document.querySelector('#task-form');
const bookInput = document.querySelector('#book');
const authorInput = document.querySelector('#author');
const bookList = document.querySelector('.collection');
const filter = document.querySelector('#filter');
const clearBtn = document.querySelector('.clear-tasks');

loadEventListeners();
loadBooks();

function loadEventListeners() {
    form.addEventListener('submit', addBook);
    bookList.addEventListener('click', removeBook);
    clearBtn.addEventListener('click', clearAll);
}

function addBook(event){
    if(bookInput.value === '' || authorInput.value === '') {
        alert('Pealkiri ja autor on kohustuslikud');
    } else {
        const li = document.createElement('li');
        li.className = 'collection-item';
        li.appendChild(document.createTextNode('"' + bookInput.value + '" ' + authorInput.value));
        bookList.appendChild(li);
        const removeLink = document.createElement('a'); // lisab eemaldamise lingi
        removeLink.className = 'delete-item secondary-content';
        removeLink.innerHTML = 'X';
        li.appendChild(removeLink);
        storeInLocalStorage(bookInput.value, authorInput.value);
        bookInput.value = ''; // kustutab sisestatud pealkirja
        document.getElementsByTagName('label').classList.remove('active'); // et label tagasi suureks muutuks
        authorInput.value = '';
    }
    event.preventDefault();
}

function removeBook(event) {
    if(event.target.classList.contains('delete-item')) {
        let bookID = event.target.parentElement.id;
        if(confirm('Oled kindel?')) {
            event.target.parentElement.remove(); // eemaldab li elemendi
            let books = JSON.parse(localStorage.getItem('books'));
            let book = bookID.split('ppppp'); // juhul kui pealkirjas või autori nimes peaks olema järjest 5p-d siis ei leia õiget raamatut
            books.forEach(function(element, index) { // otsib pealkirja ja autori järgi õige raamatu
                if(book[0] == element[0] && book[1] == element[1]) {
                    books.splice(index, 1); // eemaldab raamatu
                }
            });
            localStorage.removeItem('books'); // kustutab vana info
            localStorage.setItem('books', JSON.stringify(books)); // salvestab uue info
        }
        
    }
}

function storeInLocalStorage(book, author) {
    let tasks;
    if(localStorage.getItem('books') === null) { // kontrollib, kas varem on salvestatud
        tasks = [];
    } else {
        tasks = JSON.parse(localStorage.getItem('books'));
    }
    tasks.push([book, author]); // lisab uue
    localStorage.setItem('books', JSON.stringify(tasks));
}

function loadBooks() {
    let books;
    if(localStorage.getItem('books') != null) {
        books = JSON.parse(localStorage.getItem('books'));
        books.forEach(element => {
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.appendChild(document.createTextNode('"' + element[0] + '" ' + element[1]));
            li.id = element[0] + "ppppp" + element[1]; // lisab li elemendile id, kustutamisel on vaja
            bookList.appendChild(li);
            const removeLink = document.createElement('a'); // lisab eemaldamise lingi
            removeLink.className = 'delete-item secondary-content';
            removeLink.innerHTML = 'X';
            li.appendChild(removeLink);
        });
    }
}

function clearAll() {
    if(confirm('Oled kindel?')) {
        localStorage.removeItem('books');
        document.getElementById('booklist').innerHTML = '';
    }
}