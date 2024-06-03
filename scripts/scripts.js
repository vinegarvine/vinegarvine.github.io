document.addEventListener('DOMContentLoaded', function() {
    const comicImagesContainer = document.getElementById('comic-images');
    const chapter = new URLSearchParams(window.location.search).get('chapter') || 1;

    // Define the total number of images for each chapter of comic 1 (reader-1)
    const totalImagesPerChapterReader1 = {
        1: 46, // Adjust as needed for each chapter
        2: 36,
        3: 33,
        4: 32,


        // Add more chapters as needed
    };

    const totalImages = totalImagesPerChapterReader1[chapter]; // Get the total images for the current chapter

    const imageFolder = `../images/comic1/chapter${chapter}/`;  // Assuming images are stored in folders named by chapter

    for (let i = 1; i <= totalImages; i++) {
        loadImageOrPdf(`${imageFolder}${i}`);
    }

    function loadImageOrPdf(basePath) {
        const img = document.createElement('img');
        img.alt = `Comic Page`;

        // Try loading .jpg first
        img.onerror = function() {
            // If .jpg fails, try .png
            img.onerror = function() {
                // If .png fails, try .pdf
                img.onerror = function() {
                    console.error(`Failed to load image: ${basePath}.jpg, ${basePath}.png, or ${basePath}.pdf`);
                };
                loadPdf(`${basePath}.pdf`);
            };
            img.src = `${basePath}.png`;
        };
        img.src = `${basePath}.jpg`;

        comicImagesContainer.appendChild(img);
    }

    function loadPdf(url) {
        const loadingTask = pdfjsLib.getDocument(url);
        loadingTask.promise.then(function(pdf) {
            console.log('PDF loaded');

            // Fetch the first page
            const pageNumber = 1;
            pdf.getPage(pageNumber).then(function(page) {
                console.log('Page loaded');

                const scale = 1.5;
                const viewport = page.getViewport({scale: scale});

                // Prepare canvas using PDF page dimensions
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render PDF page into canvas context
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                const renderTask = page.render(renderContext);
                renderTask.promise.then(function() {
                    console.log('Page rendered');
                    comicImagesContainer.appendChild(canvas);
                });
            });
        }, function(reason) {
            console.error(reason);
        });
    }

    // Set the comic title and chapter number
    const comicTitleElement = document.getElementById('comic-title');
    comicTitleElement.textContent = `I Parry Everything - Chapter ${chapter}`;


    // Navigation buttons functionality
    const prevChapterButton = document.getElementById('prev-chapter');
    const nextChapterButton = document.getElementById('next-chapter');
    const prevChapterButtonBottom = document.getElementById('prev-chapter-bottom');
    const nextChapterButtonBottom = document.getElementById('next-chapter-bottom');

    prevChapterButton.href = `reader-1.html?chapter=${Math.max(1, chapter - 1)}`;
    nextChapterButton.href = `reader-1.html?chapter=${parseInt(chapter) + 1}`;
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
