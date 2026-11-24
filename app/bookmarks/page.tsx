import type { Metadata } from "next";
import { BookmarksList } from "@/components/progress/BookmarksList";

export const metadata: Metadata = { title: "Bookmarks" };

export default function BookmarksPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight">Bookmarks & Notes</h1>
      <p className="mb-6 mt-2 text-muted-fg">আপনার bookmark করা lesson এবং লেখা notes (শুধু এই browser এ সংরক্ষিত)।</p>
      <BookmarksList />
    </div>
  );
}
