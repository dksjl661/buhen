import { foundations } from "./foundations.js";
import { book } from "./register.js";

export function catalog() {
  const chapters = [{ title: "入门", lessons: foundations.slice() }];
  book.forEach((item) => {
    let chapter = chapters.find((entry) => entry.title === item.chapter);
    if (!chapter) {
      chapter = { title: item.chapter, lessons: [] };
      chapters.push(chapter);
    }
    chapter.lessons.push(item);
  });
  return chapters;
}

export function allLessons() {
  return catalog().flatMap((chapter) => chapter.lessons);
}
