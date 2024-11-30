var datenow = new Date();
var Company = [];
var Employee = [];

$(document).ready(function () {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    });

    $.fn.dataTable.ext.errMode = 'none';
    $('#Interview').dataTable({
        "ajax": {
            url: "/Interview/LoadInterview",
            type: "GET",
            dataType: "json",
            dataSrc: ""
        },
        "columnDefs": [
            { "orderable": false, "targets": 7 },
            { "searchable": false, "targets": 7 }
        ],
        "columns": [
            {
                data: null, render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { data: "title" },
            { data: "companyName" },
            { data: "emailInterviewer" },
            { data: "interviewer" },
            { data: "addressInterview" },
            {
                data: "interviewDate", render: function (data) {
                    return moment(data).format('DD/MM/YYYY');
                }
            },
            {
                data: null, render: function (data, type, row) {
                    return `<td>
                    <div class='btn-group'>
                      <button type='button' class='btn btn-warning' id='BtnEdit' data-toggle='tooltip' data-placement='top' title='Edit' data-original-title='Edit' onclick=GetById('` + row.id + `');><i class='fas fa-pencil-alt'></i></button>

                      <button type='button' class='btn btn-danger' id='BtnDelete' data-toggle='tooltip' data-placement='top' title='Delete' data-original-title='Delete' onclick=Delete('` + row.id + `');><i class='fa fa-trash'></i></button> 

                      <button type='button' class='btn btn-primary' id='BtnAssign' data-toggle='modal' data-target='#ModalAssign' title='Assign Employee Here' data-original-title='Assign Employee Here' onclick=AssignEmployee('` + row.id + `');><i class='fa fa-user-plus'></i></button>
                    </div></td>`;
                }
            },
        ]
    });

    $('#InterviewEmp').dataTable({
        "ajax": {
            url: "/Interview/LoadEmpInterview",
            type: "GET",
            dataType: "json",
            dataSrc: ""
        },
        "columnDefs": [
            { "orderable": false, "targets": 6 },
            { "searchable": false, "targets": 6 }
        ],
        "columns": [
            {
                data: null, render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { data: "fullName" },
            { data: "companyName" },
            { data: "interviewer" },
            {
                data: "interviewDate", render: function (data) {
                    return moment(data).format('DD/MM/YYYY');
                }
            },
            {
                data: "status", render: function (data) {
                    return "<span class='badge badge-pill badge-info'>Waiting</span>";
                }
            },
            {
                data: null, render: function (data, type, row) {
                    return "<td><div class='btn-group'><button type='button' class='btn btn-info' id='BtnEdit' data-toggle='tooltip' data-placement='top' title='Send Mail' data-original-title='Send Mail' onclick=SendEmail('" + row.id + "');><i class='fa fa-envelope'></i></button> <button type='button' class='btn btn-danger' id='BtnDelete' data-toggle='tooltip' data-placement='top' title='Delete' data-original-title='Delete' onclick=DeleteUserInterview('" + row.id + "');><i class='fa fa-trash'></i></button></div></td>";
                }
            },
        ]
    });

    $('#History').dataTable({
        "ajax": {
            url: "/Interview/LoadHistory",
            type: "GET",
            dataType: "json",
            dataSrc: ""
        },
        "columnDefs": [
            { "orderable": false, "targets": 6 },
            { "searchable": false, "targets": 6 }
        ],
        "columns": [
            {
                data: null, render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { data: "fullName" },
            { data: "companyName" },
            { data: "interviewer" },
            {
                data: "interviewDate", render: function (data) {
                    return moment(data).format('DD/MM/YYYY');
                }
            },
            {
                data: "status", render: function (data) {
                    return "<span class='badge badge-pill badge-success'>Sended</span>";
                }
            },
            {
                data: null, render: function (data, type, row) {
                    return "<td><div class='btn-group'><button type='button' class='btn btn-danger' id='BtnDelete' data-toggle='tooltip' data-placement='top' title='Delete' data-original-title='Delete' onclick=DeleteUserInterview('" + row.id + "');><i class='fa fa-trash'></i></button></div></td>";
                }
            },
        ]
    });

    LoadCompany($('#CompanyOption'));
    LoadCompany($('#CompanyOption2'));
    LoadEmployee($('#EmployeeOption'));

    $('#panel1').show();
    $('#panel2').hide();
}); //load table Interview
/*--------------------------------------------------------------------------------------------------*/
function LoadCompany(element) {
    if (Company.length === 0) {
        $.ajax({
            type: "Get",
            url: "/Company/LoadCompany",
            success: function (data) {
                Company = data.data;
                renderCompany(element);
            }
        });
    }
    else {
        renderCompany(element);
    }
} //load company
function renderCompany(element) {
    var $option = $(element);
    $option.empty();
    $option.append($('<option/>').val('0').text('Select Company').hide());
    $.each(Company, function (i, val) {
        $option.append($('<option/>').val(val.id).text(val.name));
    });
} // Memasukan LoadCompany ke dropdown
/*--------------------------------------------------------------------------------------------------*/
document.getElementById("BtnAdd").addEventListener("click", function () {
    clearscreen();
    $('#SaveBtn').show();
    $('#UpdateBtn').hide();
    LoadCompany($('#CompanyOption'));
}); //fungsi btn add
/*--------------------------------------------------------------------------------------------------*/
function clearscreen() {
    $('#Id').val('');
    $('#Title').val('');
    $('#CompanyOption').val('');
    $('#Division').val('');
    $('#JobDesk').val('');
    $('#Address').val('');
    $('#EmailInterviewer').val('');
    $('#Interviewer').val('');
    $('#InterviewDate').val('');
    LoadCompany($('#CompanyOption'));
} //clear field
/*--------------------------------------------------------------------------------------------------*/
function GetById(Id) {
    debugger;
    $.ajax({
        url: "/Interview/GetById/" + Id,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        async: false,
        success: function (result) {
            debugger;
            $('#Id').val(result.id);
            $('#Title').val(result.title);
            $('#CompanyOption').val(result.companyId);
            $('#Division').val(result.division);
            $('#JobDesk').val(result.jobDesk);
            $('#Address').val(result.addressInterview);
            $('#InterviewDate').val(moment(result.interviewDate).format('YYYY-MM-DD'));
            $('#EmailInterviewer').val(result.emailInterviewer);
            $('#Interviewer').val(result.interviewer);
            $('#myModal').modal('show');
            $('#UpdateBtn').show();
            $('#SaveBtn').hide();
        },
        error: function (errormessage) {
            alert(errormessage.responsText);
        }
    })
} //get id to edit
/*--------------------------------------------------------------------------------------------------*/
function Save() {
    $.fn.dataTable.ext.errMode = 'none';
    var table = $('#Interview').DataTable({
        "ajax": {
            url: "/Interview/LoadInterview"
        }
    });
    var Interview = new Object();
    Interview.Title = $('#Title').val();
    Interview.CompanyId = $('#CompanyOption').val();
    Interview.Division = $('#Division').val();
    Interview.JobDesk = $('#JobDesk').val();
    Interview.InterviewDate = $('#InterviewDate').val();
    Interview.AddressInterview = $('#Address').val();
    Interview.EmailInterviewer = $('#EmailInterviewer').val();
    Interview.Interviewer = $('#Interviewer').val();
    if ($('#Title').val() == "" || $('#CompanyOption').val() == "0" || $('#Division').val() == "" || $('#JobDesk').val() == "" || $('#InterviewDate').val() == "" || $('#Address').val() == "" || $('#EmailInterviewer').val() == "" || $('#Interviewer').val() == "") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Input Cannot be Empty',
        })
        return false;
    } else {
        $.ajax({
            type: 'POST',
            url: '/Interview/InsertOrUpdate',
            data: Interview
        }).then((result) => {
            if (result.statusCode === 200 || result.statusCode === 201 || result.statusCode === 204) {
                Swal.fire({
                    icon: 'success',
                    position: 'center',
                    title: 'Interview Add Successfully',
                    timer: 2500
                }).then(function () {
                    table.ajax.reload();
                    $('#myModal').modal('hide');
                    clearscreen();
                });
            }
            else {
                Swal.fire('Error', 'Failed to Input', 'error');
            }
        })
    }
} //function save
/*--------------------------------------------------------------------------------------------------*/
function Edit() {
    $.fn.dataTable.ext.errMode = 'none';
    var table = $('#Interview').DataTable({
        "ajax": {
            url: "/Interview/LoadInterview"
        }
    });

    var Interview = new Object();
    Interview.Id = $('#Id').val();
    Interview.Title = $('#Title').val();
    Interview.CompanyId = $('#CompanyOption').val();
    Interview.Division = $('#Division').val();
    Interview.JobDesk = $('#JobDesk').val();
    Interview.InterviewDate = $('#InterviewDate').val();
    Interview.AddressInterview = $('#Address').val();
    Interview.EmailInterviewer = $('#EmailInterviewer').val();
    Interview.Interviewer = $('#Interviewer').val();

    if ($('#Title').val() == "" || $('#CompanyOption').val() == "0" || $('#Division').val() == "" || $('#JobDesk').val() == "" || $('#InterviewDate').val() == "" || $('#Address').val() == "" || $('#EmailInterviewer').val() == "" || $('#Interviewer').val() == "") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Input Cannot be Empty',
        })
        return false;
    } else {
        $.ajax({
            type: 'POST',
            url: '/Interview/InsertOrUpdate',
            data: Interview
        }).then((result) => {
            debugger;
            if (result.statusCode === 200) {
                Swal.fire({
                    icon: 'success',
                    position: 'center',
                    title: 'Interview Update Successfully',
                    timer: 2500
                }).then(function () {
                    table.ajax.reload();
                    $('#myModal').modal('hide');
                    clearscreen();
                });
            } else {
                Swal.fire('Error', 'Failed to Edit', 'error');
            }
        })
    }
}//function edit
/*--------------------------------------------------------------------------------------------------*/
function Delete(Id) {
    $.fn.dataTable.ext.errMode = 'none';
    var table = $('#Interview').DataTable({
        "ajax": {
            url: "/Interview/LoadInterview"
        }
    });
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.value) {
            //debugger;
            $.ajax({
                url: "/Interview/Delete/",
                data: { Id: Id }
            }).then((result) => {
                debugger;
                if (result.statusCode == 200) {
                    Swal.fire({
                        icon: 'success',
                        position: 'center',
                        title: 'Delete Successfully',
                        timer: 2000
                    }).then(function () {
                        table.ajax.reload();
                        cls();
                        $('#Interview').modal('hide');
                    });
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'error',
                        text: 'Failed to Delete',
                    })
                    ClearScreen();
                }
            })
        }
    });
} //function delete


