import prisma from "../config/prisma.js";

export const getCourses = async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      where: {
        active: true,
      },
      include: {
        plans: {
          where: {
            active: true,
          },
          orderBy: {
            price: "asc",
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};
