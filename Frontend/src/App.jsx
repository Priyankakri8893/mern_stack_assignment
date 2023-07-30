import { useState } from "react";


function App(){
    const [form, setForm]= useState("")
    
    return(
        <>
            <form>
                <div>
                    <label>
                        Name :  
                    </label>
                    <label>
                        <input type="text" />
                    </label>
                </div>
                <div>
                    <label>
                        Password :  
                    </label>
                    <label>
                        <input type="text"/>
                    </label>
                </div>
                <input type="submit"/>
            </form>
        </>
    )
}

export default App;