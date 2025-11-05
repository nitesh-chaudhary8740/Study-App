const url = "https://res.cloudinary.com/nitesh8740/image/upload/v1762150442/study-app/courses/another/cover-image/v0lzc5fzbcwj0g2duiio.png"
const splited = url.split("upload/")
console.log(splited)
const indexOfversion = splited[1].indexOf("/")
console.log(indexOfversion)
console.log(splited[1].substring(indexOfversion+1).split(".")[0])