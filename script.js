let config = {
    host: "https://localhost:7195"
}
document.addEventListener('DOMContentLoaded', function () {
    renderTable();
});

function renderTable() {
    fetch(config.host + '/api/Student/get-all-student')
        .then(response => response.json())
        .then(students => {
            const tableBody = document.getElementById('studentTableBody');
            tableBody.innerHTML = '';
            students.forEach(student => {
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>
                    <!-- Button trigger modal -->
                    <button type="button" onclick="editStudent('${student.id}','${student.name}','${student.email}')" class="btn btn-success" data-toggle="modal" data-target="#editModal">
                        Edit Student
                    </button>
                    
                    <!-- Button trigger modal -->
                    <button type="button" onclick="deleteStudent('${student.id}')" class="btn btn-danger" data-toggle="modal" data-target="#deleteModal">
                        Delete Student
                    </button>
            
                <td>
            `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching students:', error);
        });
}
document.getElementById('addbtn').addEventListener('click', function () {
    let name = document.getElementById("addnamefield").value;
    let email = document.getElementById("addemailfield").value;
    if (validateUserName(name) == true && ValidateEmail(email) == true) {
        console.log("both validated");
        const newStudent = {
            name: name,
            email: email
        };
        fetch(config.host + '/api/Student/add-student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newStudent)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to add student');
            })
            .then(data => {
                alert(data.message);
                console.table(data);

                // Clear the input fields
                document.getElementById('addnamefield').value = '';
                document.getElementById('addemailfield').value = '';

                document.getElementById('addnamevalidation').innerText = "";
                document.getElementById('addemailvalidation').innerText = "";

                // Close the modal
                $('#addModal').modal('hide');
                renderTable();

            })
            .catch(error => {
                console.error('Error adding student:', error);
            });
    }
    else if (validateUserName(name) == false && ValidateEmail(email) == true) {
        document.getElementById('addnamevalidation').innerText = "Username not Valid";
        document.getElementById('addemailvalidation').innerText = "";
    }
    else if (validateUserName(name) == true && ValidateEmail(email) == false) {
        document.getElementById('addnamevalidation').innerText = "";
        document.getElementById('addemailvalidation').innerText = "Email not Valid";
    }
    else {
        console.log("both not validated");
        document.getElementById('addnamevalidation').innerText = "Username not Valid";
        document.getElementById('addemailvalidation').innerText = "Email not Valid";
    }
})



function editStudent(id, name, email) {
    document.getElementById('editidfield').value = id;
    document.getElementById('editnamefield').value = name;
    document.getElementById('editemailfield').value = email;
}

document.getElementById('editbtn').addEventListener('click', function () {
    let id = document.getElementById("editidfield").value;
    let name = document.getElementById("editnamefield").value;
    let email = document.getElementById("editemailfield").value;
    if (validateUserName(name) == true && ValidateEmail(email) == true) {
        const newStudent = {
            id: id,
            name: name,
            email: email
        };
        console.log(JSON.stringify(newStudent))
        fetch(config.host + '/api/Student/update-student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newStudent)
        })
            .then(data => {
                console.table(data);
                alert("Student Updated Successfully !");

                // Clear the input fields
                document.getElementById('editnamefield').value = '';
                document.getElementById('editemailfield').value = '';

                document.getElementById('editnamevalidation').innerText = "";
                document.getElementById('editemailvalidation').innerText = "";

                // Close the modal
                $('#editModal').modal('show');
                renderTable();

            })
            .catch(error => {
                console.error('Error updating student:', error);
            });
    }
    else if (validateUserName(name) == false && ValidateEmail(email) == true) {
        document.getElementById('editnamevalidation').innerText = "Username not Valid";
        document.getElementById('editemailvalidation').innerText = "";
    }
    else if (validateUserName(name) == true && ValidateEmail(email) == false) {
        document.getElementById('editnamevalidation').innerText = "";
        document.getElementById('editemailvalidation').innerText = "Email not Valid";
    }
    else {
        console.log("both not validated");
        document.getElementById('editnamevalidation').innerText = "Username not Valid";
        document.getElementById('editemailvalidation').innerText = "Email not Valid";
    }

})

function deleteStudent(studentId) {
    if (confirm("Are you sure you want to delete this student?")) {
        fetch(config.host + `/api/Student/delete-student-by-id/${studentId}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to delete student');
            })
            .then(data => {
                alert(data.message);
                renderTable();
            })
            .catch(error => {
                console.error('Error deleting student:', error);
            });
    }
}

function ValidateEmail(email) {
    // Regular expression pattern for validating email
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateUserName(userName) {
    var re = /^[a-zA-Z]{5,}$/;
    return re.test(userName);
}