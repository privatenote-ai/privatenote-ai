-- allow_hosted_ai was added manually on production before this migration existed.
-- Fresh environments receive the column from src/auth/schema.sql via baseline sync.
SELECT 1;
