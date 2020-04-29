const axios = require('axios');
const exampleUrl = "https://cafe.naver.com/fitthesize/10134";
const articleIdRgrExp = /https:\/\/cafe.naver.com\/.*\/(\d*)/;
const clubIdRgrExp = /g_sClubId = "(\d*)";/;

const getComment = (url) => new Promise((resolve,reject)=>{
    axios.get(url)
    .then((response)=> {
        const data = response.data;
        const clubId = getClubId(data);
        const articleId = getAriticleId(url);
        getCommentData(clubId, articleId)
        .then((response)=> {
            resolve(response)
        })
    })
    .catch((err)=> {
        console.log(err)
        reject(err);
    })
})

const getClubId = (response) => {
    if(typeof response !== "string"){
        return false
    } 
    return response.match(clubIdRgrExp)[1]
}

const getAriticleId = (url) => {
    if(typeof url!== "string"){
        return false;
    }
    return url.match(articleIdRgrExp)[1];
}
const getCommentData = (clubId, articleId) => new Promise(
    (resolve,reject)=> {
        axios.get(getCommentRequestUrl(clubId,articleId))
        .then((response)=> {
            const comments = response.data.result.list;
            let buffer = [];
            comments.map((comment)=> {
                buffer.push(comment);
            })
            resolve(buffer);
        })
        .catch((err)=> {
            console.log(err);
            reject(err);
        })
    }
)

const getCommentRequestUrl = (clubId, articleId) => {
    return `https://cafe.naver.com/CommentView.nhn?search.clubid=${clubId}&search.articleid=${articleId}`;
}

getComment(exampleUrl)
.then((response)=> {
    console.log(response);
})