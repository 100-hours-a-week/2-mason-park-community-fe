export const getPostsRequest = async (offset=0, limit=5) => {
        return await fetch('/mock/post/posts.json', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
}