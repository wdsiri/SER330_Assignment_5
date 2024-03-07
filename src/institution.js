const Course = require('./course.js')
const Student = require('./student.js')
const CourseOffering = require('./course-offering.js')
const Instructor = require('./instructor.js')

class Institution {
  constructor (name, domain) {
    this.name = name
    this.domain = domain
    this.studentList = {}
    this.course_catalog = {}
    this.course_schedule = {}
    this.faculty_list = {}
  }

  list_students () {
    console.log(`\nEnrolled Students (${this.name})\n-------------------------------------------`)

    const studentList = Object.values(this.studentList).map(student => `${student.lastName}, ${student.firstName}`)
    const sortedStudentList = studentList.sort()

    sortedStudentList.forEach(student => console.log(student))

    console.log('\n')
  }

  enroll_student (student) {
    if (student instanceof Student) {
      if (student.username in this.student_list) {
        console.log(`${student.first_name} ${student.last_name} is already enrolled!`)
      } else {
        this.student_list[student.username] = student
      }
    } else {
      throw new TypeError('Only accepts student object')
    }
  }

  register_student_for_course (student, courseName, dept, number, sectionNumber, year, quarter) {
    for (const offering of this.course_schedule[courseName]) {
      if (dept === offering.course.department && number === offering.course.number && year === offering.year && quarter === offering.quarter && sectionNumber === offering.section_number) {
        if (student in this.student_list) {
          if (offering.registered_students.includes(student)) {
            console.log(`\n${student.first_name} ${student.last_name} is already enrolled in this course\n`)
          } else {
            offering.register_students([student])
          }
        }
      }
    }
  }

  list_instructors () {
    console.log(`\nInstructor List (${this.name})\n-------------------------------------------`)
    const facultyList = Object.values(this.faculty_list).map(instructor => `${instructor.last_name}, ${instructor.first_name}`)
    const sortedFacultyList = facultyList.sort()
    sortedFacultyList.forEach(instructor => console.log(instructor))
    console.log('\n')
  }

  hire_instructor (instructor) {
    if (instructor instanceof Instructor) {
      if (instructor.username in this.faculty_list) {
        console.log(`${instructor.first_name} ${instructor.last_name} already works at this institution!`)
      } else {
        this.faculty_list[instructor.username] = instructor
      }
    } else {
      throw new TypeError('Only accepts instructor object')
    }
  }

  assign_instructor (instructor, courseName, dept, number, sectionNumber, year, quarter) {
    for (const offering of this.course_schedule[courseName]) {
      if (dept === offering.course.department && number === offering.course.number && year === offering.year && quarter === offering.quarter && sectionNumber === offering.section_number) {
        if (offering.instructor === instructor) {
          console.log(`${instructor.first_name} ${instructor.last_name} is already teaching this course`)
        } else {
          offering.instructor = instructor
          instructor.course_list.push(offering)
          console.log(`${instructor.first_name} ${instructor.last_name} has been assigned to teach ${offering}`)
        }
      } else {
        console.log('Course not found. Please create a course and course offering')
      }
    }
  }

  list_course_catalog () {
    console.log(`\nCourse Catalog (${this.name})\n----------------------------------------`)
    for (const course of Object.values(this.course_catalog)) {
      console.log(course)
    }
    console.log('\n')
  }

  list_course_schedule (year, quarter, dept = null) {
    if (dept) {
      const schedule = []
      console.log(`\nCourse Schedule (${dept}, ${quarter} ${year})\n----------------------------------------`)
      for (const offerings of Object.values(this.course_schedule)) {
        const filtered = offerings.filter(offering => offering.year === year && offering.quarter === quarter && offering.course.department === dept)
        filtered.forEach(item => schedule.push(item.toString()))
      }
      if (schedule.length) {
        schedule.forEach(item => console.log(item))
      } else {
        console.log('No offerings during this semester')
      }
    } else {
      const schedule = []
      console.log(`\nCourse Schedule (${quarter} ${year})\n----------------------------------------`)
      if (Object.keys(this.course_schedule).length) {
        for (const offerings of Object.values(this.course_schedule)) {
          const filtered = offerings.filter(offering => offering.year === year && offering.quarter === quarter)
          filtered.forEach(item => schedule.push(item.toString()))
        }
        if (schedule.length) {
          schedule.forEach(item => console.log(item))
        } else {
          console.log('No offerings scheduled during this semester')
        }
      } else {
        console.log('No offerings currently scheduled')
      }
    }
  }

  list_registered_students (courseName, dept, number, sectionNumber, year, quarter) {
    for (const offering of this.course_schedule[courseName]) {
      if (dept === offering.course.department && number === offering.course.number && year === offering.year && quarter === offering.quarter && sectionNumber === offering.section_number) {
        console.log(`Registered Students List (${offering})\n------------------------------------------------------------`)
        for (const student of offering.registered_students) {
          console.log(`${student.last_name}, ${student.first_name}`)
        }
      }
    }
  }

  add_course (course) {
    if (course instanceof Course) {
      if (course.name in this.course_catalog) {
        return 'Course has already been added'
      } else {
        this.course_catalog[course.name] = course
      }
    } else {
      throw new TypeError('Only accepts course object as argument')
    }
  }

  add_course_offering (courseOffering) {
    if (courseOffering instanceof CourseOffering) {
      if (courseOffering.course.name in this.course_catalog) {
        this.course_schedule[courseOffering.course.name] = this.course_schedule[courseOffering.course.name] || []
        this.course_schedule[courseOffering.course.name].push(courseOffering)
      } else {
        return 'Please create a course before creating course offering'
      }
    } else {
      throw new TypeError('Only accepts course offering as argument')
    }
  }
}

module.exports = Institution
