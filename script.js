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

            // Clear the input fields
            document.getElementById('addnamefield').value = '';
            document.getElementById('addemailfield').value = '';

            // Close the modal
            $('#addModal').modal('hide');
            renderTable();

        })
        .catch(error => {
            console.error('Error adding student:', error);
        });
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
    const newStudent = {
        id: id,
        name: name,
        email: email
    };
    fetch(config.host + '/api/Student/update-student', {
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
            throw new Error('Failed to edit student');
        })
        .then(data => {
            alert(data.message);

            // Close the modal
            $('#editModal').modal('hide');
            renderTable();

        })
        .catch(error => {
            console.error('Error editing student:', error);
        });
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

//function validateData(name, email) {
//  if(name == "" || email == "")
//{
// alert("All fields must be filled out");
//return false;
//}
//return true;
//}

function validateEmail(email) {
    // Regular expression for basic email validation
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validateForm() {
    var name = document.getElementById('addnamefield').value;
    var email = document.getElementById('addemailfield').value;

    if (name.trim() === "" || email.trim() === "") {
        alert("Name and Email must be filled out");
        return false;
    }

    if (!validateEmail(email)) {
        alert("Please enter a valid email address");
        return false;
    }

    return true;
}