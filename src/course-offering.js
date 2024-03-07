const Student = require('./student.js')

class CourseOffering {
  constructor (course, sectionNumber, year, quarter) {
    this.course = course
    this.section_number = sectionNumber
    this.instructor = null
    this.year = year
    this.quarter = quarter
    this.registered_students = []
    this.grades = {}
  }

  register_students (students) {
    for (const student of students) {
      this.registered_students.push(student)
      student.course_list.push(this)
    }
  }

  get_students () {
    return this.registered_students
  }

  submit_grade (student, grade) {
    const validGrades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F']
    if (student instanceof Student && validGrades.includes(grade)) {
      this.grades[student.username] = grade
      const key = this.toString()
      student.transcript[key] = grade
    } else {
      return 'Please enter a valid grade'
    }
  }

  get_grade (student) {
    if (student instanceof Student) {
      return this.grades[student.username]
    } else {
      return this.grades[student]
    }
  }

  toString () {
    if (this.instructor) {
      return `${this.course.name}, ${this.course.department} ${this.course.number}-${this.section_number}, ${this.instructor.first_name} ${this.instructor.last_name} (${this.quarter} ${this.year})`
    } else {
      return `${this.course.name}, ${this.course.department} ${this.course.number}-${this.section_number} (${this.quarter} ${this.year})`
    }
  }
}

module.exports = CourseOffering
