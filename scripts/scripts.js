document.addEventListener('DOMContentLoaded', function() {
    // Home page functionality
    initializeHomePage();
    
    // Comic cover page functionality
    initializeComicCoverPage();
    
    // Comic reader functionality
    initializeComicReaderPage();
});

// Initialize the home page
function initializeHomePage() {
    const comicsContainer = document.querySelector('.comics');
    if (!comicsContainer) return;
    
    // Clear existing content
    comicsContainer.innerHTML = '';
    
    // Get all comics and render them
    const comics = getAllComics();
    comics.forEach(comic => {
        const comicElement = document.createElement('a');
        comicElement.href = `comic-cover/comic-cover.html?id=${comic.id}`;
        comicElement.className = 'comic';
        comicElement.innerHTML = `
            <img src="${comic.coverImage.replace('../', '')}" alt="${comic.title}">
            <p>${comic.title}</p>
        `;
        comicsContainer.appendChild(comicElement);
    });
}

// Initialize the comic cover page
function initializeComicCoverPage() {
    const comicDetailsSection = document.querySelector('.comic-details');
    if (!comicDetailsSection) return;
    
    // Get comic ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const comicId = urlParams.get('id');
    
    if (!comicId) return;
    
    // Get comic data
    const comic = getComicById(comicId);
    if (!comic) return;
    
    // Update comic details
    const coverImage = comicDetailsSection.querySelector('img');
    const titleElement = comicDetailsSection.querySelector('h1');
    const descriptionElement = comicDetailsSection.querySelector('p');
    const readFirstButton = comicDetailsSection.querySelector('.read-first');
    
    if (coverImage) coverImage.src = comic.coverImage;
    if (titleElement) titleElement.textContent = comic.title;
    if (descriptionElement) descriptionElement.textContent = comic.description;
    if (readFirstButton) readFirstButton.href = `../reader/reader.html?id=${comic.id}&chapter=${comic.firstChapter}`;
    
    // Update chapter buttons
    const chapterButtonsContainer = document.querySelector('.chapter-buttons');
    if (!chapterButtonsContainer) return;
    
    // Clear existing buttons
    chapterButtonsContainer.innerHTML = '';
    
    // Get chapters for this comic
    const chapters = getChaptersForComic(comic.id);
    
    // Add chapter buttons
    chapters.forEach(chapter => {
        const chapterButton = document.createElement('a');
        chapterButton.href = `../reader/reader.html?id=${comic.id}&chapter=${chapter.number}`;
        chapterButton.textContent = `Chapter ${chapter.number}`;
        chapterButtonsContainer.appendChild(chapterButton);
    });
}

