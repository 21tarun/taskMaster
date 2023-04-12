import React from 'react'
import {useNavigate} from 'react-router-dom'
import {Button,Modal} from 'react-bootstrap'
import Nav from './Nav'

function Home() {
    const [data,setData] = React.useState([])
    const [data1,setData1] = React.useState([])
    const [email,setEmail]=React.useState("")
    const [show,setShow]=React.useState(false)
    const [name,setName]=React.useState("")
    let [userName,setUserName]=React.useState("")
    let [edit,setEdit]=React.useState(false)
    let [editId,setEditId]=React.useState(false)
    const navigate = useNavigate()
    let token = ""
    let userId=""
    if (localStorage.getItem('login2')) {
        token = JSON.parse(localStorage.getItem('login2')).token
        userId= JSON.parse(localStorage.getItem('login2')).userId
    }
    console.log(token,userId)

    React.useEffect(() => {


        fetch("https://agreeable-small-study.glitch.me/getUserProjects", {
            headers: {

                'x-api-key': token
            }

        })
            .then((result) => {
                result.json()
                    .then((res) => {
                        console.log(res)
                        if (res.status == true) {
                            setData(res.data.projects)
                            setUserName(res.data.name)
                            let temp={email:res.data.email}
                            fetch("https://agreeable-small-study.glitch.me/getProjectOnMembers", {
                                method:"POST",
                                headers: {
                                    'Content-type': 'application/json',
                                    'x-api-key': token
                                },
                                body:JSON.stringify(temp)

                            })
                                .then((result) => {
                                    result.json()
                                        .then((res1) => {
                                            // console.log(res1)
                                            if (res1.status == true) {
                                                setData1(res1.data)
                                            }
                                            else {
                                                navigate('/login')
                                            }

                                        })

                            })
                        }
                        else {
                            navigate('/login')
                        }

                    })

            })
    }, [])

    React.useEffect(() => {


        
    }, [])

    function addProject(){
        let data1={"userId":userId,"name":name}
        fetch("https://agreeable-small-study.glitch.me/createProject",{
            method:'POST',
            headers:{
                // 'Content-type': 'multipart/form-data',
                'Accept':"application/json",
                'Content-type': 'application/json',
                
                
                'x-api-key':token

            },
            body:JSON.stringify(data1)
            
            
            
        }).then((result)=>result.json())
            .then((res)=>{
                // console.log(res)
                if(res.status==true) {
                    
                   
                    alert("Project added successfully")
                    window.location.reload(true)
                }

                else{
                    alert(res.message)
                }

            })
    }
    function openProject(id){
        navigate(`/project/${id}`)
    }

    function deleteProject(id){
        let data1={projectId:id}
        fetch("https://agreeable-small-study.glitch.me/deleteProject",{
            method:'DELETE',
            headers:{
                // 'Content-type': 'multipart/form-data',
                'Accept':"application/json",
                'Content-type': 'application/json',
                
                
                'x-api-key':token

            },
            body:JSON.stringify(data1)
            
            
            
        }).then((result)=>result.json())
            .then((res)=>{
                // console.log(res)
                if(res.status==true) {
                    
                   
                    alert("project deleted successfully")
                    window.location.reload(true)
                }

                else{
                    alert(res.message)
                }

            })

    }

    function editProject(){
        let data1={projectId:editId,name:name}
        fetch("https://agreeable-small-study.glitch.me/editProject",{
            method:'PUT',
            headers:{
                // 'Content-type': 'multipart/form-data',
                'Accept':"application/json",
                'Content-type': 'application/json',
                
                
                'x-api-key':token

            },
            body:JSON.stringify(data1)
            
            
            
        }).then((result)=>result.json())
            .then((res)=>{
                // console.log(res)
                if(res.status==true) {
                    
                   
                    alert("project edited successfully")
                    window.location.reload(true)
                }

                else{
                    alert(res.message)
                }

            })
    }
  return (
<>  
<Nav name={userName}/>  
<div class="container" >
    
    <h1 >your projects</h1>
	<div class="row">
		<div class="MultiCarousel" data-items="1,3,5,6" data-slide="1" id="MultiCarousel"  data-interval="1000">
            <div class="MultiCarousel-inner">
                {
                    data.map(x=>
                        !x.isDeleted?
                        <div class="item">
                            
                            <div style={{cursor: "pointer"}} onClick={()=>{openProject(x._id)}}class="pad15">
                                <p class="lead">{x.name}</p>
                                <p>   </p>
                                <p>     </p>
                                <p>project</p>
                            </div>
                            
                            <a style={{cursor: "pointer"}}  onClick={()=>deleteProject(x._id)}><i class="fa fa-trash" aria-hidden="true"></i></a>
                            <a style={{marginLeft:30, cursor: "pointer"}} onClick={()=>{setShow(true);setEdit(true);setEditId(x._id)}}><i  class="fa fa-edit" aria-hidden="true"></i></a>
                        </div>:<></>
                        
                        
                    )
                }
                <a onClick={()=>{setShow(true);setEdit(false)}} >
                    <div class="item" style={{cursor: "pointer"}}>
                        <div class="pad15">
                            <p class="lead">Add Project</p>
                            <p>  </p>
                            <p> + </p>
                            <p>  </p>
                        </div>
                    </div>
                </a>
                {
                    show?
                    <Modal.Dialog  >
                        <Modal.Header >
                            {
                                edit?<Modal.Title>Edit Project</Modal.Title>:
                                <Modal.Title>Add Project</Modal.Title>
                            }
                        
                        </Modal.Header>

                        <Modal.Body>
                        <div class="form-outline mb-4">
                            <input type="text" id="form2Example1" class="form-control" onChange={(e)=>{setName(e.target.value)}} />
                            <label class="form-label" for="form2Example1">Project Name</label>
                        </div>
                        </Modal.Body>

                        <Modal.Footer>
                        <Button variant="secondary" onClick={()=>setShow(false)}>Close</Button>
                        {
                            edit?<Button variant="primary" onClick={editProject}>Edit Project</Button>:
                            <Button variant="primary" onClick={addProject}>Add Project</Button>
                        }
                        
                        </Modal.Footer>
                    </Modal.Dialog>:<></>
                }




            </div>

        </div>
	</div>
    <h1 style={{borderTop: '1px solid blue'}}>others project</h1>
    <div class="row">
    <div class="MultiCarousel" data-items="1,3,5,6" data-slide="1" id="MultiCarousel"  data-interval="1000">
            <div class="MultiCarousel-inner">
                {
                    data1.map(x=>
                        
                        <a style={{cursor: "pointer"}} onClick={()=>{openProject(x._id)}}><div class="item">
                            <div class="pad15">
                                <p class="lead">{x.name}</p>
                                <p>   </p>
                                <p>     </p>
                                <p>project</p>
                            </div>
                        </div></a>
                        
                        
                    )
                }





            </div>

        </div>
    </div>
	
</div>
</>
  )
}

export default Home