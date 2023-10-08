import { useState } from "react";
import axios from 'axios'

function App(){
    const [form, setForm]= useState({
        username: "",
        password: ""
    })

    const [get, setGet]= useState([])

    function handleInput(event){
        const name= event.target.name
        const value= event.target.value

        setForm( (prev) => {
            return {...prev, [name]: value}
        })
    }

    function submitForm(){
    axios.post('http://localhost:3000/api/user', {
        username: form.username,
        password: form.password
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
    
    async function getUser() {
        try {
          const response = await axios.get('http://localhost:3000/api/user');
          if (Array.isArray(response.data)) {
            // Assuming the response is an array of user data objects
            setGet(response.data.map(user => `${user.username} - ${user.password}`).join(", "));
          } else {
            // Handle other response formats accordingly
            setGet(JSON.stringify(response.data));
          }
          // console.log(response.data);
        } catch (error) {
          console.error(error);
          setGet("Error occurred while fetching user data.");
        }
      }

    return(
        <>
        <h1>username is {form.username} and password is {form.password}</h1>
            <form>
                <div>
                    <label>
                    username :  
                    </label>
                    <label>
                        <input type="text" name="username" value={form.username} onChange={handleInput}/>
                    </label>
                </div>
                <div>
                    <label>
                    password :  
                    </label>
                    <label>
                        <input type="text" name="password" value={form.password} onChange={handleInput}/>
                    </label>
                </div>
                <input type="submit" onClick={submitForm}/>
            </form>
            <hr/>
            <br/>
            <h2>{get}</h2>
            <input type="submit" value="Get User" onClick={getUser} />
        </>
    )
}

export default App;