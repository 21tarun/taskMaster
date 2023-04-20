import React from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import AddTask from './AddTask'
import AddMember from './AddMember'
import Nav from './Nav'


function Project() {
    const [data,setData]=React.useState([])
    const [projectName,setProjectName]=React.useState("")
    const [members,setMembers]=React.useState([])
    const [userEmail,setUserEmail]=React.useState("")
    const [projectUserEmail,setProjectUserEmail]=React.useState("")
    const [showComments,setShowComments]=React.useState(false)
    const [comments,setComments]=React.useState([])
    const [msg,setMsg]=React.useState("")
    const [taskId,setTaskId]=React.useState("")
    const [taskName,setTaskName]=React.useState("")
    const [flag,setFlag]=React.useState("")
    const [status,setStatus]=React.useState("")
    

    let navigate =useNavigate()
    let params=useParams()
    let userId
    let userName=""
    let token
    if(!localStorage.getItem('login2')) token=""
    if(localStorage.getItem('login2')){
        
        token=JSON.parse(localStorage.getItem('login2')).token
        userId=JSON.parse(localStorage.getItem('login2')).userId
        userName=JSON.parse(localStorage.getItem('login2')).name

    }
    console.log("userName",userName)
    
    React.useEffect(()=>{
        fetch(process.env.REACT_APP_BACKEND_BASEURL+`/project/${params.projectId}`,{
            headers:{

                'x-api-key':token
            }
        })
        .then((result)=>result.json())
        .then(res=>{
            
            if(res.status==true){
                setData(res.data.taskList)
                setProjectName(res.data.name)
                setFlag(res.flag)
                setMembers(res.data.members)
                setProjectUserEmail(res.data.userId.email)
                
            }
            else{
                if(res.message=='not getting token' || res.message=='token expired'){
                    navigate('/login')
                }
                else{
                    alert(res.message)
                }
            }
            
            
        })
    },[])
    React.useEffect(()=>{
        fetch(process.env.REACT_APP_BACKEND_BASEURL+"/getUserProjects",{
            headers:{
                'x-api-key':token
            }
        })
        .then((result)=>result.json())
        .then(res=>{
            
            if(res.status==true){
                setUserEmail(res.data.email)
            }
            else{
                if(res.message=='not getting token' || res.message=='token expired'){
                    navigate('/login')
                }
                else{
                    alert(res.message)
                }
            }
            
            
        })
    },[])


    function drop(e,id,assignTo){
        if(assignTo!=userEmail && userEmail!=projectUserEmail)return alert("you can not dragged")
        let data={id:id,status:status}
        fetch(process.env.REACT_APP_BACKEND_BASEURL+"/editTask",{
            method:"PUT",
            headers:{
                'Content-type': 'application/json',
                'x-api-key':token
            },
            body:JSON.stringify(data)
        })
        .then((result)=>result.json())
        .then(res=>{
            console.log(res)
            if(res.status==true){
                alert('Task dragged')
                window.location.reload(true);
            }
            else return alert(res.message)
            
        })

    }

    // function dragToDelete(id,assignTo){
    //     if(assignTo!=userEmail && userEmail!=projectUserEmail)return alert("you can not dragged")
    //     let data={id:id}
    //     fetch(process.env.REACT_APP_BACKEND_BASEURL+"/deleteTask",{
    //         method:"DELETE",
    //         headers:{
    //             'Content-type': 'application/json',
    //             'x-api-key':token
    //         },
    //         body:JSON.stringify(data)
    //     })
    //     .then((result)=>result.json())
    //     .then(res=>{
    //         console.log(res)
    //         if(res.status==true){
    //             alert('Task deleted')
    //             window.location.reload(true);
    //         }
    //         else return alert(res.message)
            
    //     })

    // }
    function getComments(taskId,name){
        let data={"taskId":taskId}
        setTaskId(taskId)
        fetch(process.env.REACT_APP_BACKEND_BASEURL+"/getTaskById",{
            method:"POST",
            headers:{
                'Content-type': 'application/json',
                'x-api-key':token
            },
            body:JSON.stringify(data)
        })
        .then((result)=>result.json())
        .then(res=>{
            
            if(res.status==true){
                setShowComments(true)
                setComments(res.data.comments)
                setTaskName(name)
            }
            else{
                if(res.message=='not getting token' || res.message=='token expired'){
                    navigate('/login')
                }
                else{
                    alert(res.message)
                }
            }
            
            
        })
    }
    function addComment(){
        let data={taskId:taskId,message:msg,userId:userId}
        fetch(process.env.REACT_APP_BACKEND_BASEURL+"/createComment",{
            method:"POST",
            headers:{
                'Content-type': 'application/json',
                'x-api-key':token
            },
            body:JSON.stringify(data)
        })
        .then((result)=>result.json())
        .then(res=>{
            
            if(res.status==true){
                alert("comment added successfully")
                window.location.reload(true)
            }
            else{
                if(res.message=='not getting token' || res.message=='token expired'){
                    navigate('/login')
                }
                else{
                    alert(res.message)
                }
            }
            
            
        })
    }
    function deleteComment(commentId){
        let data={commentId:commentId,taskId:taskId}
        fetch(process.env.REACT_APP_BACKEND_BASEURL+"/deleteComment",{
            method:"PUT",
            headers:{
                'Content-type': 'application/json',
                'x-api-key':token
            },
            body:JSON.stringify(data)
        })
        .then((result)=>result.json())
        .then(res=>{
            
            if(res.status==true){
                alert("comment deleted successfully")
                window.location.reload(true)
            }
            else{
                if(res.message=='not getting token' || res.message=='token expired'){
                    navigate('/login')
                }
                else{
                    alert(res.message)
                }
            }
            
            
        })
    }

  return (
    <>
    <Nav name={userName} />
    <div className='nav2'>
        {
            flag?
                <>
                <AddTask projectId={params.projectId} members={members} userEmail={userEmail}/>
                <AddMember projectId={params.projectId}/></>
            :
            <></>
        }
        <button style={{width:150,height:50}} onClick={()=>navigate('/')}>your projects</button>

    </div>

    <h1 style={{textAlign:"center"}}>project name: {projectName}</h1>
     {
        !showComments?
        <div className='tasks'>
        <div className='Name'>
            <div><h3>Task to complete</h3></div>
            <div><h3>In-Progress</h3></div>
            <div><h3>Completed</h3></div>
        
        </div>
        <div className='task'>
        
        <div className='open' onDragOver={(e)=>{e.preventDefault();setStatus("Todo")}}>
            {
                data.map(x=>
                    x.status=="Todo" && x.isDeleted==false?
                    <li draggable onDragEnd={(e)=>drop(e,x._id,x.assignTo)}>
                        <h4>{x.name}</h4><br/>
                        <p>assignTo: {x.assignTo}</p>
                        <a style={{cursor: "pointer"}} onClick={()=>{getComments(x._id,x.name)}}><p>comments: {x.totalComment}</p></a>
                    </li>:<></>
                )
            }
        </div>
        <div className='progres' onDragOver={(e)=>{e.preventDefault(); setStatus("InProgress")}}>
            {
                data.map(x=>
                    x.status=="InProgress" && x.isDeleted==false?
                    <li  draggable  onDragEnd={(e)=>drop(e,x._id,x.assignTo)}  >
                        <h4>{x.name}</h4><br/>
                        <p>assignTo: {x.assignTo}</p>
                        <a style={{cursor: "pointer"}} onClick={()=>{getComments(x._id,x.name)}}><p>comments: {x.totalComment}</p></a>
                    </li>:<></>
                )
            }

        </div>
        <div className='completed' onDragOver={(e)=>{e.preventDefault();setStatus("Completed")}}>
            {
                data.map(x=>
                    x.status=="Completed" && x.isDeleted==false?
                    <li draggable onDragEnd={(e)=>drop(e,x._id,x.assignTo)} >
                        <h4>{x.name}</h4><br/>
                        <p >assignTo: {x.assignTo}</p>
                        <a style={{cursor: "pointer"}} onClick={()=>{getComments(x._id,x.name)}}><p>comments: {x.totalComment}</p></a>
                    </li>:<></>
                )
            }
        </div>
        
    </div>
        
        </div>:
        <>
        <h3>Task: {taskName}</h3>
        <section style={{backgroundColor: "#eee"}}>
            <div class="container my-5 py-5">
                <div class="row d-flex justify-content-center">
                <div class="col-md-12 col-lg-10 col-xl-8">
                    <div class="card">
                    {
                        
                        comments.map(x=>
                            
                            !x.isDeleted?
                            
                            <div class="card-body" style={{borderStyle:"outset"}}>
                                <div class="d-flex flex-start align-items-center">
                                
                                <div style={{display:"flex"}}>
                                    <h5 class="fw-bold text-primary mb-1">{x.userId.name}</h5>
                                    <p style={{marginTop:"10px", marginLeft:"5px"}} class="text-muted small mb-0">{x.dateTime}</p>
    
                                </div>
                                </div>
                
                                <p class="mt-3 mb-4 pb-2">{x.message}</p>
                                <div class="small d-flex justify-content-start" style={{display :"flex"}}>
                                    {
                                        userId==x.userId._id?
                                        <a onClick={()=>deleteComment(x._id)} class="d-flex align-items-center me-3"  style={{cursor: "pointer"}}>
                                            <p class="mb-0" style={{marginRight:10}}>delete</p>
                                        </a>:<></>
                                    }

                                </div>
                            </div>

                            :<></>
    
                            
                        
                        )
                    }
                    <div class="card-footer py-3 border-0" style={{backgroundColor: "#f8f9fa"}}>
                        <div class="d-flex flex-start w-100">

                        <div class="form-outline w-100">
                            <textarea class="form-control" placeholder="type your comment...." rows="4" style={{background: "#fff"}} onChange={(e)=>{setMsg(e.target.value)}}/>
                            <label class="form-label" for="textAreaExample">Comment</label>
                        </div>
                        </div>
                        <div class="float-end mt-2 pt-1">
                        <button type="button" class="btn btn-primary btn-sm" onClick={()=>addComment()}>Post comment</button>
                        <button type="button" class="btn btn-outline-primary btn-sm" onClick={()=>setShowComments(false)}>Cancel</button>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </section>
        </>
     }   
    </>
  )
}

export default Project