//Fungsi Assign Employee
function LoadEmployee(element) {
    if (Employee.length === 0) {
        $.ajax({
            type: "Get",
            url: "/User/LoadEmployee",
            success: function (data) {
                Employee = data;
                renderEmployee(element);
            }
        });
    }
    else {
        renderEmployee(element);
    }
} //load user/employee
function renderEmployee(element) {
    var $option = $(element);
    $option.empty();
    $option.append($('<option/>').val('0').text('Select Employee').hide());
    $.each(Employee, function (i, val) {
        $option.append($('<option/>').val(val.id).text(val.firstName + " " + val.lastName));
    });
} // Memasukan LoadEmployee ke Selectbox
/*--------------------------------------------------------------------------------------------------*/

function AssignEmployee(Id) {
    //debugger;
    $.ajax({
        url: "/Interview/GetById/" + Id,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        async: false,
        success: function (result) {
            //debugger;
            $('#InterviewId').val(result.id);
            $('#Title2').val(result.title);
            $('#CompanyOption2').val(result.companyId);
            $('#Division2').val(result.division);
            $('#JobDesk2').val(result.jobDesk);
            $('#Address2').val(result.addressInterview);
            $('#InterviewDate2').val(moment(result.interviewDate).format('YYYY-MM-DD'));
            $('#EmailInterviewer2').val(result.emailInterviewer);
            $('#Interviewer2').val(result.interviewer);
            $('#ModalAssign').modal('show');
        },
        error: function (errormessage) {
            alert(errormessage.responsText);
        }
    })
}

