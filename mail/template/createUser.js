const createUserTemplate = (email, password) => {
    return {
        to: email,
        subject: 'Welcome to Verbum!',
        email_body: {
            body: {
                intro: `Welcome to Verbum! 🥳\nYou now can use your email and this password to login:\n<h1>${password}</h1>`,
                outro: 'Please do not share this with anyone for security reasons.'
            }
        }
    };
};

export default createUserTemplate;