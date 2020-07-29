
document.addEventListener('click', function(e)
{

    if(e.target && e.target.id == 'submit-sign-up')
    {
        let obj = 
        {
            username : document.getElementById("username2").value,
            password: document.getElementById("password2").value,
            email: document.getElementById("email").value
        }
        
        fetch('http://localhost:3000/sign-up', {
        method: 'post',
        headers: {  
            "Content-type": "application/json"
        },
        body: JSON.stringify(obj)
        }).then(function (response) {
            console.log(response);
            response.json().then(function (res){
                console.log(res);
            }).catch((err) => {
                console.log(err);
            });
        }).catch((e) => {
            console.log(e);
        });
    }
});