function Assign() {
    $.fn.dataTable.ext.errMode = 'none';
    var table = $('#Interview').DataTable({
        "ajax": {
            url: "/Interview/LoadInterview"
        }
    });
    var table2 = $('#InterviewEmp').DataTable({
        "ajax": {
            url: "/Interview/LoadInterviewEmp"
        }
    });
    var table3 = $('#History').DataTable({
        "ajax": {
            url: "/Interview/LoadHistory"
        }
    });

    var Interview = new Object();
    Interview.UserId = $('#EmployeeOption').val();
    Interview.InterviewId = $('#InterviewId').val();
    if ($('#EmployeeOption').val() == "0") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please Select one of Employee',
        })
        return false;
    } else {
        $.ajax({
            type: 'POST',
            url: '/Interview/AssignEmployee',
            data: Interview
        }).then((result) => {
            if (result.statusCode === 200) {
                Swal.fire({
                    icon: 'success',
                    position: 'center',
                    title: 'Assign Employee Success',
                    timer: 2500
                }).then(function () {
                    table.ajax.reload();
                    table2.ajax.reload();
                    table3.ajax.reload();

                    $('#ModalAssign').modal('hide');
                    $('#SelectEmployee').val(0);
                });
            }
            else {
                Swal.fire('Error', 'Please Select Employee & Interview', 'error');
            }
        })
    }
} //function Assign Employee
/*--------------------------------------------------------------------------------------------------*/
function SendEmail(id) {
    debugger;
    $.ajax({
        url: "/Interview/GetDataSendEmail/" + id,
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        async: false,
        success: function (result) {
            debugger;
            $('#InterviewId').val(result[0].id);
            $('#UserId').val(result[0].userId);
            $('#Email_User').val(result[0].emailUser);
            $('#FullName').val(result[0].fullName);
            $('#CompanyName').val(result[0].companyName);
            $('#InterviewDates').val(result[0].interviewDate);
            $('#AddressInterview').val(result[0].addressInterview);
            $('#Interviewers').val(result[0].interviewer);
            $('#Email_Interviewer').val(result[0].emailInterviewer);
            Send();
        },
        error: function () {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to Get Data',
            });
        }
    })
} //get data for confirm

