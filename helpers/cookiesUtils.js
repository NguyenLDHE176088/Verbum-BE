

export function getCookie(req) {
    var cookie = req.headers.cookie;
    // user=someone; session=mySessionID
    return cookie.split('; ');
}

export function getTokenFromCookie(cookies, name) {
    let target;
    cookies.forEach(cookie => {
        if (cookie.includes(`${name}=`)) {
            target = cookie.split('=')[1];
        }
    });
    return target;
}