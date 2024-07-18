const Regex = {
    email: /^\S+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/i,
    password: /(?=.*[a-z_])(?=.*[A-Z_])(?=.*\d)[\S]{8,20}/,
    username: /^[a-zA-Z0-9_-]{3,18}$/,
    twitter: /^([A-Za-z0-9_]{1,15})$/,
    htmlTags: /<[^>]+>/g,
}

export default Regex