export type ExpertiseCategory = {
    name: string;
    focusAreas: string[];
};

export const expertiseCategories: ExpertiseCategory[] = [
    {
        name: "Admissions",
        focusAreas: [
            "College Applications",
            "Graduate School Applications",
            "Scholarship Applications",
            "Essay Review",
            "Interview Preparation",
            "Test Preparation",
            "School Selection"
        ]
    },
    {
        name: "Professional Opportunities",
        focusAreas: [
            "Resume Review",
            "Cover Letter Writing",
            "Job Search Strategy",
            "Interview Preparation",
            "Career Transition",
            "Networking",
            "LinkedIn Profile Optimization",
            "Salary Negotiation"
        ]
    },
    {
        name: "Tutoring",
        focusAreas: [
            "Mathematics",
            "Sciences",
            "Computer Science",
            "Languages",
            "Humanities",
            "Business",
            "Engineering",
            "Test Preparation"
        ]
    }
];