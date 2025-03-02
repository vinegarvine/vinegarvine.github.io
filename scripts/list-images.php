<?php
// This script lists all image files in a specified directory
// and returns them as a JSON array, sorted in natural order

// Set headers to allow cross-origin requests and specify JSON content
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

// Get parameters from the request
$comicId = isset($_GET['comicId']) ? intval($_GET['comicId']) : 0;
$chapter = isset($_GET['chapter']) ? intval($_GET['chapter']) : 0;

// Validate parameters
if ($comicId <= 0 || $chapter <= 0) {
    echo json_encode(['error' => 'Invalid comic ID or chapter number']);
    exit;
}

// Define the directory path
$directory = "../images/comic{$comicId}/chapter{$chapter}/";

// Check if the directory exists
if (!is_dir($directory)) {
    echo json_encode(['error' => 'Directory not found']);
    exit;
}

// Get all files in the directory
$files = scandir($directory);

// Filter to only include image files
$imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
$images = [];

foreach ($files as $file) {
    // Skip . and .. directories
    if ($file === '.' || $file === '..') {
        continue;
    }
    
    // Get file extension
    $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    
    // Check if it's an image file
    if (in_array($extension, $imageExtensions)) {
        $images[] = $file;
    }
}

// Sort the images using natural sort (so 1.jpg comes before 10.jpg)
natcasesort($images);

// Convert to array of full paths
$imagePaths = [];
foreach ($images as $image) {
    $imagePaths[] = $directory . $image;
}

// Return the sorted list of images
echo json_encode([
    'success' => true,
    'images' => array_values($images),
    'imagePaths' => array_values($imagePaths)
]); 