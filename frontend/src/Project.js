import React from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import AddTask from './AddTask'
import AddMember from './AddMember'
import Nav from './Nav'

function Project() {
    const [data,setData]=React.useState([])
    const [projectName,setProjectName]=React.useState("")
    
    const [flag,setFlag]=React.useState("")
    

    let navigate =useNavigate()
    let params=useParams()
    let userId
    var userName=""
    let token
    if(!localStorage.getItem('login2')) token=""
    if(localStorage.getItem('login2')){
        token=JSON.parse(localStorage.getItem('login2')).token
        userId=JSON.parse(localStorage.getItem('login2')).userId
        userName=JSON.parse(localStorage.getItem('login2')).name

    }
    
    React.useEffect(()=>{
        fetch(`http://localhost:4000/project/${params.projectId}`,{
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


    function dragToProgress(id){
        let data={id:id,status:'InProgress'}
        fetch("http://localhost:4000/editTask",{
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
    function dragToCompleted(id){
        let data={id:id,status:'Completed'}
        fetch("http://localhost:4000/editTask",{
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
    function dragToDelete(id){
        let data={id:id}
        fetch("http://localhost:4000/deleteTask",{
            method:"DELETE",
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
                alert('Task deleted')
                window.location.reload(true);
            }
            else return alert(res.message)
            
        })

    }


  return (
    <>
    <Nav name={userName}/>
    <div className='nav2'>
        {
            flag?
                <>
                <AddTask projectId={params.projectId}/>
                <AddMember projectId={params.projectId}/></>
            :
            <></>
        }
        <button style={{width:150,height:50}} onClick={()=>navigate('/')}>your projects</button>

    </div>

    <h1 style={{textAlign:"center"}}>project name: {projectName}</h1>
    <div className='tasks'>
        <div className='Name'>
            <div><h3>Task to complete</h3></div>
            <div><h3>In-Progress</h3></div>
            <div><h3>Completed</h3></div>
        
        </div>
        <div className='task'>
        
        <div className='open'>
            {
                data.map(x=>
                    x.status=="Todo" && x.isDeleted==false?
                    <li draggable onDragEnd={(e)=>dragToProgress(x._id)}>
                        <h4>{x.name}</h4><br/>
                        {/* <p>{x.description}</p> */}
                    </li>:<></>
                )
            }
        </div>
        <div className='progres' >
            {
                data.map(x=>
                    x.status=="InProgress" && x.isDeleted==false?
                    <li  draggable onDragEnd={(e)=>dragToCompleted(x._id)} >
                        <h4>{x.name}</h4><br/>
                        {/* <p>{x.description}</p> */}
                    </li>:<></>
                )
            }

        </div>
        <div className='completed'>
            {
                data.map(x=>
                    x.status=="Completed" && x.isDeleted==false?
                    <li draggable onDragEnd={(e)=>dragToDelete(x._id)} >
                        <h4>{x.name}</h4><br/>
                        {/* <p>{x.description}</p> */}
                    </li>:<></>
                )
            }
        </div>
        
    </div>
        
    </div>
    </>
  )
}

export default Project