// Initialize the comic reader page
function initializeComicReaderPage() {
    const comicImagesContainer = document.getElementById('comic-images');
    if (!comicImagesContainer) return;
    
    // Get comic ID and chapter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const comicId = urlParams.get('id');
    const chapter = urlParams.get('chapter') || 1;
    
    if (!comicId || !chapter) return;
    
    // Get comic data
    const comic = getComicById(comicId);
    if (!comic) return;
    
    // Set the comic title and chapter number
    const comicTitleElement = document.getElementById('comic-title');
    if (comicTitleElement) {
        comicTitleElement.textContent = `${comic.title} - Chapter ${chapter}`;
    }
    
    // Get chapter data
    const chapterData = comic.chapters[chapter];
    if (!chapterData) return;
    
    const totalImages = chapterData.totalImages;
    const imageFolder = `../images/comic${comicId}/chapter${chapter}/`;
    
    // Implement lazy loading for images
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const dataSrc = img.getAttribute('data-src');
                if (dataSrc) {
                    img.src = dataSrc;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    }, { rootMargin: "0px 0px 200px 0px" });
    
    // Create placeholder for each image
    for (let i = 1; i <= totalImages; i++) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'image-container';
        
        const img = document.createElement('img');
        img.alt = `Comic Page ${i}`;
        img.className = 'lazy-load';
        img.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" viewBox%3D"0 0 1 1"%3E%3C%2Fsvg%3E';
        img.setAttribute('data-src', `${imageFolder}${i}.jpg`);
        
        // Handle image loading errors
        img.onerror = function() {
            // Try PNG if JPG fails
            this.onerror = function() {
                console.error(`Failed to load image: ${imageFolder}${i}.jpg or ${imageFolder}${i}.png`);
                this.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" viewBox%3D"0 0 300 400"%3E%3Crect width%3D"300" height%3D"400" fill%3D"%23eee"%2F%3E%3Ctext x%3D"50%25" y%3D"50%25" dominant-baseline%3D"middle" text-anchor%3D"middle" font-family%3D"Arial" font-size%3D"20" fill%3D"%23999"%3EImage not found%3C%2Ftext%3E%3C%2Fsvg%3E';
            };
            this.src = `${imageFolder}${i}.png`;
        };
        
        imgContainer.appendChild(img);
        comicImagesContainer.appendChild(imgContainer);
        
        // Observe the image for lazy loading
        observer.observe(img);
    }
    
    // Navigation buttons functionality
    const prevChapterButton = document.getElementById('prev-chapter');
    const nextChapterButton = document.getElementById('next-chapter');
    const prevChapterButtonBottom = document.getElementById('prev-chapter-bottom');
    const nextChapterButtonBottom = document.getElementById('next-chapter-bottom');
    const backToCoverButton = document.getElementById('back-to-cover');
    const backToCoverButtonBottom = document.getElementById('back-to-cover-bottom');
    
    // Get all chapters for this comic
    const chapters = getChaptersForComic(comicId);
    const chapterNumbers = chapters.map(ch => ch.number);
    
    // Find current chapter index
    const currentChapterIndex = chapterNumbers.indexOf(parseInt(chapter));
    
    // Set up navigation links
    if (prevChapterButton && currentChapterIndex < chapterNumbers.length - 1) {
        const prevChapterNum = chapterNumbers[currentChapterIndex + 1];
        prevChapterButton.href = `reader.html?id=${comicId}&chapter=${prevChapterNum}`;
        if (prevChapterButtonBottom) prevChapterButtonBottom.href = prevChapterButton.href;
    } else {
        if (prevChapterButton) {
            prevChapterButton.classList.add('disabled');
            prevChapterButton.href = '#';
        }
        if (prevChapterButtonBottom) {
            prevChapterButtonBottom.classList.add('disabled');
            prevChapterButtonBottom.href = '#';
        }
    }
    
    if (nextChapterButton && currentChapterIndex > 0) {
        const nextChapterNum = chapterNumbers[currentChapterIndex - 1];
        nextChapterButton.href = `reader.html?id=${comicId}&chapter=${nextChapterNum}`;
        if (nextChapterButtonBottom) nextChapterButtonBottom.href = nextChapterButton.href;
    } else {
        if (nextChapterButton) {
            nextChapterButton.classList.add('disabled');
            nextChapterButton.href = '#';
        }
        if (nextChapterButtonBottom) {
            nextChapterButtonBottom.classList.add('disabled');
            nextChapterButtonBottom.href = '#';
        }
    }
    
    if (backToCoverButton) {
        backToCoverButton.href = `../comic-cover/comic-cover.html?id=${comicId}`;
        if (backToCoverButtonBottom) backToCoverButtonBottom.href = backToCoverButton.href;
    }
    
    // Event listener for keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft' && !prevChapterButton.classList.contains('disabled')) {
            // Navigate to the previous chapter
            window.location.href = prevChapterButton.href;
        } else if (event.key === 'ArrowRight' && !nextChapterButton.classList.contains('disabled')) {
            // Navigate to the next chapter
            window.location.href = nextChapterButton.href;
        }
    });
}
