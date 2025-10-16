function addImagesToContainer(containerId) {

    fetch('scripts/python/output/imageFilenames.json')
        .then(response => response.json())
        .then(filenames => {
            // filenames is an array of image filenames
            filenames.forEach(filename => {
            // Example: add images to a container
            const img = document.createElement('img');
            img.src = 'images/original/' + filename;
            img.alt = filename;
            document.getElementById(containerId).appendChild(img);

            img.onclick = function() {
                window.location.href = `html/image.html?data=${encodeURIComponent(filename)}`;
            };
        });
    });
}

addImagesToContainer("photo-collage");

