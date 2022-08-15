const input = document.querySelector('.image-upload');

input.addEventListener('change', (e) => {

    let files = input.files;

    if (files.length > 5) {
        alert(`Only 5 images are allowed to upload.`);
        input.value = null;
        return;
    };
    
});