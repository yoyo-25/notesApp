document.addEventListener("DOMContentLoaded", async () => {
    // Retrieve username from local storage
    const username = localStorage.getItem("username");
    const useremail = localStorage.getItem("useremail");

    // Display username wherever needed
    document.getElementById("usernametodisplay").innerHTML = username;
    document.getElementById("useremailtodisplay").innerHTML = useremail;



    //displaying notes from database

    try{
        const responseinbox = await fetch(`https://notesapp-o3mu.onrender.com/getnotes/${encodeURIComponent(useremail)}`, {
            method: "GET",
            headers: {
                "content-Type": "application/json"
            }
        })
        console.log("response", responseinbox);

        const notesboxdata = await responseinbox.json()
        const getstatuscode = responseinbox.status
        const actualNotes = notesboxdata;
        console.log("actualnotes",notesboxdata, getstatuscode);
        if(getstatuscode===404){
            console.log("user notes not found")
        } else if(getstatuscode===201){
            
            console.log("inside else",notesboxdata);

            let i =0;
            let displaynotesHtml = ""
            for(i=0; i<notesboxdata.length; i++){

                const eachnotes = notesboxdata[i]
                const titletodisplay = eachnotes.title
                const notestodisplay = eachnotes.notes
                console.log("title and notes are", titletodisplay, notestodisplay );

                displaynotesHtml += `<div class="eachnotes">
                    <div class="eachnotestitle">${titletodisplay}</div>
                    <div class="eachnotesdiscription">${notestodisplay}</div>
                </div>`;


            }
            document.getElementById("notesbox").innerHTML = displaynotesHtml   
        }

    } catch(err){
        console.log("error fetching data", err)
    }



    //saving notes to database

    document.getElementById("notesdata").addEventListener("submit", async (event)=>{
        event.preventDefault()
        const titleInput = document.getElementById("title")
        const notesInput = document.getElementById("notes")
        const title = titleInput.value;
        const notes = notesInput.value;
        if(!useremail){
            window.location.href='login.html'
        } else{
            try{
                const response = await fetch("https://notesapp-o3mu.onrender.com/addnotes", {
                    method: "POST",
                    headers: {
                        "content-Type": "application/json"
                    },
                    body: JSON.stringify({ email: useremail, title, notes })
                })
                const data = await response.json()
                const statuscode = data.statusCode
                if(statuscode===201){
                    let displaynotesinhtml = ""
                    displaynotesinhtml = `
                    <div class="eachnotes">
                        <div class="eachnotestitle">${title}</div>
                        <div class="eachnotesdiscription">${notes}</div>
                    </div>`;
                    document.getElementById("notesbox").innerHTML += displaynotesinhtml
                } else if(statuscode===500){
                    console.log("error saving notes")
                }
            } catch(error){
                console.log("error fetching data")
            }
        }
        

    })

});
