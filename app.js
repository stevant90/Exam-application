var dataController = (function () {

    var data = {
        examList: [],
        passedStudentList: [],
        failedStudentList: []
    };

    function Exam(subject, studentObj) {
        this.subject = subject;
        this.studentObj = studentObj;
      
    }
    Exam.prototype.getData = function () {
        return "From subject " + this.subject + ", student: " + this.studentObj.getData();
    };


    function Student(name, grade) {
        this.name = name;
        this.grade = grade;
    }
    Student.prototype.getData = function () {
        return this.name + " has grade: " + this.grade;
    };

    function createExam(subject, name, grade) {
        var student = new Student(name, grade);
        var exam = new Exam(subject, student);

        data.examList.unshift(exam);

        if (student.grade > 5) {
            data.passedStudentList.push(student);
        } else {
            data.failedStudentList.push(student);
        }

        return exam;
    }

    function getNumOfStudents() {
        var studentsList = data.examList;
        var totalStudents = 0;

        totalStudents += studentsList.length

        return totalStudents;
    }

    function getNumOfPassedStudents() {

        var passedList = data.passedStudentList.length
        return passedList;
    }

    function getNumOfFailedStudents() {
        
        var failedList = data.failedStudentList.length;
        return failedList;
    }

    return {
        createExam: createExam,
        getNumOfStudents: getNumOfStudents,
        getNumOfPassedStudents: getNumOfPassedStudents,
        getNumOfFailedStudents: getNumOfFailedStudents
    };

})();

var UIController = (function () {


    var DOMStrings = {
        studentTotal: ".total-students",
        examPassedCount: ".exam-passed-count",
        examFailedCount: ".exam-failed-count",
        ExamPassedPercent: ".exam-passed-percentage",
        examFailedPercent: ".exam-failed-percentage",
        addSubject: ".add-subject",
        studentNameElement: ".add-student-name",
        gradeElement: ".add-grade",
        addBtn: ".add-btn",
        passedList: ".passed-list",
        failedList: ".failed-list",
        errorText: ".error-text"

    };

    function collectInputs() {
        var subjectSelect = document.querySelector(DOMStrings.addSubject);
        var subjectOption = subjectSelect[subjectSelect.selectedIndex];
        var studentNameInput = document.querySelector(DOMStrings.studentNameElement);
        var gradeInput = document.querySelector(DOMStrings.gradeElement);

        var result = {
            subject: subjectOption.value,
            studentName: studentNameInput.value,
            grade: gradeInput.value
        };

            return result;

    }

    function clearInputs() {

        document.querySelector(DOMStrings.errorText).textContent = "";
        document.querySelector(DOMStrings.addSubject).selectedIndex = 0;
        document.querySelector(DOMStrings.studentNameElement).value = "";
        document.querySelector(DOMStrings.gradeElement).value = "";

    }

    function showError(input) {
        var errorMessage;

       if (!input.subject && !input.studentName && !input.grade) {
            errorMessage = "Please fill all fields";
        } else if (!input.subject) {
            errorMessage = "Please select subject";
        } else if (!input.studentName) {
            errorMessage = "Please enter student's name";
        } else if (!input.grade) {
            errorMessage = "Please enter grade";
        }else if (input.grade > 10 || input.grade <= 0) {
            errorMessage = "Grade must be between 1 and 10";   
        } 
        

       document.querySelector(DOMStrings.errorText).textContent = errorMessage;
       
    }

    function displayExamAndStudent(exam) {
        
        examListHTML = "<li>" + exam.getData() + "</li>";
        

        if (exam.studentObj.grade > 5) {
            document.querySelector(DOMStrings.passedList).insertAdjacentHTML("afterbegin", examListHTML);
        } else if (exam.studentObj.grade <= 5) {
            document.querySelector(DOMStrings.failedList).insertAdjacentHTML("afterbegin", examListHTML);
        }
    }

    function displayNumOfStudents(total) {

        total = total || 0;

        document.querySelector(DOMStrings.studentTotal).textContent = total;
    }

    function displayPercentage(passed, failed, allStudents) {
        

        var failedPercent = Math.round((failed / allStudents) * 100) + "%"; 
        document.querySelector(DOMStrings.examFailedPercent).textContent = failedPercent;

        var passPercent = Math.round((passed / allStudents) * 100) + "%"; 
        document.querySelector(DOMStrings.ExamPassedPercent).textContent = passPercent;
      
    }

    function displayPassedStudentsNum(passedNum) {
  
        document.querySelector(DOMStrings.examPassedCount).textContent = passedNum;
        
    }

    function displayFailedStudentsNum(failedNum) {

        document.querySelector(DOMStrings.examFailedCount).textContent = failedNum;
    }


    function getDOMStrings() {

        return DOMStrings;
    }

    return {
        collectInputs: collectInputs,
        clearInputs: clearInputs,
        showError: showError,
        displayExamAndStudent,
        displayNumOfStudents,
        getDOMStrings: getDOMStrings,
        displayPassedStudentsNum: displayPassedStudentsNum,
        displayFailedStudentsNum: displayFailedStudentsNum,
        displayPercentage: displayPercentage
    }

})();

var mainController = (function (dataCtrl, UICtrl) {

    function setupEventListeners() {

        var dom = UICtrl.getDOMStrings()

        document.querySelector(dom.addBtn).addEventListener("click", function () {
            displayExamCtrl();
        });
    }

    function updateLength() {

        var total = dataCtrl.getNumOfStudents();

        UICtrl.displayNumOfStudents(total);
    }


    function displayExamCtrl() {

        var input = UICtrl.collectInputs();

        if (!input.subject || !input.studentName || !input.grade || input.grade > 10 || input.grade <= 0) {
            UICtrl.showError(input);
            return;
        }

        var exam = dataCtrl.createExam(input.subject, input.studentName, input.grade);

        UICtrl.displayExamAndStudent(exam);

        
        if (input.grade > 5) {
            var passed = dataCtrl.getNumOfPassedStudents();
            var failed = dataCtrl.getNumOfFailedStudents();
            var all = dataCtrl.getNumOfStudents();
            
            
            UICtrl.displayPercentage(passed,failed, all)
            UICtrl.displayPassedStudentsNum(passed);
        } else {
            var failed = dataCtrl.getNumOfFailedStudents();
            var passed = dataCtrl.getNumOfPassedStudents();
            var all = dataCtrl.getNumOfStudents();
            
            
            UICtrl.displayPercentage(passed,failed, all)            
            UICtrl.displayFailedStudentsNum(failed);
        }
        
        UICtrl.clearInputs();

        updateLength();

    }

    return {
        init: function () {
            setupEventListeners();
        }
    }

})(dataController, UIController);

mainController.init();