/** @format */

import { useState } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import { Card, Container, Divider, Icon, Image, Segment } from "semantic-ui-react";
import PostComments from "../../components/Posts/PostComments";
import CommentInput from "../../components/Posts/CommentInput";
import LikesList from "../../components/Posts/LikesList";
import Link from "next/link";
import { likePost } from "../../utils/postActions";
import calculateTime from "../../utils/calculatetime";
import baseUrl from "../../utils/baseUrl";
import { NoPostFound } from "../../components/Layout/NoData";
const PostPage = ({ post, errorLoading, user }) => {
  if (errorLoading) {
    return <NoPostFound />;
  }
  const [likes, setLikes] = useState(post.likes);

  const isLiked =
    likes.length > 0 &&
    likes.filter((like) => like.user === user._id).length > 0;

  const [comments, setComments] = useState(post.comments);
  return (
    <Container text>
      <Segment basic>
        <Card color="teal" fluid>
          {post.picUrl && (
            <Image
              src={post.picUrl}
              style={{ cursor: "pointer" }}
              floated="left"
              wrapped
              ui={false}
              alt="PostImage"
              onClick={() => setShowModal(true)}
            />
          )}

          <Card.Content>
            <Image
              floated="left"
              src={post.user.profilePicUrl}
              avatar
              circular
            />
            <Card.Header>
              <Link href={`/${post.user.username}`}>
                <a>{post.user.name}</a>
              </Link>
            </Card.Header>

            <Card.Meta>{calculateTime(post.createdAt)}</Card.Meta>

            {post.location && <Card.Meta content={post.location} />}

            <Card.Description
              style={{
                fontSize: "17px",
                letterSpacing: "0.1px",
                wordSpacing: "0.35px",
              }}
            >
              {post.text}
            </Card.Description>
          </Card.Content>

          <Card.Content extra>
            <Icon
              name={isLiked ? "heart" : "heart outline"}
              color="red"
              style={{ cursor: "pointer" }}
              onClick={async () =>
                await likePost(
                  post._id,
                  user._id,
                  setLikes,
                  isLiked ? false : true
                )
              }
            />

            <LikesList
              postId={post._id}
              trigger={
                likes.length > 0 && (
                  <span className="spanLikesList">
                    {`${likes.length} ${likes.length === 1 ? "like" : "likes"}`}
                  </span>
                )
              }
            />

            <Icon
              name="comment outline"
              style={{ marginLeft: "7px" }}
              color="blue"
            />

            {comments.length > 0 &&
              comments.map((comment) => (
                <PostComments
                  key={comment._id}
                  comment={comment}
                  postId={post._id}
                  user={user}
                  setComments={setComments}
                />
              ))}

            <Divider hidden />

            <CommentInput
              user={user}
              postId={post._id}
              setComments={setComments}
            />
          </Card.Content>
        </Card>
      </Segment>
      <Divider hidden />
    </Container>
  );
};
PostPage.getInitialProps = async (ctx) => {
  try {
    const { postId } = ctx.query;
    const { token } = parseCookies(ctx);
    const res = await axios.get(`${baseUrl}/api/posts/${postId}`, {
      headers: { Authorization: token },
    });
    console.log(res.data)
    return { post: res.data };
  } catch (error) {
    console.log(error)
    return { errorLoading: true };
  }
};

export default PostPage;