function Send() {
    $.fn.dataTable.ext.errMode = 'none';
    var table = $('#Interview').DataTable({
        "ajax": {
            url: "/Interview/LoadInterview"
        }
    });
    var table2 = $('#InterviewEmp').DataTable({
        "ajax": {
            url: "/Interview/LoadInterviewEmp"
        }
    });
    var table3 = $('#History').DataTable({
        "ajax": {
            url: "/Interview/LoadHistory"
        }
    });

    Swal.fire({
        title: "Are you sure ?",
        text: "You won't be able to Revert this!",
        showCancelButton: true,
        showLoaderOnConfirm: true,
        confirmButtonText: "Yes, Send Email!",
    }).then((result) => {
        if (result.value) {
            var Interview = new Object();
            Interview.Id = $('#InterviewId').val();
            Interview.UserId = $('#UserId').val();
            Interview.EmailUser = $('#Email_User').val();
            Interview.EmailInterviewer = $('#Email_Interviewer').val();
            Interview.FullName = $('#FullName').val();
            Interview.CompanyName = $('#CompanyName').val();
            Interview.InterviewDate = $('#InterviewDates').val();
            Interview.Interviewer = $('#Interviewers').val();
            Interview.AddressInterview = $('#AddressInterview').val();
            $.ajax({
                type: 'POST',
                url: '/Interview/ConfirmInterview',
                data: Interview
            }).then((result) => {
                //debugger;
                if (result.statusCode === 200) {
                    Swal.fire({
                        icon: 'success',
                        position: 'center',
                        title: 'Send Email Interview Success!',
                        timer: 2500
                    }).then(function () {
                        table.ajax.reload();
                        table2.ajax.reload();
                        table3.ajax.reload();
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to Send!',
                    });
                }
            })
        }
    })
}

function DeleteUserInterview(Id) {
    $.fn.dataTable.ext.errMode = 'none';
    var table = $('#Interview').DataTable({
        "ajax": {
            url: "/Interview/LoadInterview"
        }
    });
    var table2 = $('#InterviewEmp').DataTable({
        "ajax": {
            url: "/Interview/LoadInterviewEmp"
        }
    });
    var table3 = $('#History').DataTable({
        "ajax": {
            url: "/Interview/LoadHistory"
        }
    });

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to Revert this!",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete it!"
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: "/Interview/DeleteUserInterview/",
                data: { Id: Id }
            }).then((result) => {
                debugger;
                if (result.statusCode == 200) {
                    Swal.fire({
                        icon: 'success',
                        position: 'center',
                        title: 'Delete Successfully',
                        timer: 2500
                    }).then(function () {
                        table.ajax.reload();
                        table2.ajax.reload();
                        table3.ajax.reload();
                    });
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: 'error',
                        text: 'Failed to Delete',
                    })
                    ClearScreen();
                }
            })
        }
    });
} //function delete