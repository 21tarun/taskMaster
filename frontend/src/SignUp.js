import React from 'react'
import { useNavigate} from 'react-router-dom'

function SignUp() {
    let [email,setEmail]=React.useState("")
    let [password,setPassword]=React.useState("")
    let [name,setName]=React.useState("")
    const navigate =useNavigate()

    let data={name,email,password}

    function register(){
        fetch("https://agreeable-small-study.glitch.me/createUser",{
            method:"POST",
            headers:{
                'Content-type': 'application/json',

            },
            body: JSON.stringify(data)

        })
        .then((result)=>result.json())
        .then(res=>{
            if(res.status==true){
                data={email,password}
                fetch("https://agreeable-small-study.glitch.me/login",{
                    method:"POST",
                    headers:{
                        'Content-type': 'application/json',
        
                    },
                    body: JSON.stringify(data)
        
                })
                .then((result)=>result.json())
                .then(res=>{
                    if(res.status==true){
                        console.log(res)
                        localStorage.setItem('login2',JSON.stringify({
                            login:res.name,
                            token:res.token,
                            userId:res.userId
        
                        }))
                        navigate("/")
                        
        
                        
                    }
                    else if(res.status==false){
                        
                        if(res.message=="email id or password is worng") alert("invalid email or password")
                        else alert(res.message)
                    }
        
                    
                })
                

                
            }
            else if(res.status==false){
                alert(res.message)
            }

            
        })

    }
  return (
    <div className='container' style={{marginTop:"100px"}}>
    <h1>SignIn to TaskMaster</h1>
    <div class="form-outline mb-4">
        <input type="text" id="form2Example1" class="form-control" onChange={(e)=>{setName(e.target.value)}} />
        <label class="form-label" for="form2Example1">User Name</label>
    </div>

    <div class="form-outline mb-4">
        <input type="email" id="form2Example1" class="form-control" onChange={(e)=>{setEmail(e.target.value)}} />
        <label class="form-label" for="form2Example1">Email address</label>
    </div>


    <div class="form-outline mb-4">
        <input type="password" id="form2Example2" class="form-control" onChange={(e)=>{setPassword(e.target.value)}}/>
        <label class="form-label" for="form2Example2">Password</label>
    </div>




    <button type="button" class="btn btn-primary btn-block mb-4" onClick={register}>SignUp</button>

    <div class="text-center">
        <p>Not a member? <a onClick={()=>navigate('/login')}>login</a></p>
        

    </div>

</div>
  )
}

export default SignUp