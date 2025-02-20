const useAuth = () =>{
    const token = localStorage.getItem("token_user");
    if (token == null){
        return false;
    }

    let url = `${process.env.REACT_APP_API_URL}/users`;
    fetch(url,{
        method : "GET",
        headers:{
            "Authorization" : `Bearer ${token}`
        }
    })
    .then((res)=>{
        if (!res.ok) {
            return false;
        }
        return res.json()
    })
    .then((data)=>{
        console.log(data);
    })
    .catch(error=>{
        console.log(error); 
    })

    return true;
}

export default useAuth;