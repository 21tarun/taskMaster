import React from 'react'
import { useNavigate } from 'react-router-dom'
import {Button,Modal} from 'react-bootstrap'

function AddTask({projectId,members,userEmail}) {
    let [name,setName]=React.useState("")
    let [show,setShow]=React.useState(false)
    let [assignTo,setAssignTo]=React.useState("")
    // let [description,setDescription]=React.useState("")
    let  navigate =useNavigate()
    console.log("members is",members)

    let token = ""
    let userId=""
    if (localStorage.getItem('login2')) {
        token = JSON.parse(localStorage.getItem('login2')).token
        userId= JSON.parse(localStorage.getItem('login2')).userId
    }

    
    function addTask(){
        if(!name) return alert("name required")
        // if(!description) return alert("description required")
        
        let data={name:name,projectId:projectId,assignTo:assignTo}
        fetch("https://agreeable-small-study.glitch.me/createTask",{
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
            <label class="form-label" for="form2Example1">task  Name</label>
            <input type="text" id="form2Example1" class="form-control" onChange={(e)=>{setName(e.target.value)}} /> <br/>
            <label class="form-label" for="form2Example1">task assign to</label>
            <select name="cars" id="cars" onChange={(e)=>{setAssignTo(e.target.value)}}>
                <option value="">Select</option>
                <option value={userEmail}>You</option>

                {
                    members.map(x=>
                        <option value={x}>{x}</option>
                    )
                }

            </select>
            
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