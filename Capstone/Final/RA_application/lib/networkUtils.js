    let ip = "";
let user = "";
exports.postSubmission = (photoUri, jointData) => {
    const data = new FormData();
    const url = 'http://' + ip + ':8000' + '/submissions';
    console.log(photoUri);
    data.append('photo', {
        uri: photoUri,
        type: 'image/jpeg', // or photo.type
        name: "handPhoto.jpg",
    });
    data.append('jointData', JSON.stringify(jointData));
    data.append('userid', "jmanosu");
    
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'multipart/form-data',
        'Content-Type': 'multipart/form-data'
        },
        body: data
    });
}  

exports.getSubmissions = (usert) => {
    const url = 'http://' + ip + ':8000' + '/submissions/user/' + user;
    return fetch(url, { method: 'GET' }).then((response) => response.json());
}
    
exports.getSubmissionPhoto = (photoUri) => {
    var url = baseUrl + '/submissions/photo/' + photoUri;
    return fetch(url, { method: 'GET' });
}

exports.setIP = (newIp) => {
    ip = newIp;
}

exports.setUser = (newUser) => {
    user = newUser;
}

exports.getBaseUrl = () => { 
    const url = 'http://' + ip + ':8000' + '/submissions';
    return url;
}