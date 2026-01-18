import {FourSquare} from 'react-loading-indicators'
import './App.css'
import { useState } from 'react'
import axios from 'axios'

function App() {
  const [emailContent, setemailContent] = useState('')
  const [tone, settone] = useState('')
  const [generatedReply, setgeneratedReply] = useState('')
  const [loading, setloading] = useState(false)

  const handleSubmit= async()=>{
    setloading(true);
    const response=await axios.post('http://localhost:8080/api/email/generate',{emailContent,tone});
    setgeneratedReply(typeof response.data=== 'string' ? response.data : JSON.stringify(response.data));
    setloading(false);
  }

  return (<>
  
     <div className=" bg-gray-800 h-screen w-full flex flex-col items-center justify-between font-serif ">
        <h1 className='bg-amber-100 w-8/12 text-3xl text-center sm:text-4xl md:text-5xl text-wrap p-4 rounded-3xl text-gray-700 font-extrabold  mt-7'>
          Email Reply Generator
        </h1>
        <div className="flex gap-4 flex-col items-center w-full justify-between h-10/12">
          <textarea type="text" value={emailContent} onChange={(e)=>{setemailContent(e.target.value)}} placeholder='Email Content' className='bg-gray-400 text-black-600 mt-4 p-2  rounded-3xl h-80 w-9/12'>

          </textarea>
          <input type='text' value={tone} onChange={(e)=>{settone(e.target.value)}} placeholder='tone' className='p-2 rounded-3xl h-15 w-9/12 bg-gray-400 text-black-600 '>
          </input>
          <div className='flex flex-col justify-center items-center'>
            <button onClick={handleSubmit} className=' cursor-pointer hover:scale-103 active:scale-95 w-45 h-12 mb-4 rounded-4xl p-3 bg-amber-200'>
            Generate
          </button>
          <div className='-translate-x-2 h-20 w-10'>{loading? <FourSquare color="#ded620" size="small" text="loading" textColor="" />: " "}</div>
        </div>
        </div>
        <div className="bg-gray-800 gap-2 h-screen w-full flex flex-col items-center justify-between ">
          <textarea type="text" onChange={(e)=>{setgeneratedReply(e.target.value)}} value={generatedReply} placeholder='Generated E-Mail' className='rounded-3xl p-2 w-9/12 h-100 text-black-300 bg-blue-200'>
          </textarea>
          <button onClick={()=>{navigator.clipboard.writeText(generatedReply)}} className='cursor-pointer hover:scale-103 active:scale-95 w-45 h-12 mb-4 rounded-4xl p-3 bg-blue-400'>
            Copy to Clipboard
          </button>
        </div>
      </div>

  </>
  )
}

export default App
