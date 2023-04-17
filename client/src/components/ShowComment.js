import {formatISO9075} from "date-fns";
import {useEffect, useState} from "react";

export function ShowComment() {
    const [comments, setComments] = useState([]);
    useEffect(() => {
        fetch('http://localhost:3001/api/comment')
        .then(res => {
            res.json().then(comments => {
                setComments(comments);
            });
        });
    }, []);
    console.log(comments);

    function mapComment () {
        return comments.map((comment,index) => {return (
            <div key={index}>
                <div className="comment">
                    <div className="username">user: {comment.username}</div>
                    <div className="content">content: {comment.content}</div>
                    <div className="time">at: {formatISO9075(new Date(comment.createdAt))}</div>
                </div>
            </div>
            
        )});
    }

    return (
        <div className="comment-container">
            <p>All comments: </p>
            {comments.length > 0 && mapComment()}
        </div>
    );
}
