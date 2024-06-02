document.addEventListener('DOMContentLoaded', function() {
    const comicImagesContainer = document.getElementById('comic-images');
    const chapter = new URLSearchParams(window.location.search).get('chapter') || 1;

    // Define the total number of images for each chapter of comic 1 (reader-1)
    const totalImagesPerChapterReader1 = {
        1: 46, // Adjust as needed for each chapter
        2: 35,
        3: 28,
        // Add more chapters as needed
    };

    const totalImages = totalImagesPerChapterReader1[chapter]; // Get the total images for the current chapter

    const imageFolder = `../images/comic1/chapter${chapter}/`;  // Assuming images are stored in folders named by chapter

    for (let i = 1; i <= totalImages; i++) {
        const img = document.createElement('img');
        img.src = `${imageFolder}${i}.jpg`;  // Adjust the image file format if needed
        img.alt = `Comic Page ${i}`;
        comicImagesContainer.appendChild(img);
    }

    // Navigation buttons functionality
    const prevChapterButton = document.getElementById('prev-chapter');
    const nextChapterButton = document.getElementById('next-chapter');
    const prevChapterButtonBottom = document.getElementById('prev-chapter-bottom');
    const nextChapterButtonBottom = document.getElementById('next-chapter-bottom');

    prevChapterButton.href = `reader-1.html?chapter=${Math.max(1, chapter - 1)}`;
    nextChapterButton.href = `reader-1.html?chapter=${parseInt(chapter) + 1}`;
    prevChapterButtonBottom.href = prevChapterButton.href;
    nextChapterButtonBottom.href = nextChapterButton.href;
});



