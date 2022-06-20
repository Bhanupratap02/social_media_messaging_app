import React, { useEffect, useRef, useState } from 'react'
import { Button, Divider, Form, Icon, Image,  Message, Transition } from "semantic-ui-react"
import uploadPic from "../../utils/uploadPicToCloudinary"
import { submitNewPost } from '../../utils/postActions'
import CropImageModal from './CropImageModal'
const CreatePost = ({user,setPosts}) => {



  const [newPost, setNewPost] = useState({text:"",location:""})
  const [loading, setLoading] = useState(false)
  const inputRef = useRef()
  const [error, setError] = useState(null)
  const [highlighted, setHighlighted] = useState(false)
  const [media, setMedia] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)
  
   const [showModal, setShowModal] = useState(false)
   const [showImgBox, setShowImgBox] = useState(false)
   const [showLocation, setShowLocation] = useState(false)
  const handleChange = e => {
    const {name,value,files} = e.target
    if(name === "media"){
       if (files && files.length > 0) {
         setMedia(files[0]);
         return setMediaPreview(URL.createObjectURL(files[0]));
       }
    }
    setNewPost(prev => ({...prev,[name]:value}))
  }
  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    let picUrl;
    if(media !== null){
      picUrl = await uploadPic(media)
      if(!picUrl){
        setLoading(false)
        return setError("Error In Uploading Image")
      }
    }
    await submitNewPost(newPost.text,newPost.location,picUrl,setPosts,setNewPost,setError)

    setMedia(null)
    mediaPreview !== null && URL.revokeObjectURL(mediaPreview)
    // setMediaPreview(null)
    setTimeout(()=>setMediaPreview(null),3000);
    setLoading(false);
  };
  useEffect(() => {
   if(!showImgBox){
     media &&  setMedia(null);
       mediaPreview !== null && URL.revokeObjectURL(mediaPreview);
       setMediaPreview(null);
   }
  }, [showImgBox])
  
  const addStyles=()=>({
            textAlign: "center",
            height: "200px",
            width: "300px",
            border: mediaPreview?"none":"2px solid",
            paddingTop: media === null && "60px",
            cursor: "pointer",
            borderColor: highlighted ? "green" : "gray",
            display:showImgBox?"block":"none",
           marginLeft:"9rem"
          })

 
  return (
    <>
      {showModal && (
        <CropImageModal
          mediaPreview={mediaPreview}
          setMedia={setMedia}
          showModal={showModal}
          setShowModal={setShowModal}
          setMediaPreview={setMediaPreview}
          showImgBox={showImgBox}
        />
      )}

      <Form error={error !== null} onSubmit={handleSubmit}>
        <Message
          error
          onDismiss={() => setError(null)}
          content={error}
          header="Oops"
        />

        <Form.Group
          style={{
            paddingTop: "2rem",
            paddingLeft: "1.3rem",
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            marginBottom: "1rem",
          }}
        >
          <Image
            src={user.profilePicUrl}
            circular
            avatar
            inline
            floated="left"
            style={{
              height: "3rem",
              width: "3rem",
              marginLeft: "0.1rem !important",
              position: "absolute",
              top: "2rem",
              left: "-8px",
            }}
          />

          <Form.TextArea
            placeholder="What's happening?"
            name="text"
            value={newPost.text}
            onChange={handleChange}
            rows={3}
            width={"13"}
            style={{
              borderTop: "0px",
              borderLeft: "0px",
              borderRight: "0px",
              borderBottom: "1.6px solid gray",
              borderRadius: "0",
              fontSize: "1.4rem",
              position: "relatrive",
              marginLeft: "10px",
            }}
          />
        </Form.Group>

        <Form.Group>
          <Button
            type="button"
            style={{ backgroundColor: "whiteSmoke", margin: "0.5rem 1.2rem" }}
            icon
            circular
          >
            <Icon
              name="image"
              size="big"
              style={{ margin: "0.5rem 1.2rem", color: "#1DA1F2" }}
              onClick={() => {
                setShowImgBox(!showImgBox);
                setMedia(null);
                setMediaPreview(null);
              }}
            />
          </Button>
          <Button
            type="button"
            style={{ backgroundColor: "whiteSmoke", margin: "0.5rem 1.2rem" }}
            icon
            circular
            onClick={() => {
              setShowLocation(!showLocation);
            }}
          >
            <Icon
              name="map marker alternate"
              size="big"
              style={{ margin: "0.3rem 0.2rem", color: "#1DA1F2" }}
            />
          </Button>
          <div style={{ display: showLocation ? "block" : "none" }}>
            <Form.Input
              style={{ marginBottom: "6px" }}
              value={newPost.location}
              name="location"
              onChange={handleChange}
              label="Add Location"
              icon="map marker alternate"
              placeholder="Want to add Location"
            />
          </div>

          <input
            ref={inputRef}
            onChange={handleChange}
            name="media"
            style={{ display: "none" }}
            type="file"
            accept="image/*"
          />
        </Form.Group>
        <div
          onClick={() => inputRef.current.click()}
          style={addStyles()}
          onDragOver={(e) => {
            e.preventDefault();
            setHighlighted(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setHighlighted(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setHighlighted(true);
            const droppedFile = Array.from(e.dataTransfer.files);
            setMedia(droppedFile);
            setMediaPreview(URL.createObjectURL(droppedFile[0]));
          }}
        >
          {media === null ? (
            <>
              <h3> Drag & drop image or click here to select image</h3>
              <Icon name="image" size="big" />
            </>
          ) : (
            <>
              <Image
                style={{ height: "300px", width: "300px" }}
                src={mediaPreview}
                alt="PostImage"
                centered
                size="medium"
                onClick={() => inputRef.current.click()}
              />
            </>
          )}
        </div>
        {mediaPreview !== null && showImgBox !== false && (
          <>
            <Divider hidden />
            <Button
              content="Crop Image"
              type="button"
              primary
              circular
              onClick={() => setShowModal(true)}
            />
          </>
        )}
        <Divider hidden />
        <Button
          circular
          disabled={newPost.text === "" || loading}
          content={<strong>Post</strong>}
          style={{ backgroundColor: "#1DA1F2", color: "white" }}
          icon="send"
          loading={loading}
        />
      </Form>
      <Divider />
    </>
  );
}

export default CreatePost