import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {List,Image,Search} from "semantic-ui-react"
import baseUrl from "../../utils/baseUrl"
import Router from 'next/router'
import cookie from "js-cookie"


let cancel;
const SearchUser = () => {
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])

  const handleChange = async (e) => {
 const { value } = e.target;
 setText(value);

 if (value?.length === 0) return;

 //trim will remove white spaces.
 if (value.trim().length === 0) return;
    
    setLoading(true)

    try {
      cancel && cancel()
      const CancelToken = axios.CancelToken;
      const token = cookie.get("token");

      const res = await axios.get(`${baseUrl}/api/search/${value}`,{
        headers:{Authorization:token},
        cancelToken: new CancelToken(canceler => {
          cancel = canceler
        })
      })
      if(res.data.length === 0) {
        results.length > 0 && setResults([])
        setLoading(false)}
      setResults(res.data)
    } catch (error) {
      console.log("Error Searching",error)
    }
     setLoading(false);
  }


   useEffect(() => {
     if (text.length === 0 && loading) setLoading(false);
   }, [text]);
  return (
    <Search
      onBlur={() => {
        results.length > 0 && setResults([]);
       loading && setLoading(false)
       setText("")
        }}
        size="huge"
      loading={loading}
      resultRenderer={ResultRenderer}
      results={results}
      onSearchChange={handleChange}
      minCharacters={1}
      onResultSelect = {(e,data) => Router.push(`/${data.result.username}`)}
    />
  );
}


 
const ResultRenderer = ({_id,profilePicUrl,name}) => {

  return (
    <List key={_id}>
      <List.Item>
        <Image src={profilePicUrl} alt="ProfilePic" avatar />
        <List.Content header={name} as="a" />
      </List.Item>

    </List>
  )
}
export default SearchUser