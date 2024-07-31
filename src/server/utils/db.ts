import { getTableName } from "drizzle-orm";
import { PgSelect } from "drizzle-orm/pg-core";
import { DatabaseError } from "pg";

export function withPagination<T extends PgSelect>(
  qb: T,
  page: number,
  pageSize: number = 10
) {
  return qb.limit(pageSize).offset((page - 1) * pageSize);
}

export const handleCommonPgErrors = (e: DatabaseError): string => {
  console.log(
    //@ts-ignore
    `[DATABSE]: Table ${getTableName(e.table_name)} ==> ${e.name} :: ${
      e.message
    }`
  );

  return `Error occured in database :: ${e.detail}`;
};
