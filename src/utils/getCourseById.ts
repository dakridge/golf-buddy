import config from "../config";

const getCourseById = (id: string) => {
    const course = Object.values(config.courses).find((course) => course.id === id);

    if (!course) {
        throw new Error(`Could not find course with id ${id}`);
    }

    return course;
}

export default getCourseById;