window.addEventListener("load", (event) => {
  eel.check_credentials()().then(function (res) {
      if (res) {
          getUploadSection()
      }
  })
})
function getUploadSection() {
    document.getElementById("loginSection").style.display = 'none';
    showSection('uploadSection');
}
function validateLogin() {
    var email = document.getElementById("Email").value;
    var password = document.getElementById("password").value;

    eel.check_authenticate(email, password)().then(function (res){
        if (res.status){
            getUploadSection()
        } else {
            alert(res.message)
        }
    })
}

function checkLogin() {
    if (document.cookie.split(';').some((item) => item.trim().startsWith('isLoggedIn='))) {
        // Cookie var, kullanıcı giriş yapmış. Login bölümünü gizle ve ilgili bölümü göster.
        document.getElementById("loginSection").style.display = 'none';
        showSection('uploadSection');
    }
}

window.onload = checkLogin;


function logout() {
    document.cookie = "isLoggedIn=; path=/; max-age=0";
    document.getElementById("loginSection").style.display = 'flex';
    document.querySelectorAll('.GUI_section').forEach(section => {
        section.style.display = 'none';
    });
}

function showSection(sectionId) {
    document.querySelectorAll('.GUI_section').forEach(section => {
        section.style.display = 'none';
    });

    document.getElementById(sectionId).style.display = 'flex';
}

let uploadedFiles = [];

async function handleFileSelect() {
    // for image upload (takes directory path)
    // let relativePath = await eel.get_absolute_path()()
    // eel.image_upload(relativePath)

    // for video upload (takes video file)
    let relativePath = await eel.get_file_path()()
    eel.video_upload(relativePath)
}

function isImageOrVideo(file) {
    return file.type.startsWith('image/') || file.type.startsWith('video/');
}

function updateUploadingSection() {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const uploadingSection = document.getElementById('uploadingSection');
    const uploadList = document.getElementById('uploadList');
    uploadList.innerHTML = '';

    if (uploadedFiles.length > 0) {
        fileUploadArea.style.display = 'none';
        uploadingSection.style.display = 'block';

        uploadedFiles.forEach((file, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'file-item';

            const fileNameSpan = document.createElement('span');
            fileNameSpan.textContent = file.name;
            listItem.appendChild(fileNameSpan);

            const removeButton = document.createElement('button');
            removeButton.className = 'border-0 bg-transparent remove-file-button';
            removeButton.onclick = function () { removeFile(index); };

            const removeImage = document.createElement('img');
            removeImage.src = 'images/xBlack.svg';
            removeButton.appendChild(removeImage);

            listItem.appendChild(removeButton);
            uploadList.appendChild(listItem);
        });
    } else {
        fileUploadArea.style.display = 'flex';
        uploadingSection.style.display = 'none';
    }
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
}

function clearUploadFailMessage() {
    document.getElementById('uploadFail').style.display = 'none';
}


function handleDrop(event) {
    event.preventDefault();
    var files = event.dataTransfer.files; // Sürüklenip bırakılan dosyaları al

    for (let i = 0; i < files.length; i++) {
        if (isImageOrVideo(files[i])) {
            uploadedFiles.push(files[i]);
        } else {
            document.getElementById('uploadFail').style.display = 'block';
            return;
        }
    }
    updateUploadingSection();
}
