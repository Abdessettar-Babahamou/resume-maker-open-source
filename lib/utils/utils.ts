import { InsertCertficate, InsertExperineces } from "../db/schema";
import { format, parseISO } from "date-fns";

export const sortByDate = <T extends { startDate?: string | null,createdDate?: string | null }>(
  items: T[]
): T[] => {
  return items.sort((a, b) => {
    const dateA = a.startDate ? parseISO(a.startDate) : a.createdDate ? parseISO(a.createdDate) : new Date(0);
    const dateB = b.startDate ? parseISO(b.startDate) : b.createdDate ? parseISO(b.createdDate) : new Date(0);
    return dateB.getTime() - dateA.getTime();
  });
};

export const sortExperiencesByDate = (experiences: InsertExperineces[]): InsertExperineces[] => 
  sortByDate(experiences);

export const sortCertificatesByDate = (certificates: InsertCertficate[]): InsertCertficate[] => 
  sortByDate(certificates);

export const formatDate = (dateString: string): string => 
  format(dateString, "MMM yyyy");