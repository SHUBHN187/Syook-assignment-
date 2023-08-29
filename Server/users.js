const userlist=[]
const addup=({id,username,room})=>{
username=username.trim().toLowerCase()
room=room.trim().toLowerCase()

const existinguser=userlist.find((user)=>user.room===room&&user.username===username)
if(existinguser){
    if(!username || !room) return { error: 'Username and room are required.' };
  if(existinguser) return { error: 'Username is taken.' };
   
}
const user={id,username,room}
userlist.push(user)
return {error: null, user};
}


const getuser=(id)=> {
    return userlist.find((user)=>user.id===id)
}


module.exports={addup,getuser}