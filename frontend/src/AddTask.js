import React from 'react'
import { useNavigate } from 'react-router-dom'
import {Button,Modal} from 'react-bootstrap'

function AddTask({projectId}) {
    let [name,setName]=React.useState("")
    let [show,setShow]=React.useState(false)
    // let [description,setDescription]=React.useState("")
    let  navigate =useNavigate()

    let token = ""
    let userId=""
    if (localStorage.getItem('login2')) {
        token = JSON.parse(localStorage.getItem('login2')).token
        userId= JSON.parse(localStorage.getItem('login2')).userId
    }
    
    function addTask(){
        if(!name) return alert("name required")
        // if(!description) return alert("description required")
        
        let data={name:name,projectId:projectId}
        fetch("http://localhost:4000/createTask",{
            method:"POST",
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
                alert('Task Created successfully')
                window.location.reload(true);
            }
            else {
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
<div class="container">
    <button type="button" style={{width:100,height:50}} onClick={()=>setShow(true)}>Add Task</button>
  
    {
      show?
      <Modal.Dialog  >
        <Modal.Header >
        <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>

        <Modal.Body>
        <div class="form-outline mb-4">
            <input type="text" id="form2Example1" class="form-control" onChange={(e)=>{setName(e.target.value)}} />
            <label class="form-label" for="form2Example1">task  Name</label>
        </div>
        </Modal.Body>

        <Modal.Footer>
        <Button variant="secondary" onClick={()=>setShow(false)}>Close</Button>
        <Button variant="primary" onClick={addTask}>Add Task</Button>
        </Modal.Footer>
    </Modal.Dialog>:<></>
    }
  
</div>
  )
}

export default AddTask