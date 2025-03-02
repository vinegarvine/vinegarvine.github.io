// Comics data structure
const comicsData = {
    comics: [
        {
            id: 1,
            title: "Trauma Center: Golden Hour",
            coverImage: "../images/COVERS/TC_cover.png",
            description: "Patients who could be saved are dying. This will no longer happen. A zealous lunatic. The fierce angel of the trauma center. Trauma surgeon Baek Kang-hyeok and his project to revive the trauma center.",
            firstChapter: 92,
            chapters: {
                1: { totalImages: 46 },
                2: { totalImages: 36 },
                3: { totalImages: 33 },
                4: { totalImages: 32 },
                5: { totalImages: 30 },
                6: { totalImages: 35 },
                7: { totalImages: 35 },
                8: { totalImages: 33 },
                9: { totalImages: 34 },
                10: { totalImages: 38 },
                11: { totalImages: 33 },
                12: { totalImages: 29 },
                13: { totalImages: 38 },
                14: { totalImages: 40 },
                15: { totalImages: 18 },
                16: { totalImages: 17 },
                17: { totalImages: 23 },
                92: { totalImages: 30 },
                93: { totalImages: 30 }
            }
        },
        {
            id: 2,
            title: "Musician Genius Who Lives Twice",
            coverImage: "../images/COVERS/naka-cover.jpg",
            description: "A story about a musician genius who gets a second chance at life.",
            firstChapter: 1,
            chapters: {
                1: { totalImages: 30 }
                // Add more chapters as they become available
            }
        },
        {
            id: 3,
            title: "Title Placeholder 3",
            coverImage: "../images/comic3/cover.jpg",
            description: "Description for comic 3",
            firstChapter: 1,
            chapters: {
                1: { totalImages: 20 }
                // Add more chapters as they become available
            }
        },
        {
            id: 4,
            title: "Title Placeholder 4",
            coverImage: "../images/comic4/cover.jpg",
            description: "Description for comic 4",
            firstChapter: 1,
            chapters: {
                1: { totalImages: 20 }
                // Add more chapters as they become available
            }
        }
    ]
};

// Function to get comic by ID
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
} 