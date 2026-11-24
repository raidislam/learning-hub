import type { Metadata } from "next";
import { AssessmentsList } from "@/components/progress/AssessmentsList";

export const metadata: Metadata = { title: "Assessments" };

export default function AssessmentsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
      <p className="mb-6 mt-2 text-muted-fg">
        প্রতিটি lesson এর শেষে ৫টি MCQ ও ২টি coding প্রশ্ন আছে। এখানে আপনার সেরা ফলাফল দেখা যাবে। Topic complete হতে MCQ তে কমপক্ষে ৮০% এবং ৪টি self-check দরকার।
      </p>
      <AssessmentsList />
    </div>
  );
}
