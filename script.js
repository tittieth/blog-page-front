import {printLoginForm, printLogoutBtn} from "./userform.js";

let root = document.getElementById("blogPosts");
export let txtArea = document.getElementById("textArea");

if (localStorage.getItem("username")) {
    console.log("ÄR INLOGGAD");
    printLogoutBtn();
    printTextArea();
} else {
    console.log("ÄR EJ INLOGGAD");
    printLoginForm();
}

function printBlogPosts() {
    fetch("http://localhost:3000/blogposts")
    .then(res => res.json())
    .then(posts => {
        console.log(posts);

        let blogPosts = document.createElement("ul");
        blogPosts.classList.add("blogPosts");
        blogPosts.innerHTML = "";

        posts.map(post => {
            let li = document.createElement("li");
            li.id = post.author;
            li.innerHTML = `<h1>${post.title}</h1><p>${post.content}</p>`;
            blogPosts.appendChild(li);
    })

    root.innerHTML = "";
    root.appendChild(blogPosts);
    });  
}

export function printTextArea() {
    txtArea.innerHTML = `        <label>Titel:</label>
    <input type="text" id="title" name="title"><br>
    <label>Innehåll:</label>
    <textarea id="textContent"></textarea>
    <button id="saveBtn">Spara</button>
    <div id="textResult"></div>`

    tinymce.init({
        selector: "#textContent",
        plugins: "code",
        toolbar: "undo redo | forecolor backcolor | styles | styleselect bold italic | alignleft alignright | code",
    
        setup: function(editor) {
            editor.on("change", function() {
                editor.save();
            })
        }
    })

    document.getElementById("saveBtn").addEventListener("click", function(e) {
        e.preventDefault();
    
        let user = JSON.parse(localStorage.getItem("user"));
        console.log(JSON.stringify(user));
    
        let blogPost = {
            author: user._id,
            title: document.getElementById("title").value,
            content: tinymce.activeEditor.getContent()
        }
    
        console.log(blogPost);
    
        fetch("http://localhost:3000/blogposts/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(blogPost),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            printBlogPosts();
          });
    })
}

printBlogPosts();