document.addEventListener('DOMContentLoaded', function () {
    const comicImagesContainer = document.getElementById('comic-images');
    const chapter = new URLSearchParams(window.location.search).get('chapter') || 1;

    // Define the total number of images for each chapter of comic 2 (reader-2)
    const totalImagesPerChapterReader2 = {
        1: 8, // Adjust as needed for each chapter
        2: 6,
        3: 7,
        4: 7,
        5: 6,
        6: 28,
        7: 30,
        8: 30,
        // Add more chapters as needed
    };

    const totalImages = totalImagesPerChapterReader2[chapter]; // Get the total images for the current chapter

    const imageFolder = `../images/comic2/chapter${chapter}/`; // Assuming images are stored in folders named by chapter

    for (let i = 0; i <= totalImages; i++) {
        loadImageOrPdf(`${imageFolder}${i}`);
    }

    function loadImageOrPdf(basePath) {
        const img = document.createElement('img');
        img.alt = `Comic Page`;

        // Try loading .jpg first
        img.onerror = function() {
            // If .jpg fails, try .webp
            img.onerror = function() {
                // If .webp fails, try .pdf
                img.onerror = function() {
                    console.error(`Failed to load image: ${basePath}.jpg, ${basePath}.webp, or ${basePath}.pdf`);
                };
                loadPdf(`${basePath}.pdf`);
            };
            img.src = `${basePath}.webp`;
        };
        img.src = `${basePath}.jpg`;

        comicImagesContainer.appendChild(img);
    }

   // Set the comic title and chapter number
   const comicTitleElement = document.getElementById('comic-title');
   comicTitleElement.textContent = `Musician Genius Who Lives Twice - Chapter ${chapter}`;

    // Navigation buttons functionality
    const prevChapterButton = document.getElementById('prev-chapter');
    const nextChapterButton = document.getElementById('next-chapter');
    const prevChapterButtonBottom = document.getElementById('prev-chapter-bottom');
    const nextChapterButtonBottom = document.getElementById('next-chapter-bottom');

    prevChapterButton.href = `reader-2.html?chapter=${Math.max(1, chapter - 1)}`;
    nextChapterButton.href = `reader-2.html?chapter=${parseInt(chapter) + 1}`;
    prevChapterButtonBottom.href = prevChapterButton.href;
    nextChapterButtonBottom.href = nextChapterButton.href;
    // Event listener for keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            // Navigate to the previous chapter
            window.location.href = prevChapterButton.href;
        } else if (event.key === 'ArrowRight') {
            // Navigate to the next chapter
            window.location.href = nextChapterButton.href;
        }
    });
});
