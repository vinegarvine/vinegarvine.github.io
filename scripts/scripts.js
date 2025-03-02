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
    
    // Add a loading message
    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'Loading chapters...';
    loadingMessage.id = 'loading-chapters';
    chapterButtonsContainer.appendChild(loadingMessage);
    
    // Check which chapters actually exist in the file system
    checkAvailableChapters(comic.id).then(availableChapters => {
        console.log(`Available chapters for comic ${comic.id}:`, availableChapters);
        
        // Remove loading message
        const loadingMsg = document.getElementById('loading-chapters');
        if (loadingMsg) loadingMsg.remove();
        
        // Get chapters for this comic from data
        const chapters = getChaptersForComic(comic.id);
        console.log(`Chapters from data for comic ${comic.id}:`, chapters);
        
        // Filter chapters to only include those that exist in the file system
        const filteredChapters = chapters.filter(chapter => 
            availableChapters.includes(chapter.number.toString())
        );
        console.log(`Filtered chapters for comic ${comic.id}:`, filteredChapters);
        
        // If no chapters are available after filtering, show a message
        if (filteredChapters.length === 0) {
            const noChaptersMsg = document.createElement('p');
            noChaptersMsg.textContent = 'No chapters available yet.';
            noChaptersMsg.style.textAlign = 'center';
            chapterButtonsContainer.appendChild(noChaptersMsg);
            return;
        }
        
        // Add chapter buttons
        filteredChapters.forEach(chapter => {
            const chapterButton = document.createElement('a');
            chapterButton.href = `../reader/reader.html?id=${comic.id}&chapter=${chapter.number}`;
            chapterButton.textContent = `Chapter ${chapter.number}`;
            chapterButtonsContainer.appendChild(chapterButton);
        });
    }).catch(error => {
        console.error('Error loading chapters:', error);
        
        // Remove loading message
        const loadingMsg = document.getElementById('loading-chapters');
        if (loadingMsg) loadingMsg.remove();
        
        // Show error message
        const errorMsg = document.createElement('p');
        errorMsg.textContent = 'Error loading chapters. Please try again later.';
        errorMsg.style.textAlign = 'center';
        errorMsg.style.color = 'red';
        chapterButtonsContainer.appendChild(errorMsg);
    });
}

// Function to check which chapters actually exist in the file system
async function checkAvailableChapters(comicId) {
    try {
        console.log(`Checking available chapters for comic ${comicId}...`);
        
        // Use fetch to get the chapters.json file
        const response = await fetch(`../images/comic${comicId}/chapters.json`);
        
        // If the chapters.json file exists, use it
        if (response.ok) {
            const data = await response.json();
            console.log(`Found chapters.json for comic ${comicId}:`, data);
            
            if (data && data.availableChapters && Array.isArray(data.availableChapters)) {
                return data.availableChapters;
            } else {
                console.error(`Invalid format in chapters.json for comic ${comicId}`);
                return [];
            }
        } else {
            console.warn(`No chapters.json found for comic ${comicId}, falling back to detection`);
        }
        
        // If no chapters.json file, fall back to checking for common patterns
        // This is a fallback that tries to detect which chapters exist
        const availableChapters = [];
        const chapters = getChaptersForComic(comicId);
        
        // For each chapter in the data, check if it exists by trying to load a test image
        for (const chapter of chapters) {
            const chapterNum = chapter.number;
            const testImg = new Image();
            testImg.src = `../images/comic${comicId}/chapter${chapterNum}/1.jpg`;
            
            try {
                await new Promise((resolve, reject) => {
                    testImg.onload = () => resolve();
                    testImg.onerror = () => reject();
                    // Set a timeout in case the image takes too long to load
                    setTimeout(reject, 1000);
                });
                
                // If we get here, the image loaded successfully
                availableChapters.push(chapterNum.toString());
            } catch (e) {
                // Image failed to load, chapter might not exist
                console.log(`Chapter ${chapterNum} does not seem to exist`);
            }
        }
        
        return availableChapters;
    } catch (error) {
        console.error('Error checking available chapters:', error);
        // If all else fails, just return all chapters from the data
        const allChapters = getChaptersForComic(comicId).map(ch => ch.number.toString());
        console.log(`Falling back to all chapters for comic ${comicId}:`, allChapters);
        return allChapters;
    }
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
    
    // Get the loading indicator
    const loadingIndicator = comicImagesContainer.querySelector('.loading-indicator');
    
    const totalImages = chapterData.totalImages;
    const imageFolder = `../images/comic${comicId}/chapter${chapter}/`;
    
    // Counter for loaded images
    let loadedImagesCount = 0;
    
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
        
        // Handle image loading events
        img.onload = function() {
            loadedImagesCount++;
            
            // If all images have loaded, hide the loading indicator
            if (loadedImagesCount >= totalImages && loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        };
        
        // Handle image loading errors
        img.onerror = function() {
            // Try PNG if JPG fails
            this.onerror = function() {
                console.error(`Failed to load image: ${imageFolder}${i}.jpg or ${imageFolder}${i}.png`);
                this.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D"http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg" viewBox%3D"0 0 300 400"%3E%3Crect width%3D"300" height%3D"400" fill%3D"%23eee"%2F%3E%3Ctext x%3D"50%25" y%3D"50%25" dominant-baseline%3D"middle" text-anchor%3D"middle" font-family%3D"Arial" font-size%3D"20" fill%3D"%23999"%3EImage not found%3C%2Ftext%3E%3C%2Fsvg%3E';
                
                // Count this as loaded even if it failed
                loadedImagesCount++;
                
                // If all images have been processed, hide the loading indicator
                if (loadedImagesCount >= totalImages && loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                }
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
