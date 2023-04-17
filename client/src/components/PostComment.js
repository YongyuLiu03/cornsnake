import { useState } from "react";
import { Navigate } from "react-router-dom";

export function PostComment() {
    const [redirect, setRedirect] = useState(false);
    async function postCommentAJAX(evt) {
        evt.preventDefault();
        const res = await fetch('http://localhost:3001/api/comment', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({content: evt.target.content.value}),
            credentials: "include"
        });
        if (res.ok) {
           setRedirect(true);
        }
    }
    if (redirect) {
        return <Navigate to={'/'} />
    }
    return (
        <form onSubmit={postCommentAJAX}>
            <input name="content" placeholder={"Content"} required />
            <button style={{marginTop:'5px'}}>Post Comment</button>
        </form>
    );
}
