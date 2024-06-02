document.addEventListener('DOMContentLoaded', function () {
    const comicImagesContainer = document.getElementById('comic-images');
    const chapter = new URLSearchParams(window.location.search).get('chapter') || 1;

    // Define the total number of images for each chapter of comic 2 (reader-2)
    const totalImagesPerChapterReader2 = {
        1: 20, // Adjust as needed for each chapter
        2: 30,
        3: 22,
        // Add more chapters as needed
    };

    const totalImages = totalImagesPerChapterReader2[chapter]; // Get the total images for the current chapter

    const imageFolder = `../images/comic2/chapter${chapter}/`; // Assuming images are stored in folders named by chapter

    for (let i = 0; i <= totalImages; i++) {
        const img = document.createElement('img');
        img.src = `${imageFolder}${i}.jpg`; // Adjust the image file format if needed
        img.alt = `Comic Page ${i}`;
        comicImagesContainer.appendChild(img);
    }

    // Navigation buttons functionality
    const prevChapterButton = document.getElementById('prev-chapter');
    const nextChapterButton = document.getElementById('next-chapter');
    const prevChapterButtonBottom = document.getElementById('prev-chapter-bottom');
    const nextChapterButtonBottom = document.getElementById('next-chapter-bottom');

    prevChapterButton.href = `reader-2.html?chapter=${Math.max(1, chapter - 1)}`;
    nextChapterButton.href = `reader-2.html?chapter=${parseInt(chapter) + 1}`;
    prevChapterButtonBottom.href = prevChapterButton.href;
    nextChapterButtonBottom.href = nextChapterButton.href;
});
