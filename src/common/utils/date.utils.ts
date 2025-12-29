import dayjs from 'dayjs';

export class DateUtils {
  static parseDate(dateString: string): Date {
    return dayjs(dateString, 'YYYY-MM-DD').toDate();
  }

  static formatDate(date: Date): string {
    return dayjs(date).format('YYYY-MM-DD');
  }

  static thirtyDaysAgo(): Date {
    return dayjs().subtract(30, 'days').toDate();
  }

  static today(): Date {
    return dayjs().toDate();
  }

  static differenceInHours(start: Date, end: Date): number {
    return dayjs(end).diff(dayjs(start), 'hour', true);
  }

  static isValidDate(dateString: string): boolean {
    return dayjs(dateString, 'YYYY-MM-DD', true).isValid();
  }
}
