# Gem Scans Comic Reader

A scalable comic reading website that allows users to read comics online.

## Features

- Dynamic comic loading
- Lazy loading of images for better performance
- Mobile-responsive design
- Chapter navigation
- Admin interface for managing comics and chapters

## Directory Structure

```
/
├── index.html                  # Main page
├── styles/
│   └── styles.css              # CSS styles
├── scripts/
│   ├── comics-data.js          # Comic data structure
│   ├── scripts.js              # Main JavaScript functionality
│   └── admin.js                # Admin utility functions
├── images/
│   ├── COVERS/                 # Comic cover images
│   ├── comic1/                 # Images for comic 1
│   │   ├── chapters.json       # Available chapters for comic 1
│   │   ├── chapter1/           # Images for chapter 1
│   │   │   ├── 1.jpg           # Page 1
│   │   │   ├── 2.jpg           # Page 2
│   │   │   └── ...             # More pages
│   │   └── ...                 # More chapters
│   └── ...                     # More comics
├── comic-cover/
│   └── comic-cover.html        # Comic cover page template
├── reader/
│   └── reader.html             # Comic reader template
└── admin/
    └── index.html              # Admin interface
```

## How It Works

1. **Comic Data Structure**: All comic information is stored in `scripts/comics-data.js`.
2. **Available Chapters**: Each comic has a `chapters.json` file in its directory that lists which chapters are available.
3. **Dynamic Loading**: The website dynamically loads comics and chapters based on the data structure.
4. **Lazy Loading**: Images are loaded only when they're about to be viewed, improving performance.

## Adding a New Comic

1. Use the admin interface at `/admin/index.html` to add a new comic.
2. Create the necessary directory structure:
   - Create a cover image in `images/COVERS/`
   - Create a directory for the comic in `images/comic{id}/`
   - Create a `chapters.json` file in the comic directory

## Adding a New Chapter

1. Use the admin interface to add a new chapter to a comic.
2. Create the necessary directory structure:
   - Create a directory for the chapter in `images/comic{id}/chapter{number}/`
   - Add the images for the chapter, named sequentially (1.jpg, 2.jpg, etc.)
3. Update the `chapters.json` file to include the new chapter.

## URL Structure

- Main page: `/index.html`
- Comic cover: `/comic-cover/comic-cover.html?id={comicId}`
- Comic reader: `/reader/reader.html?id={comicId}&chapter={chapterNumber}`
- Admin interface: `/admin/index.html`
