import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/user.model.js";

dotenv.config();

const users = [
    ["Aarav", "Sharma", "Software Engineer", "Bengaluru", "Male", ["JavaScript", "React.js", "Node.js", "MongoDB"]],
    ["Aditi", "Verma", "Frontend Developer", "Delhi", "Female", ["React.js", "JavaScript", "HTML", "CSS"]],
    ["Rahul", "Kumar", "Backend Developer", "Noida", "Male", ["Node.js", "Express.js", "MongoDB", "REST APIs"]],
    ["Priya", "Singh", "Full Stack Developer", "Pune", "Female", ["MERN Stack", "React.js", "Node.js", "MongoDB"]],
    ["Arjun", "Patel", "Software Developer", "Ahmedabad", "Male", ["Java", "Spring Boot", "MySQL", "Docker"]],
    ["Neha", "Gupta", "UI/UX Designer", "Mumbai", "Female", ["Figma", "UI Design", "UX Research", "Prototyping"]],
    ["Rohan", "Mehta", "DevOps Engineer", "Hyderabad", "Male", ["AWS", "Docker", "Kubernetes", "Jenkins"]],
    ["Sneha", "Joshi", "Data Analyst", "Indore", "Female", ["Python", "SQL", "Power BI", "Excel"]],
    ["Vikram", "Shah", "Machine Learning Engineer", "Bengaluru", "Male", ["Python", "Machine Learning", "TensorFlow", "SQL"]],
    ["Ananya", "Reddy", "Software Engineer", "Hyderabad", "Female", ["Java", "Spring Boot", "React.js", "PostgreSQL"]],
    ["Karan", "Malhotra", "Product Manager", "Gurugram", "Male", ["Product Management", "Agile", "Jira", "Analytics"]],
    ["Pooja", "Mishra", "Backend Engineer", "Noida", "Female", ["Java", "Spring Boot", "MySQL", "Redis"]],
    
];

const defaultPassword = "Test@12345";

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected");

        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const userDocuments = users.map(
            ([firstName, lastName, headline, location, gender, skills], index) => {
                const cleanFirst = firstName.toLowerCase().replace(/[^a-z]/g, "");
                const cleanLast = lastName.toLowerCase().replace(/[^a-z]/g, "");

                return {
                    firstName,
                    lastName,
                    userName: `${cleanFirst}.${cleanLast}${index + 1}`,
                    email: `${cleanFirst}.${cleanLast}${index + 1}@example.com`,
                    password: hashedPassword,
                    headline,
                    location,
                    gender:gender.toLowerCase(),
                    skills,
                    education: [
                        {
                            institution: "Acropolis Institute of Technology and Research",
                            degree: "B.Tech",
                            fieldOfStudy: "Computer Science",
                            startYear: 2022,
                            endYear: 2026
                        }
                    ],
                    experience: [
                        {
                            title: headline,
                            company: "Tech Solutions Pvt. Ltd.",
                            location,
                            startDate: "2025",
                            endDate: "Present",
                            description: `Working as a ${headline} and building scalable software solutions.`
                        }
                    ]
                };
            }
        );

        let inserted = 0;
        let skipped = 0;

        for (const user of userDocuments) {
            const exists = await User.findOne({
                $or: [
                    { email: user.email },
                    { userName: user.userName }
                ]
            });

            if (exists) {
                skipped++;
                continue;
            }

            await User.create(user);
            inserted++;
        }

        console.log(`\nSeed completed!`);
        console.log(`Users inserted: ${inserted}`);
        console.log(`Users skipped: ${skipped}`);
        console.log(`Default password: ${defaultPassword}`);

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error("Seed error:", error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

seedUsers();

