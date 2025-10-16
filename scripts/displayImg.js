const params = new URLSearchParams(window.location.search);
const data = params.get('data');

document.getElementById('displayed-image').src = `../images/original/${data}`;