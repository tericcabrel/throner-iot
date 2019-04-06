export default function (users) {
  return  users.map(user => ({ 
  			user_id: user.user_id,
  			name: user.name,
  			username: user.username,
  			email: user.email  
  		  }));
}