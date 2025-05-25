const bookListEl = document.getElementById('book-list');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const errorMessage = document.getElementById('error-message'); // Make sure you have this div in your HTML

let books = [];

// Load books from localStorage on start
function loadBooks() {
  const stored = localStorage.getItem('books');
  books = stored ? JSON.parse(stored) : [];
  renderBooks();
}

// Save books to localStorage
function saveBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

// Render books with filter and sort applied
function renderBooks() {
  const filterText = searchInput.value.toLowerCase();

  let filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(filterText) ||
    book.author.toLowerCase().includes(filterText)
  );

  const sortBy = sortSelect.value;
  if (sortBy === 'title') {
    filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === 'author') {
    filteredBooks.sort((a, b) => a.author.localeCompare(b.author));
  } else if (sortBy === 'status') {
    filteredBooks.sort((a, b) => a.status.localeCompare(b.status));
  }

  bookListEl.innerHTML = '';

  filteredBooks.forEach((book, index) => {
    const card = createBookCard(book, index);
    bookListEl.appendChild(card);
  });
}

// Create a book card element with edit/delete buttons
function createBookCard(book, index) {
  const card = document.createElement('div');
  card.className = 'book-card';

  const titleEl = document.createElement('h3');
  titleEl.contentEditable = true;
  titleEl.textContent = book.title;
  titleEl.addEventListener('blur', () => {
    books[index].title = titleEl.textContent.trim();
    saveBooks();
    renderBooks();
  });

  const authorEl = document.createElement('p');
  authorEl.contentEditable = true;
  authorEl.textContent = `Author: ${book.author}`;
  authorEl.addEventListener('blur', () => {
    books[index].author = authorEl.textContent.replace(/^Author:\s*/, '').trim();
    saveBooks();
    renderBooks();
  });

  const statusEl = document.createElement('select');
  ['to-read', 'reading', 'finished'].forEach(status => {
    const option = document.createElement('option');
    option.value = status;
    option.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    if (book.status === status) option.selected = true;
    statusEl.appendChild(option);
  });
  statusEl.addEventListener('change', () => {
    books[index].status = statusEl.value;
    saveBooks();
    renderBooks();
  });

  const notesEl = document.createElement('p');
  notesEl.contentEditable = true;
  notesEl.textContent = book.notes || 'No notes';
  notesEl.style.fontStyle = 'italic';
  notesEl.addEventListener('blur', () => {
    books[index].notes = notesEl.textContent.trim();
    saveBooks();
    renderBooks();
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.style.marginTop = '0.5rem';
  deleteBtn.style.backgroundColor = '#e53935';
  deleteBtn.style.color = 'white';
  deleteBtn.style.border = 'none';
  deleteBtn.style.borderRadius = '5px';
  deleteBtn.style.cursor = 'pointer';
  deleteBtn.addEventListener('click', () => {
    books.splice(index, 1);
    saveBooks();
    renderBooks();
  });

  card.appendChild(titleEl);
  card.appendChild(authorEl);
  card.appendChild(statusEl);
  card.appendChild(notesEl);
  card.appendChild(deleteBtn);

  return card;
}

// Add book from form with duplicate check
const form = document.getElementById('book-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const newTitle = form.title.value.trim();
  const newAuthor = form.author.value.trim();
  const newStatus = form.status.value;
  const newNotes = form.notes.value.trim();

  // Check for duplicate title (case-insensitive)
  const duplicate = books.some(book => book.title.toLowerCase() === newTitle.toLowerCase());

  if (duplicate) {
    errorMessage.textContent = 'This book already exists on your shelf!';
    errorMessage.style.display = 'block';
    return;
  } else {
    errorMessage.style.display = 'none';
  }

  const newBook = {
    title: newTitle,
    author: newAuthor,
    status: newStatus,
    notes: newNotes
  };

  books.push(newBook);
  saveBooks();
  renderBooks();
  form.reset();
});

// Filter and sort on input/change
searchInput.addEventListener('input', renderBooks);
sortSelect.addEventListener('change', renderBooks);

// Initial load
loadBooks();

