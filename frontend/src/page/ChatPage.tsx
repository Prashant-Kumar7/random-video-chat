import { useEffect, useRef, useState } from 'react'

import '../App.css'
import { useParams } from 'react-router-dom'

function ChatPage() {


  const [socket, setSocket] = useState<null | WebSocket>(null)
  const remoteVideo = useRef<HTMLVideoElement>(null)
  const localVideo = useRef<HTMLVideoElement>(null)
  const remoteAudio = useRef<HTMLAudioElement>(null)
  const [remoteName , setRemoteName] = useState("");
  const [pc , setPC] = useState<RTCPeerConnection | null>(null)
  
  const {name} = useParams()
  const [videoOn , setVideoNo] = useState(true)
  const [audioOn , setAudioOn] = useState(true)
  const [localStream , setLocalStream] = useState<MediaStream>()
  const [connected , setConnected] = useState(false)
  const [wait, setWait] = useState(false)


  function startConnection(){
    const socket = new WebSocket("wss://web-rtc-ws.tumsab.xyz")
    socket.onopen = ()=>{
      console.log('connected')
      setSocket(socket)
    }
    newPC()
    
  }


  useEffect(()=>{
    startConnection();
    return ()=>{
      socket?.close()
      pc?.close()
      setPC(null)
    }
  },[])

  function newPC(){
    const pc = new RTCPeerConnection()
    setPC(pc)
    startReceiving()
  }


  if(socket &&pc){
    socket.onmessage = async(message)=>{
      const res = JSON.parse(message.data)

      if(res.type === "gotConnected"){

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            socket.send(JSON.stringify({
                type: 'iceCandidate',
                candidate: event.candidate
            }));
          }
        }

        pc.onnegotiationneeded = () => {
          pc.createOffer().then((offer)=>{
            pc.setLocalDescription(offer).then(()=>{
              const data =  {
                type : "createOffer",
                name : name,
                sdp : pc.localDescription
              }
    
              socket.send(JSON.stringify(data));
            });
          });
        }
        getCameraStreamAndSend()
        setWait(false)
      }

      if (res.type === 'createAnswer') {
          console.log("recevier sdp: ")
          console.log(res.sdp)
          await pc?.setRemoteDescription(res.sdp);
      }
      
      
      if (res.type === 'iceCandidate') {
          // console.log("recevier candidates :")
          // console.log(res.candidate)
          await pc?.addIceCandidate(res.candidate);
      }

      if (res.type === 'createOffer') {
        setRemoteName(res.name)

        pc.setRemoteDescription(res.sdp).then(() => {
            pc.createAnswer().then((answer) => {
                pc.setLocalDescription(answer);
                socket.send(JSON.stringify({
                    type: 'createAnswer',
                    sdp: answer
                }));
            });
        });
    } else if (res.type === 'iceCandidate') {
        console.log("send candidates :")
        pc.addIceCandidate(res.candidate);
    }

    if(res.type === "close_conn"){
      if(remoteVideo.current && remoteAudio.current){
        remoteVideo.current.srcObject = null;
        remoteAudio.current.srcObject = null;
  
      }
      pc.close()
      pc.onicecandidate = null
      setPC(null)
      // socket.close()
      // pc.setRemoteDescription(null)
      setRemoteName("")
      handleLeave()
      setConnected(false)
    }


    if(res.type === "waiting"){
      setWait(true)
    }

    pc.ontrack = async(event) => {
      const allTracks = event.streams[0].getTracks()
          if(remoteVideo.current){
              remoteVideo.current.srcObject = new MediaStream(allTracks);
              remoteVideo.current.play()
          }

          if(remoteAudio.current){
              remoteAudio.current.srcObject = new MediaStream(allTracks)
              remoteAudio.current.play()
          }
    }

    

    }
  }


  const getCameraStreamAndSend = () => {
    navigator.mediaDevices.getUserMedia({ video: true , audio : true }).then((stream) => {
        setLocalStream(stream)
        if(localVideo.current && videoOn){
            localVideo.current.srcObject = stream
            localVideo.current.play()
        }
        if(videoOn){ 
          stream.getTracks().forEach((item)=>{
            console.log("inside track")
            pc?.addTrack(item,stream)
          })           
        }
    });
    setConnected(true)
  }



  function startReceiving() {
    if(pc){
      pc.ontrack = async(event) => {
        const allTracks = event.streams[0].getTracks()
            if(remoteVideo.current){
                // const videoTrack = event.streams[0].getVideoTracks()[0]
                remoteVideo.current.srcObject = new MediaStream(allTracks);
                remoteVideo.current.play()
            }
  
            if(remoteAudio.current){
                // const audioTrack = event.streams[0].getAudioTracks()[0]
                remoteAudio.current.srcObject = new MediaStream(allTracks)
                remoteAudio.current.play()
            }
      }

      
    }
    // const pc = new RTCPeerConnection();
  }


  async function handleClick(){

    const videoTrack = localStream?.getVideoTracks()[0];
    if(videoTrack){
      if(!videoTrack.enabled){
        videoTrack.enabled = true
        setVideoNo(true)
      }
    }

    const audioTrack = localStream?.getAudioTracks()[0]
    if(audioTrack){
      if(!audioTrack.enabled){
        audioTrack.enabled = true
        setAudioOn(true)
  
      }
    }

    if(socket){
      socket.send(JSON.stringify({type : "init_conn"}))
    }
  }


  function handleLeave(){
    if(!pc){
      return
    }
    pc.close()
      pc.onicecandidate = null
      setPC(null)
    if(socket){
      socket.send(JSON.stringify({type : "close_conn"}))
      setConnected(false)
    }
    const videoTrack = localStream?.getVideoTracks()[0];
    if(!videoTrack){
      return
    }
    if(!videoTrack.enabled){
      videoTrack.enabled = true
      setVideoNo(true)
    }
    if(remoteVideo.current && remoteAudio.current){
      remoteVideo.current.srcObject = null;
      remoteAudio.current.srcObject = null;

    }

    const audioTrack = localStream?.getAudioTracks()[0]
    if(!audioTrack){
      return
    }
    if(!audioTrack.enabled){
      audioTrack.enabled = true
      setAudioOn(true)

    }

    setRemoteName("")
    newPC();
  }

  function toggleCamera(){
    const videoTrack = localStream?.getVideoTracks()[0];
    if(!videoTrack){
      return
    }
    if(videoTrack.enabled){
      videoTrack.enabled = false
      setVideoNo(false)
    } else {
      videoTrack.enabled = true
      setVideoNo(true)
    }
    

  }


  function toggleMic(){
    const audioTrack = localStream?.getAudioTracks()[0]
    if(!audioTrack){
      return
    }


    if(audioTrack.enabled){
      audioTrack.enabled = false
      setAudioOn(false)
    } else {
      audioTrack.enabled = true
      setAudioOn(true)
    }
  }

  return (
    <div className='flex flex-col'>
      <div className='flex gap-6'>
        <div className='flex  flex-col text-center'>
            <video muted ref={localVideo} className='border w-96 h-96'></video>
            <div>Local Name :{name}</div>
        </div>

        <div className='flex  flex-col text-center'>
            <video muted ref={remoteVideo} className='border w-96 h-96'></video>
            <div>Remote Name :{remoteName}</div>
            <audio muted={false} autoPlay ref = {remoteAudio}></audio>
        </div>
      </div>
        {wait ? <div className='text-center'>waiting for someone to connect...</div> : <div></div> }
      <div className='my-8 flex gap-6 justify-center'>
        {connected ? <button onClick={handleLeave} className='bg-red-700'>Leave</button> : <button onClick={handleClick} disabled={wait} className='bg-indigo-700 hover:bg-indigo-800'>start</button>}
        <button onClick={toggleCamera} className={videoOn? "bg-indigo-700" : "bg-red-700"} >{videoOn? "Cam On" : "Cam Off"}</button>
        <button onClick={toggleMic} className={audioOn? "bg-indigo-700" : "bg-red-700"} >{audioOn? "Mic On" :"Mic Off"}</button>
      </div>
    </div>
  )
}

export default ChatPage