To connect to database:

1. cd c:\program filer\pgsql\bin
2. pg_ctl -D "C:\apollo-server-postgres" start
3. psql mydatabasename

To install postgres on windows

1. download the archive file from postgres website.

2. extract in wanted position (I chose c:\program filer)

3. go to where you extracted and go to /bin

4. type "postgres --version" to see if it's installed correctly

5. initdb c:\apollo-server-postgres

6. pg_ctl -D "my-place-to-have-server" start

7. createdb mytestdatabase

8. psql mytestdatabase (opens sql shell)

\list - List all of your actual databases.
\c mydatabasename - Connect to another database.
\d - List the relations of your currently connected database.
\d mytablename - Shows information for a specific table.

https://www.robinwieruch.de/postgres-sql-macos-setup

https://www.robinwieruch.de/graphql-apollo-server-tutorial#apollo-server-resolvers

on postgres

pg_ctl -D "c:\postgres-server" start

psql -U postgres -d newtestdb

to test application:

npm run test-server
(new cmd console)
npm test
