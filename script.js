const modal = document.getElementById('modal');
const modalShow = document.getElementById('title-text');
const modalClose = document.getElementById('close-modal')
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmark-container');

var bookmarks = [];

// Show Model, Focus on Input
function showModel(){
    modal.classList.add("show-modal");
    websiteNameEl.focus();
}

// Validate form
function validate(nameValue, urlValue){
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if(!nameValue || !urlValue){
        alert("Please submit value for both fields");
        return false;
    }
    if(urlValue.match(regex)){
        return true;
    }
    if(!urlValue.match(regex)){
        alert("Please provide valid URL");
        return false;
    }
    return true;
}

// Build Bookmarks DOM
function buildBookmarks()
{
    // Remove all bookmarks elements
    bookmarksContainer.textContent = '';

    // Build Item
    bookmarks.forEach((bookmark)=>{
        const { name, url } = bookmark;
        // console.log(name, url);
        const item = document.createElement('div');
        item.classList.add('item');
        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-times');
        icon.setAttribute('id','delete-bookmark');
        icon.setAttribute('title','delete-bookmark');
        const names = document.createElement('div');
        names.classList.add('name');
        const image = document.createElement('img');
        image.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}`);
        image.setAttribute('alt', 'Favicon');
        const anchor = document.createElement('a');
        anchor.setAttribute('href', url);
        anchor.setAttribute('target', '_blank');
        anchor.innerHTML = name;
        names.appendChild(image);
        names.appendChild(anchor)
        item.appendChild(icon);
        item.appendChild(names);
        bookmarksContainer.appendChild(item);
        icon.setAttribute('onclick', `deleteBookmark('${url}')`);
    });
}

function fetchBookmarks(){
    // Get bookmarks from local storage if available
    
    const fetchedItem = localStorage.getItem('bookmarks');
    if(fetchedItem != null){
        bookmarks = JSON.parse(fetchedItem);
    }
    else{
        bookmarks = [
            {
                name: 'Google',
                value: 'https://www.google.com/',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

function storeBookmark(e){
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if(!urlValue.includes('https://')&&!urlValue.includes('http://')){
        urlValue = `https://${urlValue}`;
    }
    if(!validate(nameValue, urlValue)){
        return false;
    }

    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    console.log(JSON.stringify(bookmarks));
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

function deleteBookmark(url){
    bookmarks.forEach((bookmark, i)=>{
        if(bookmark.url === url){
            bookmarks.splice(i, 1);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            fetchBookmarks();
        }
    });
}


// Modal Event Listeners
modalShow.addEventListener('click', showModel);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
// window.addEventListener('click', (e)=>console.log(e.target));
// window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false ));
bookmarkForm.addEventListener('submit', storeBookmark);
// Onload Fetch Bookmarks
fetchBookmarks();