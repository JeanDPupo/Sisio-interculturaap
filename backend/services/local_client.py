"""
Cliente local para Sisio que replica la API fluida del cliente Supabase.

Permite ejecutar el backend sin un proyecto Supabase remoto usando SQLite.
Métodos soportados (similares a postgrest-py):
  - table("x").select("col1,col2" o "*", count="exact").eq("col", val).ilike(...).limit(n).execute()
  - table("x").insert({...}).execute()
  - table("x").update({...}).eq("col", val).execute()
  - table("x").delete().eq("col", val).execute()
  - El resultado de .execute() tiene .data (lista de dicts) y .count (int opcional).
"""
import sqlite3
import os
import uuid
from datetime import datetime, timezone

DB_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "sisio_local.db",
)


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _filters_to_sql(filters):
    """Convierte filtros (col, op, val) a (where_clause, params)."""
    clauses = []
    params = []
    for col, op, val in filters:
        if op == "eq":
            clauses.append(f'"{col}" = ?')
            params.append(val)
        elif op == "ilike":
            clauses.append(f'"{col}" LIKE ? ESCAPE "\\"')
            params.append(f"%{str(val).strip('%')}%")
        elif op == "is":
            if val is None:
                clauses.append(f'"{col}" IS NULL')
            else:
                clauses.append(f'"{col}" IS ?')
                params.append(val)
        else:
            clauses.append(f'"{col}" = ?')
            params.append(val)
    where = (" WHERE " + " AND ".join(clauses)) if clauses else ""
    return where, params


class QueryResult:
    def __init__(self, data, count=None):
        self.data = data
        self.count = count


class _QueryBuilder:
    def __init__(self, table, client, select_cols="*", count=None):
        self.table = table
        self.client = client
        self.select_cols = select_cols
        self.count = count
        self.filters = []
        self.limit_val = None
        self.offset_val = None
        self.order_col = None
        self.order_asc = True

    def eq(self, col, val):
        self.filters.append((col, "eq", val))
        return self

    def ilike(self, col, val):
        self.filters.append((col, "ilike", val))
        return self

    def is_(self, col, val):
        self.filters.append((col, "is", val))
        return self

    def limit(self, n):
        self.limit_val = n
        return self

    def offset(self, n):
        self.offset_val = n
        return self

    def order(self, col, desc=False):
        self.order_col = col
        self.order_asc = not desc
        return self

    def execute(self):
        return self.client._execute_query(self)


class _InsertBuilder:
    def __init__(self, table, client, rows):
        self.table = table
        self.client = client
        self.rows = rows if isinstance(rows, list) else [rows]

    def execute(self):
        return self.client._execute_insert(self.table, self.rows)


class _UpdateBuilder:
    def __init__(self, table, client, data):
        self.table = table
        self.client = client
        self.data = data
        self.filters = []

    def eq(self, col, val):
        self.filters.append((col, "eq", val))
        return self

    def ilike(self, col, val):
        self.filters.append((col, "ilike", val))
        return self

    def execute(self):
        return self.client._execute_update(self.table, self.data, self.filters)


class _DeleteBuilder:
    def __init__(self, table, client):
        self.table = table
        self.client = client
        self.filters = []

    def eq(self, col, val):
        self.filters.append((col, "eq", val))
        return self

    def execute(self):
        return self.client._execute_delete(self.table, self.filters)


class LocalClient:
    """Cliente SQLite compatible con la subparte de Supabase usada."""

    def __init__(self, db_path=DB_PATH):
        self.db_path = db_path
        self._conn = sqlite3.connect(self.db_path, check_same_thread=False)
        self._conn.row_factory = sqlite3.Row
        self._conn.execute("PRAGMA foreign_keys = OFF")

    def table(self, name):
        return _TableRef(self, name)

    # ---- internals ----

    def _cols_sql(self, select_cols):
        if isinstance(select_cols, str) or select_cols is None:
            select_cols = (select_cols or "*").split(",")
        parts = []
        for c in select_cols:
            c = c.strip()
            parts.append("*" if c == "*" else f'"{c}"')
        return ", ".join(parts) if parts else "*"

    def _execute_query(self, qb):
        sel_sql = self._cols_sql(qb.select_cols)
        sql = f'SELECT {sel_sql} FROM "{qb.table}"'
        where, params = _filters_to_sql(qb.filters)
        sql += where
        if qb.order_col:
            sql += f' ORDER BY "{qb.order_col}" {"ASC" if qb.order_asc else "DESC"}'
        if qb.limit_val is not None:
            sql += f" LIMIT {int(qb.limit_val)}"
        if qb.offset_val is not None:
            sql += f" OFFSET {int(qb.offset_val)}"
        cur = self._conn.execute(sql, params)
        rows = cur.fetchall()
        data = [dict(r) for r in rows]
        count = None
        if qb.count is not None:
            cnt, = self._conn.execute(
                f'SELECT COUNT(*) FROM "{qb.table}"' + where, params
            ).fetchone()
            count = int(cnt)
        return QueryResult(data, count=count)

    def _execute_insert(self, table, rows):
        inserted = []
        for row in rows:
            data = dict(row)
            cols = list(data.keys())
            if "id" in cols and not data.get("id"):
                data["id"] = str(uuid.uuid4())
            if "created_at" in cols and not data.get("created_at"):
                data["created_at"] = _now()
            if "updated_at" in cols and not data.get("updated_at"):
                data["updated_at"] = _now()
            col_sql = ", ".join(f'"{c}"' for c in data)
            placeholders = ", ".join("?" for _ in data)
            sql = f'INSERT INTO "{table}" ({col_sql}) VALUES ({placeholders})'
            self._conn.execute(sql, list(data.values()))
            inserted.append(data)
        self._conn.commit()
        return QueryResult(data=inserted, count=None)

    def _execute_update(self, table, data, filters):
        data = dict(data)
        if "updated_at" in data and not data.get("updated_at"):
            data["updated_at"] = _now()
        cols = list(data.keys())
        set_sql = ", ".join(f'"{c}" = ?' for c in cols)
        params = [data[c] for c in cols]
        where, where_params = _filters_to_sql(filters)
        sql = f'UPDATE "{table}" SET {set_sql}{where}'
        cur = self._conn.execute(sql, params + where_params)
        self._conn.commit()
        rows = self._conn.execute(f'SELECT * FROM "{table}"' + where, where_params).fetchall()
        updated = [dict(r) for r in rows]
        return QueryResult(data=updated, count=cur.rowcount)

    def _execute_delete(self, table, filters):
        where, params = _filters_to_sql(filters)
        sql = f'DELETE FROM "{table}"' + where
        cur = self._conn.execute(sql, params)
        self._conn.commit()
        return QueryResult(data=[], count=cur.rowcount)


class _TableRef:
    def __init__(self, client, name):
        self.client = client
        self.name = name

    def select(self, cols="*", count=None):
        return _QueryBuilder(self.name, self.client, cols, count)

    def insert(self, data):
        return _InsertBuilder(self.name, self.client, data)

    def update(self, data):
        return _UpdateBuilder(self.name, self.client, data)

    def delete(self):
        return _DeleteBuilder(self.name, self.client)


_client = None


def get_client() -> LocalClient:
    global _client
    if _client is None:
        _client = LocalClient()
    return _client


DB_PATH = DB_PATH