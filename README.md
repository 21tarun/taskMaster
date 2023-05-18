
## Project - Task Master

## Overview 
- In this Task Master Project any authenticated person can create their own projects. And in that projects Admin(project creator) can create task and assign that tasks to specific person by their email id. after assigning task to that person, that person can also able to access that project in own profile.
- Admin and  authenticated person that has assigned project can comment to perticular task.


## Backend


### Key points

- This project is divided into 4 features namely User, Project, Task and Comment.
- I used MongoDb as a Database.



## FEATURE I - User
### Models
- User Model
```yaml
{ 
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    projects:{
        type:[objectId],
        ref:'projects',
        default:[]
    },
  createdAt: {timestamp},
  updatedAt: {timestamp}
}
```



## User APIs 
- POST /createUser
- POST /login
- GET / getUserProjects (this api is authenticated)


## FEATURE 2 - Project

- Project  Model
```yaml
{ 
    name:{
        type:String
    },
    userId:{
        type:objectId,
        ref:"user"
    },

    taskList:{
        type:[objectId],
        ref:'tasks',
        default:[]
    },
    members:{
        type:[String],
        
        default:[]
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
  createdAt: {timestamp},
  updatedAt: {timestamp}
}
```

## Project APIs
- POST /createProject (Authenticated API)
- GET  /project/:projectId ( Access specific Project with their ID and this api is also authenticated)
- DELETE /deleteProject (Authenticated API)
- PUT /editProject ( Authenticated API)
- POST /addMember ( A admin of the project can add members )
- POST /getProjectOnMembers (on the basis of email of authenticated person we will get all projects those project "Members List" has that perticular email id)


## FEATURE 3 - Task

- Task  Model
```yaml
{ 
    name:{
        type:String
    },
    status:{
        type:String,
        default:'Todo'
    },
    projectId:{
        type:objectId
    },
    assignTo:{
        type:String
    },
    comments:{
        type:[objectId],
        ref:'comment'

    },
    totalComment:{
        type:Number,
        default:0
    },

    isDeleted:{
        type:Boolean,
        default:false
    },
  createdAt: {timestamp},
  updatedAt: {timestamp}
}
```

## Task APIs

- POST /createTask (Authenticated api)
- PUT /editTask (Authenticated api)
- DELETE /deleteTask (authenticated api)
- POST /getTaskById (this is for geting all the comments for that perticular task and this is Authenticated api)


## FEATURE 4 - Comment

- Comment  Model
```yaml
{ 
    taskId:objectId,
    userId:{
        type:objectId,
        ref:"user"
    },
    message:String,
    dateTime:String,


    isDeleted:{
        type:Boolean,
        default:false
    },
  createdAt: {timestamp},
  updatedAt: {timestamp}
}
```

## Comment APIs

- POST /createComment (Authenticated)
- POST /deleteComment (Authenticated)





