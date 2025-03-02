/**
 * Admin utility functions for managing comics
 * This file is not loaded on the main site, but can be used by administrators
 * to help manage the comics data.
 */

// Function to add a new comic
function addNewComic(id, title, coverImage, description, firstChapter) {
    // Load the current comics data
    const comicsDataScript = document.createElement('script');
    comicsDataScript.src = 'comics-data.js';
    document.body.appendChild(comicsDataScript);
    
    comicsDataScript.onload = function() {
        // Add the new comic
        comicsData.comics.push({
            id: id,
            title: title,
            coverImage: coverImage,
            description: description,
            firstChapter: firstChapter,
            chapters: {}
        });
        
        // Generate the updated comics-data.js content
        const updatedContent = generateComicsDataContent(comicsData);
        
        // Display the updated content for copying
        const outputDiv = document.getElementById('output') || document.createElement('div');
        outputDiv.id = 'output';
        outputDiv.innerHTML = `<h3>Updated comics-data.js</h3>
            <pre>${updatedContent}</pre>
            <button onclick="copyToClipboard()">Copy to Clipboard</button>`;
        document.body.appendChild(outputDiv);
    };
}

// Function to add a chapter to a comic
function addChapterToComic(comicId, chapterNumber, totalImages) {
    // Load the current comics data
    const comicsDataScript = document.createElement('script');
    comicsDataScript.src = 'comics-data.js';
    document.body.appendChild(comicsDataScript);
    
    comicsDataScript.onload = function() {
        // Find the comic
        const comic = comicsData.comics.find(c => c.id === comicId);
        if (!comic) {
            alert(`Comic with ID ${comicId} not found!`);
            return;
        }
        
        // Add the chapter
        comic.chapters[chapterNumber] = { totalImages: totalImages };
        
        // Generate the updated comics-data.js content
        const updatedContent = generateComicsDataContent(comicsData);
        
        // Display the updated content for copying
        const outputDiv = document.getElementById('output') || document.createElement('div');
        outputDiv.id = 'output';
        outputDiv.innerHTML = `<h3>Updated comics-data.js</h3>
            <pre>${updatedContent}</pre>
            <button onclick="copyToClipboard()">Copy to Clipboard</button>`;
        document.body.appendChild(outputDiv);
    };
}

// Function to generate the comics-data.js content
function generateComicsDataContent(data) {
    let content = '// Comics data structure\nconst comicsData = {\n    comics: [\n';
    
    // Add each comic
    data.comics.forEach((comic, index) => {
        content += '        {\n';
        content += `            id: ${comic.id},\n`;
        content += `            title: "${comic.title}",\n`;
        content += `            coverImage: "${comic.coverImage}",\n`;
        content += `            description: "${comic.description}",\n`;
        content += `            firstChapter: ${comic.firstChapter},\n`;
        content += '            chapters: {\n';
        
        // Add each chapter
        Object.keys(comic.chapters).forEach((chapterNum, chIndex) => {
            const chapter = comic.chapters[chapterNum];
            content += `                ${chapterNum}: { totalImages: ${chapter.totalImages} }`;
            if (chIndex < Object.keys(comic.chapters).length - 1) {
                content += ',\n';
            } else {
                content += '\n';
            }
        });
        
        content += '            }\n';
        content += '        }';
        if (index < data.comics.length - 1) {
            content += ',\n';
        } else {
            content += '\n';
        }
    });
    
    content += '    ]\n};\n\n';
    
    // Add utility functions
    content += `// Function to get comic by ID
function getComicById(id) {
    return comicsData.comics.find(comic => comic.id === parseInt(id));
}

// Function to get all comics
function getAllComics() {
    return comicsData.comics;
}

// Function to get chapters for a comic
function getChaptersForComic(comicId) {
    const comic = getComicById(comicId);
    if (!comic) return null;
    
    const chapters = [];
    for (const chapterNum in comic.chapters) {
        chapters.push({
            number: parseInt(chapterNum),
            ...comic.chapters[chapterNum]
        });
    }
    
    // Sort chapters in descending order (newest first)
    return chapters.sort((a, b) => b.number - a.number);
}`;
    
    return content;
}

// Function to copy content to clipboard
function copyToClipboard() {
    const outputDiv = document.getElementById('output');
    if (!outputDiv) return;
    
    const pre = outputDiv.querySelector('pre');
    if (!pre) return;
    
    const textArea = document.createElement('textarea');
    textArea.value = pre.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    alert('Copied to clipboard!');
} 